import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../../notification/notification.service';
import { CreateBookingDto } from '../dto/create-booking.dto';
import { UpdateBookingDto } from '../dto/update-booking.dto';

/**
 * BookingService - Domain Service for Appointment Booking Management
 * 
 * PURPOSE:
 * Manages the complete lifecycle of appointment bookings:
 * - Creation, retrieval, updates
 * - Cancellation and rescheduling
 * - Status management
 * 
 * BUSINESS RULES:
 * 1. Patients can only book Available slots
 * 2. One patient per slot (enforced by slot status change)
 * 3. Cancelled bookings free up the slot
 * 4. Rescheduling validates new slot availability
 * 5. Walk-ins are handled by WalkInManagerService
 */
@Injectable()
export class BookingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  /**
   * Create a new appointment booking
   *
   * @param dto - Booking creation details
   * @returns Created booking with patient and slot info
   * @throws NotFoundException if patient or slot not found
   * @throws ConflictException if slot is not available
   */
  async createBooking(dto: CreateBookingDto) {
    // Verify patient exists
    const patient = await this.prisma.users.findUnique({
      where: { id: dto.patientId },
      select: { id: true, first_name: true, last_name: true, email: true },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${dto.patientId} not found`);
    }

    // Create booking and update slot status in transaction with row-level locking
    return this.prisma.$transaction(async (tx) => {
      // Lock the slot row and check availability atomically to prevent double-booking
      console.log(`[BookingService] Attempting to lock and book slot ${dto.slotId}`);

      const slotCheck = await tx.$queryRaw<Array<{
        id: string;
        status: string;
        clinician_id: string;
        first_name: string;
        last_name: string;
      }>>`
        SELECT s.id, s.status, s.clinician_id, u.first_name, u.last_name
        FROM appt_slots s
        JOIN users u ON s.clinician_id = u.id
        WHERE s.id = ${dto.slotId}::uuid
        FOR UPDATE NOWAIT
      `;

      if (slotCheck.length === 0) {
        throw new NotFoundException(`Slot with ID ${dto.slotId} not found`);
      }

      const slot = slotCheck[0];

      if (slot.status !== 'Available') {
        throw new ConflictException(`Slot is ${slot.status} and cannot be booked. It may have been booked by another user.`);
      }

      // Update slot to Booked
      console.log(`[BookingService] Updating slot ${dto.slotId} to Booked status`);

      const updateResult = await tx.$queryRaw<Array<any>>`
        UPDATE appt_slots
        SET status = 'Booked', version = version + 1
        WHERE id = ${dto.slotId}::uuid AND status = 'Available'
        RETURNING id, status
      `;

      console.log(`[BookingService] Slot update result:`, updateResult);

      if (updateResult.length === 0) {
        throw new ConflictException(`Failed to book slot - it may have been booked by another user`);
      }

      // Create booking
      const booking = await tx.appt_bookings.create({
        data: {
          patient_id: dto.patientId,
          slot_id: dto.slotId,
          status: 'Pending',
          reason_for_visit: dto.reasonForVisit,
          is_walk_in: false,
        },
        include: {
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      });

      console.log(`[BookingService] Booking created with ID: ${booking.id}`);

      // Get slot time for notification
      const slotTime = await tx.$queryRaw<Array<{ start_time: Date }>>`
        SELECT lower(time_range) as start_time
        FROM appt_slots
        WHERE id = ${dto.slotId}::uuid
      `;

      const bookingResult = {
        id: booking.id,
        patientId: booking.patient_id,
        slotId: booking.slot_id,
        status: booking.status,
        reasonForVisit: booking.reason_for_visit,
        isWalkIn: booking.is_walk_in,
        patient: booking.users,
        clinician: {
          id: slot.clinician_id,
          first_name: slot.first_name,
          last_name: slot.last_name,
        },
        message: 'Booking created successfully',
      };

      // Send notification to patient (outside transaction to not block)
      const appointmentDate = slotTime[0]?.start_time
        ? new Date(slotTime[0].start_time).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : 'your scheduled time';

      // Avoid duplicate "Dr." prefix if first_name already contains it
      const doctorPrefix = slot.first_name?.startsWith('Dr.') ? '' : 'Dr. ';
      const doctorName = `${doctorPrefix}${slot.first_name} ${slot.last_name}`;

      this.notificationService.notifyAppointmentBooked(dto.patientId, {
        date: appointmentDate,
        doctorName,
        bookingId: booking.id,
      }).catch(err => console.error('Failed to send booking notification:', err));

      // Send notification to clinician about the new booking
      const patientName = `${patient.first_name} ${patient.last_name}`;
      this.notificationService.notifyClinicianNewAppointment(slot.clinician_id, {
        date: appointmentDate,
        patientName,
        bookingId: booking.id,
      }).catch(err => console.error('Failed to send clinician notification:', err));

      return bookingResult;
    });
  }

  /**
   * Get all appointments for a specific patient
   * 
   * @param patientId - Patient UUID
   * @returns List of patient's appointments with slot and clinician info
   * @throws NotFoundException if patient not found
   */
  async getPatientAppointments(patientId: string) {
    // Verify patient exists
    const patient = await this.prisma.users.findUnique({
      where: { id: patientId },
      select: { id: true },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${patientId} not found`);
    }

    const bookings = await this.prisma.appt_bookings.findMany({
      where: { patient_id: patientId },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        appt_slots: {
          include: {
            users: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
      orderBy: {
        appt_slots: {
          status: 'asc',
        },
      },
    });

    // Get time ranges for each slot using raw SQL
    const bookingsWithTimes = await Promise.all(
      bookings.map(async (booking) => {
        if (booking.slot_id) {
          const timeRange = await this.prisma.$queryRaw<Array<any>>`
            SELECT 
              lower(time_range) as start_time,
              upper(time_range) as end_time
            FROM appt_slots
            WHERE id = ${booking.slot_id}::uuid
          `;

          return {
            id: booking.id,
            status: booking.status,
            reasonForVisit: booking.reason_for_visit,
            isWalkIn: booking.is_walk_in,
            patient: booking.users,
            clinician: booking.appt_slots?.users,
            slot: {
              id: booking.slot_id,
              startTime: timeRange[0]?.start_time
                ? new Date(timeRange[0].start_time).toISOString()
                : null,
              endTime: timeRange[0]?.end_time
                ? new Date(timeRange[0].end_time).toISOString()
                : null,
              status: booking.appt_slots?.status,
            },
          };
        }

        return {
          id: booking.id,
          status: booking.status,
          reasonForVisit: booking.reason_for_visit,
          isWalkIn: booking.is_walk_in,
          patient: booking.users,
          clinician: booking.appt_slots?.users,
          slot: null,
        };
      }),
    );

    return bookingsWithTimes;
  }

  /**
   * Get a specific booking by ID
   * 
   * @param bookingId - Booking UUID
   * @returns Booking details with patient, clinician, and slot info
   * @throws NotFoundException if booking not found
   */
  async getBookingById(bookingId: string) {
    const booking = await this.prisma.appt_bookings.findUnique({
      where: { id: bookingId },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
          },
        },
        appt_slots: {
          include: {
            users: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    // Get slot time range
    let slotTimes: { startTime: string | null; endTime: string | null } | null = null;
    if (booking.slot_id) {
      const timeRange = await this.prisma.$queryRaw<Array<any>>`
        SELECT
          lower(time_range) as start_time,
          upper(time_range) as end_time
        FROM appt_slots
        WHERE id = ${booking.slot_id}::uuid
      `;

      slotTimes = {
        startTime: timeRange[0]?.start_time
          ? new Date(timeRange[0].start_time).toISOString()
          : null,
        endTime: timeRange[0]?.end_time
          ? new Date(timeRange[0].end_time).toISOString()
          : null,
      };
    }

    return {
      id: booking.id,
      status: booking.status,
      reasonForVisit: booking.reason_for_visit,
      isWalkIn: booking.is_walk_in,
      patient: booking.users,
      clinician: booking.appt_slots?.users,
      slot: booking.slot_id
        ? {
            id: booking.slot_id,
            startTime: slotTimes?.startTime ?? null,
            endTime: slotTimes?.endTime ?? null,
            status: booking.appt_slots?.status,
          }
        : null,
    };
  }

  /**
   * Update booking details (partial update)
   * 
   * @param bookingId - Booking UUID
   * @param dto - Fields to update
   * @returns Updated booking
   * @throws NotFoundException if booking not found
   * @throws ConflictException if trying to update completed/cancelled booking
   */
  async updateBooking(bookingId: string, dto: UpdateBookingDto) {
    // Check if booking exists
    const existingBooking = await this.prisma.appt_bookings.findUnique({
      where: { id: bookingId },
    });

    if (!existingBooking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    // Prevent updates to completed or cancelled bookings
    if (existingBooking.status === 'Completed' || existingBooking.status === 'Cancelled') {
      throw new ConflictException(
        `Cannot update ${existingBooking.status.toLowerCase()} booking`,
      );
    }

    // Update booking
    const updatedBooking = await this.prisma.appt_bookings.update({
      where: { id: bookingId },
      data: {
        reason_for_visit: dto.reasonForVisit,
        status: dto.status,
      },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        appt_slots: {
          include: {
            users: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
      },
    });

    return {
      id: updatedBooking.id,
      status: updatedBooking.status,
      reasonForVisit: updatedBooking.reason_for_visit,
      isWalkIn: updatedBooking.is_walk_in,
      patient: updatedBooking.users,
      clinician: updatedBooking.appt_slots?.users,
      message: 'Booking updated successfully',
    };
  }

  /**
   * Cancel a booking
   * Frees up the slot for other patients
   * 
   * @param bookingId - Booking UUID
   * @returns Cancellation confirmation
   * @throws NotFoundException if booking not found
   * @throws ConflictException if booking already cancelled or completed
   */
  async cancelBooking(bookingId: string) {
    const booking = await this.prisma.appt_bookings.findUnique({
      where: { id: bookingId },
      include: {
        appt_slots: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    if (booking.status === 'Cancelled') {
      throw new ConflictException('Booking is already cancelled');
    }

    if (booking.status === 'Completed') {
      throw new ConflictException('Cannot cancel a completed booking');
    }

    // Get slot, clinician, and patient info for notifications
    let appointmentDate = 'your scheduled time';
    let doctorName = 'your doctor';
    let clinicianId: string | null = null;
    let patientName = 'Patient';

    // Get patient info
    if (booking.patient_id) {
      const patient = await this.prisma.users.findUnique({
        where: { id: booking.patient_id },
        select: { first_name: true, last_name: true },
      });
      if (patient) {
        patientName = `${patient.first_name} ${patient.last_name}`;
      }
    }

    if (booking.slot_id) {
      const slotInfo = await this.prisma.$queryRaw<Array<{ start_time: Date; first_name: string; last_name: string; clinician_id: string }>>`
        SELECT lower(s.time_range) as start_time, u.first_name, u.last_name, s.clinician_id
        FROM appt_slots s
        JOIN users u ON s.clinician_id = u.id
        WHERE s.id = ${booking.slot_id}::uuid
      `;
      if (slotInfo[0]) {
        appointmentDate = new Date(slotInfo[0].start_time).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
        // Avoid duplicate "Dr." prefix if first_name already contains it
        const doctorPrefix = slotInfo[0].first_name?.startsWith('Dr.') ? '' : 'Dr. ';
        doctorName = `${doctorPrefix}${slotInfo[0].first_name} ${slotInfo[0].last_name}`;
        clinicianId = slotInfo[0].clinician_id;
      }
    }

    // Cancel booking and free up slot in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Update booking status
      await tx.appt_bookings.update({
        where: { id: bookingId },
        data: { status: 'Cancelled' },
      });

      // Free up the slot if it exists
      if (booking.slot_id) {
        await tx.appt_slots.update({
          where: { id: booking.slot_id },
          data: { status: 'Available' },
        });
      }

      return {
        message: 'Booking cancelled successfully',
        bookingId,
        slotId: booking.slot_id,
      };
    });

    // Send cancellation notification to patient
    if (booking.patient_id) {
      this.notificationService.notifyAppointmentCancelled(booking.patient_id, {
        date: appointmentDate,
        doctorName,
        bookingId,
      }).catch(err => console.error('Failed to send patient cancellation notification:', err));
    }

    // Send cancellation notification to clinician
    if (clinicianId) {
      this.notificationService.notifyClinicianAppointmentCancelled(clinicianId, {
        date: appointmentDate,
        patientName,
        bookingId,
      }).catch(err => console.error('Failed to send clinician cancellation notification:', err));
    }

    return result;
  }

  /**
   * Reschedule a booking to a new time slot
   *
   * @param bookingId - Current booking UUID
   * @param newSlotId - New slot UUID
   * @param reason - Optional reason for rescheduling
   * @returns Updated booking with new slot
   * @throws NotFoundException if booking or new slot not found
   * @throws ConflictException if new slot not available
   */
  async rescheduleBooking(bookingId: string, newSlotId: string, reason?: string) {
    const booking = await this.prisma.appt_bookings.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID ${bookingId} not found`);
    }

    if (booking.status === 'Cancelled') {
      throw new ConflictException('Cannot reschedule a cancelled booking');
    }

    if (booking.status === 'Completed') {
      throw new ConflictException('Cannot reschedule a completed booking');
    }

    // Verify new slot exists and is available
    const newSlot = await this.prisma.appt_slots.findUnique({
      where: { id: newSlotId },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    if (!newSlot) {
      throw new NotFoundException(`New slot with ID ${newSlotId} not found`);
    }

    if (newSlot.status !== 'Available') {
      throw new ConflictException(`New slot is ${newSlot.status} and cannot be booked`);
    }

    // Get patient info for clinician notification
    let patientName = 'Patient';
    if (booking.patient_id) {
      const patient = await this.prisma.users.findUnique({
        where: { id: booking.patient_id },
        select: { first_name: true, last_name: true },
      });
      if (patient) {
        patientName = `${patient.first_name} ${patient.last_name}`;
      }
    }

    // Get new slot time for notification
    const newSlotTime = await this.prisma.$queryRaw<Array<{ start_time: Date }>>`
      SELECT lower(time_range) as start_time
      FROM appt_slots
      WHERE id = ${newSlotId}::uuid
    `;

    const newAppointmentDate = newSlotTime[0]?.start_time
      ? new Date(newSlotTime[0].start_time).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'your new scheduled time';

    // Reschedule in transaction
    const result = await this.prisma.$transaction(async (tx) => {
      // Free up old slot if it exists
      if (booking.slot_id) {
        await tx.appt_slots.update({
          where: { id: booking.slot_id },
          data: { status: 'Available' },
        });
      }

      // Mark new slot as booked
      await tx.appt_slots.update({
        where: { id: newSlotId },
        data: { status: 'Booked' },
      });

      // Update booking
      const updatedBooking = await tx.appt_bookings.update({
        where: { id: bookingId },
        data: {
          slot_id: newSlotId,
          status: 'Pending', // Reset to Pending after reschedule
        },
        include: {
          users: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              email: true,
            },
          },
        },
      });

      return {
        id: updatedBooking.id,
        patientId: updatedBooking.patient_id,
        oldSlotId: booking.slot_id,
        newSlotId: newSlotId,
        status: updatedBooking.status,
        reasonForVisit: updatedBooking.reason_for_visit,
        patient: updatedBooking.users,
        clinician: newSlot.users,
        message: 'Booking rescheduled successfully',
      };
    });

    // Send reschedule notification to patient
    if (booking.patient_id) {
      // Avoid duplicate "Dr." prefix if first_name already contains it
      const doctorPrefix = newSlot.users?.first_name?.startsWith('Dr.') ? '' : 'Dr. ';
      const doctorName = `${doctorPrefix}${newSlot.users?.first_name} ${newSlot.users?.last_name}`;
      this.notificationService.notifyAppointmentRescheduled(booking.patient_id, {
        newDate: newAppointmentDate,
        doctorName,
        bookingId,
        reason,
      }).catch(err => console.error('Failed to send patient reschedule notification:', err));
    }

    // Send reschedule notification to clinician
    if (newSlot.users?.id) {
      this.notificationService.notifyClinicianAppointmentRescheduled(newSlot.users.id, {
        newDate: newAppointmentDate,
        patientName,
        bookingId,
        reason,
      }).catch(err => console.error('Failed to send clinician reschedule notification:', err));
    }

    return { ...result, reason };
  }
}
