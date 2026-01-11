import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { AppointmentBookedEvent } from '../events/appointment-booked.event';
import { AppointmentCancelledEvent } from '../events/appointment-cancelled.event';

/**
 * AppointmentListener
 * 
 * Handles domain events emitted by the scheduling module.
 * 
 * CURRENT IMPLEMENTATION:
 * - Logs events for debugging
 * 
 * FUTURE ENHANCEMENTS:
 * - Send email/SMS notifications
 * - Trigger billing checks
 * - Create clinical encounter placeholders
 * - Track analytics
 */
@Injectable()
export class AppointmentListener {
  private readonly logger = new Logger(AppointmentListener.name);

  /**
   * Handle appointment booked event
   * 
   * TRIGGERED WHEN: A new appointment is successfully created
   * 
   * SUBSCRIBERS:
   * - Notification Module: Send confirmation SMS/email
   * - Billing Module: Check outstanding balances
   * - Clinical Module: Create encounter placeholder (optional)
   */
  @OnEvent('appointment.booked')
  handleAppointmentBooked(event: AppointmentBookedEvent) {
    this.logger.log(`✅ Appointment Booked`);
    this.logger.log(`   Booking ID: ${event.bookingId}`);
    this.logger.log(`   Patient: ${event.patientId}`);
    this.logger.log(`   Clinician: ${event.clinicianId}`);
    this.logger.log(`   Slot: ${event.slotId}`);
    this.logger.log(`   Time: ${event.slotStartTime.toISOString()} - ${event.slotEndTime.toISOString()}`);
    this.logger.log(`   Reason: ${event.reasonForVisit}`);

    // TODO: Implement actual business logic
    // Example: this.notificationService.sendBookingConfirmation(event.patientId, event);
    // Example: this.billingService.checkOutstandingBalance(event.patientId);
  }

  /**
   * Handle appointment cancelled event
   * 
   * TRIGGERED WHEN: An appointment is cancelled
   * 
   * SUBSCRIBERS:
   * - Notification Module: Send cancellation notifications
   * - Billing Module: Process cancellation fees (if applicable)
   * - Analytics Module: Track cancellation rates
   */
  @OnEvent('appointment.cancelled')
  handleAppointmentCancelled(event: AppointmentCancelledEvent) {
    this.logger.log(`❌ Appointment Cancelled`);
    this.logger.log(`   Booking ID: ${event.bookingId}`);
    this.logger.log(`   Patient: ${event.patientId}`);
    this.logger.log(`   Clinician: ${event.clinicianId || 'N/A'}`);
    this.logger.log(`   Slot: ${event.slotId || 'N/A'}`);
    this.logger.log(`   Cancelled At: ${event.cancelledAt.toISOString()}`);
    this.logger.log(`   Reason: ${event.reasonForVisit}`);

    // TODO: Implement actual business logic
    // Example: this.notificationService.sendCancellationNotice(event.patientId, event);
    // Example: this.notificationService.notifyClinician(event.clinicianId, event);
  }
}
