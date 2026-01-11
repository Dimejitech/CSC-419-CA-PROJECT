/**
 * AppointmentCancelled Event
 * 
 * Emitted when an appointment booking is cancelled.
 * 
 * SUBSCRIBERS:
 * - Notification Module: Send cancellation notification to patient and clinician
 * - Billing Module: Process any cancellation fees (if applicable)
 * - Analytics Module: Track cancellation rates (optional)
 */
export class AppointmentCancelledEvent {
  constructor(
    public readonly bookingId: string,
    public readonly patientId: string,
    public readonly clinicianId: string,
    public readonly slotId: string,
    public readonly cancelledAt: Date,
    public readonly reasonForVisit: string,
  ) {}
}
