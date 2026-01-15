import { IsUUID, IsOptional, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  patientId!: string;

  @IsUUID()
  @IsOptional()
  clinicianId?: string; // Optional - can be derived from slotId

  @IsOptional()
  @IsString()
  startTime?: string; // ISO string - optional, derived from slotId

  @IsOptional()
  @IsString()
  endTime?: string; // ISO string - optional, derived from slotId

  @IsOptional()
  @IsString()
  reasonForVisit?: string;

  @IsUUID()
  slotId!: string;

}
