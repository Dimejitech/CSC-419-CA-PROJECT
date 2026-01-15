import { IsUUID, IsOptional, IsString } from 'class-validator';

export class RescheduleBookingDto {
  @IsUUID()
  newSlotId!: string;

  @IsOptional()
  @IsString()
  reason?: string; // Reason for rescheduling
}
