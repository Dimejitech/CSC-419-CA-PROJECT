/**
 * AppointmentBooked Event
 * 
 * Emitted when a new appointment booking is successfully created.
 * 
 * SUBSCRIBERS:
 * - Billing Module: Check for outstanding balances
 * - Notification Module: Send confirmation SMS/email to patient
 * - Clinical Module: Create placeholder for future encounter (optional)
 */
export class AppointmentBookedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly patientId: string,
    public readonly clinicianId: string,
    public readonly slotId: string,
    public readonly slotStartTime: Date,
    public readonly slotEndTime: Date,
    public readonly reasonForVisit: string,
  ) {}
}
