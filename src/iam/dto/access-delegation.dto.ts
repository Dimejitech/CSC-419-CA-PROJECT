import { IsUUID, IsDateString } from 'class-validator';

export class AccessDelegationDto {
  @IsUUID()
  fromClinicianId!: string;

  @IsUUID()
  toClinicianId!: string;

  @IsDateString()
  expiresAt!: string;
}
