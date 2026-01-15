import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateNotificationDto {
  userId: string;
  type: 'appointment' | 'lab_result' | 'invoice' | 'prescription' | 'system';
  title: string;
  message: string;
  referenceId?: string;
  referenceType?: string;
}

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateNotificationDto) {
    return this.prisma.notifications.create({
      data: {
        user_id: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        reference_id: data.referenceId,
        reference_type: data.referenceType,
      },
    });
  }

  async findAllForUser(userId: string, limit = 20) {
    return this.prisma.notifications.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });
  }

  async getUnreadCount(userId: string) {
    return this.prisma.notifications.count({
      where: {
        user_id: userId,
        is_read: false,
      },
    });
  }

  async markAsRead(notificationId: string, userId: string) {
    return this.prisma.notifications.updateMany({
      where: {
        id: notificationId,
        user_id: userId,
      },
      data: { is_read: true },
    });
  }

  async markAllAsRead(userId: string) {
    return this.prisma.notifications.updateMany({
      where: {
        user_id: userId,
        is_read: false,
      },
      data: { is_read: true },
    });
  }

  async delete(notificationId: string, userId: string) {
    return this.prisma.notifications.deleteMany({
      where: {
        id: notificationId,
        user_id: userId,
      },
    });
  }

  // Helper methods for creating specific notification types
  async notifyAppointmentBooked(userId: string, appointmentDetails: { date: string; doctorName: string; bookingId: string }) {
    return this.create({
      userId,
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: `Your appointment with ${appointmentDetails.doctorName} on ${appointmentDetails.date} has been confirmed.`,
      referenceId: appointmentDetails.bookingId,
      referenceType: 'booking',
    });
  }

  async notifyClinicianNewAppointment(clinicianId: string, appointmentDetails: { date: string; patientName: string; bookingId: string }) {
    return this.create({
      userId: clinicianId,
      type: 'appointment',
      title: 'New Appointment Booked',
      message: `New appointment with ${appointmentDetails.patientName} on ${appointmentDetails.date}.`,
      referenceId: appointmentDetails.bookingId,
      referenceType: 'booking',
    });
  }

  async notifyClinicianAppointmentCancelled(clinicianId: string, appointmentDetails: { date: string; patientName: string; bookingId: string }) {
    return this.create({
      userId: clinicianId,
      type: 'appointment',
      title: 'Appointment Cancelled',
      message: `Appointment with ${appointmentDetails.patientName} on ${appointmentDetails.date} has been cancelled.`,
      referenceId: appointmentDetails.bookingId,
      referenceType: 'booking',
    });
  }

  async notifyClinicianAppointmentRescheduled(clinicianId: string, appointmentDetails: { newDate: string; patientName: string; bookingId: string; reason?: string }) {
    const reasonText = appointmentDetails.reason ? ` Reason: ${appointmentDetails.reason}` : '';
    return this.create({
      userId: clinicianId,
      type: 'appointment',
      title: 'Appointment Rescheduled',
      message: `Appointment with ${appointmentDetails.patientName} has been rescheduled to ${appointmentDetails.newDate}.${reasonText}`,
      referenceId: appointmentDetails.bookingId,
      referenceType: 'booking',
    });
  }

  async notifyAppointmentCancelled(userId: string, appointmentDetails: { date: string; doctorName: string; bookingId: string }) {
    return this.create({
      userId,
      type: 'appointment',
      title: 'Appointment Cancelled',
      message: `Your appointment with ${appointmentDetails.doctorName} on ${appointmentDetails.date} has been cancelled.`,
      referenceId: appointmentDetails.bookingId,
      referenceType: 'booking',
    });
  }

  async notifyAppointmentRescheduled(userId: string, appointmentDetails: { newDate: string; doctorName: string; bookingId: string; reason?: string }) {
    const reasonText = appointmentDetails.reason ? ` Reason: ${appointmentDetails.reason}` : '';
    return this.create({
      userId,
      type: 'appointment',
      title: 'Appointment Rescheduled',
      message: `Your appointment with ${appointmentDetails.doctorName} has been rescheduled to ${appointmentDetails.newDate}.${reasonText}`,
      referenceId: appointmentDetails.bookingId,
      referenceType: 'booking',
    });
  }

  async notifyLabResultReady(userId: string, labDetails: { testName: string; resultId: string }) {
    return this.create({
      userId,
      type: 'lab_result',
      title: 'Lab Results Available',
      message: `Your ${labDetails.testName} results are now available. Please review them in your dashboard.`,
      referenceId: labDetails.resultId,
      referenceType: 'lab_result',
    });
  }

  async notifyInvoiceCreated(userId: string, invoiceDetails: { amount: string; invoiceId: string }) {
    return this.create({
      userId,
      type: 'invoice',
      title: 'New Invoice',
      message: `A new invoice for ${invoiceDetails.amount} has been generated. Please review your billing page.`,
      referenceId: invoiceDetails.invoiceId,
      referenceType: 'invoice',
    });
  }

  async notifyPrescriptionAdded(userId: string, prescriptionDetails: { medicationName: string; prescriptionId: string }) {
    return this.create({
      userId,
      type: 'prescription',
      title: 'New Prescription',
      message: `A new prescription for ${prescriptionDetails.medicationName} has been added to your records.`,
      referenceId: prescriptionDetails.prescriptionId,
      referenceType: 'prescription',
    });
  }
}
