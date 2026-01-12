import { Test, TestingModule } from '@nestjs/testing';
import { BookingService } from './booking.service';
import { PrismaService } from '../../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';

describe('BookingService', () => {
  let service: BookingService;
  let prismaService: PrismaService;
  let eventEmitter: EventEmitter2;

  const mockPrismaService = {
    $transaction: jest.fn(),
    appt_slots: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    appt_bookings: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    users: {
      findUnique: jest.fn(),
    },
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    prismaService = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createBooking', () => {
    const createBookingDto = {
      patientId: 'patient-uuid-123',
      clinicianId: 'clinician-uuid-456',
      slotId: 'slot-uuid-789',
      startTime: '2024-01-15T09:00:00Z',
      endTime: '2024-01-15T09:30:00Z',
      reasonForVisit: 'General checkup',
    };

    const mockSlot = {
      id: 'slot-uuid-789',
      clinician_id: 'clinician-uuid-456',
      status: 'Available',
      version: 1,
      time_range: '[2024-01-15 09:00:00+00,2024-01-15 09:30:00+00)',
    };

    const mockBooking = {
      id: 'booking-uuid-123',
      patient_id: 'patient-uuid-123',
      slot_id: 'slot-uuid-789',
      status: 'Pending',
      reason_for_visit: 'General checkup',
      is_walk_in: false,
      users: {
        id: 'patient-uuid-123',
        first_name: 'Demo',
        last_name: 'Patient',
        email: 'patient@citycare.com',
      },
      appt_slots: {
        id: 'slot-uuid-789',
        clinician_id: 'clinician-uuid-456',
        users: {
          first_name: 'Dr. Demo',
          last_name: 'Clinician',
        },
      },
    };

    it('should successfully create a booking for available slot', async () => {
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          appt_slots: {
            findUnique: jest.fn().mockResolvedValue(mockSlot),
            update: jest.fn().mockResolvedValue({ ...mockSlot, status: 'Booked' }),
          },
          appt_bookings: {
            create: jest.fn().mockResolvedValue(mockBooking),
          },
        });
      });

      const result = await service.createBooking(createBookingDto);

      expect(result).toHaveProperty('id');
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('booking.created', expect.any(Object));
    });

    it('should throw NotFoundException for non-existent slot', async () => {
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          appt_slots: {
            findUnique: jest.fn().mockResolvedValue(null),
          },
        });
      });

      await expect(service.createBooking(createBookingDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ConflictException for already booked slot', async () => {
      const bookedSlot = { ...mockSlot, status: 'Booked' };
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          appt_slots: {
            findUnique: jest.fn().mockResolvedValue(bookedSlot),
          },
        });
      });

      await expect(service.createBooking(createBookingDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('getPatientBookings', () => {
    const patientId = 'patient-uuid-123';
    const mockBookings = [
      {
        id: 'booking-1',
        patient_id: patientId,
        status: 'Confirmed',
        reason_for_visit: 'Checkup',
        appt_slots: {
          id: 'slot-1',
          time_range: '[2024-01-15 09:00:00+00,2024-01-15 09:30:00+00)',
          users: { first_name: 'Dr. A', last_name: 'Smith' },
        },
      },
      {
        id: 'booking-2',
        patient_id: patientId,
        status: 'Pending',
        reason_for_visit: 'Follow-up',
        appt_slots: {
          id: 'slot-2',
          time_range: '[2024-01-16 10:00:00+00,2024-01-16 10:30:00+00)',
          users: { first_name: 'Dr. B', last_name: 'Jones' },
        },
      },
    ];

    it('should return all bookings for a patient', async () => {
      mockPrismaService.appt_bookings.findMany.mockResolvedValue(mockBookings);

      const result = await service.getPatientBookings(patientId);

      expect(result).toHaveLength(2);
      expect(mockPrismaService.appt_bookings.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { patient_id: patientId },
        }),
      );
    });

    it('should return empty array for patient with no bookings', async () => {
      mockPrismaService.appt_bookings.findMany.mockResolvedValue([]);

      const result = await service.getPatientBookings('patient-no-bookings');

      expect(result).toHaveLength(0);
    });
  });

  describe('cancelBooking', () => {
    const bookingId = 'booking-uuid-123';
    const patientId = 'patient-uuid-123';

    const mockBooking = {
      id: bookingId,
      patient_id: patientId,
      slot_id: 'slot-uuid-789',
      status: 'Pending',
    };

    it('should successfully cancel a pending booking', async () => {
      mockPrismaService.appt_bookings.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.$transaction.mockImplementation(async (callback) => {
        return callback({
          appt_bookings: {
            update: jest.fn().mockResolvedValue({ ...mockBooking, status: 'Cancelled' }),
          },
          appt_slots: {
            update: jest.fn().mockResolvedValue({ status: 'Available' }),
          },
        });
      });

      const result = await service.cancelBooking(bookingId, patientId);

      expect(result.status).toBe('Cancelled');
    });

    it('should throw NotFoundException for non-existent booking', async () => {
      mockPrismaService.appt_bookings.findUnique.mockResolvedValue(null);

      await expect(service.cancelBooking('non-existent-id', patientId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for already cancelled booking', async () => {
      const cancelledBooking = { ...mockBooking, status: 'Cancelled' };
      mockPrismaService.appt_bookings.findUnique.mockResolvedValue(cancelledBooking);

      await expect(service.cancelBooking(bookingId, patientId)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when patient does not own booking', async () => {
      mockPrismaService.appt_bookings.findUnique.mockResolvedValue(mockBooking);

      await expect(service.cancelBooking(bookingId, 'different-patient-id')).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateBookingStatus', () => {
    const bookingId = 'booking-uuid-123';

    it('should update booking status to Confirmed', async () => {
      const mockBooking = {
        id: bookingId,
        status: 'Pending',
      };

      mockPrismaService.appt_bookings.findUnique.mockResolvedValue(mockBooking);
      mockPrismaService.appt_bookings.update.mockResolvedValue({ ...mockBooking, status: 'Confirmed' });

      const result = await service.updateBookingStatus(bookingId, 'Confirmed');

      expect(result.status).toBe('Confirmed');
    });

    it('should throw NotFoundException for non-existent booking', async () => {
      mockPrismaService.appt_bookings.findUnique.mockResolvedValue(null);

      await expect(service.updateBookingStatus('non-existent-id', 'Confirmed')).rejects.toThrow(NotFoundException);
    });
  });
});
