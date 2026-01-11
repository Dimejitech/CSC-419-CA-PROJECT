import { IsString, IsOptional, IsDateString, IsUUID } from 'class-validator';

export class CreateChartDto {
  @IsUUID()
  patientId!: string;

  @IsString()
  @IsOptional()
  bloodType?: string;

  @IsDateString()
  dob!: string;
}