import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegisterDto {
  @IsEmail()
  email!: string;

  @MinLength(8)
  password!: string;

  @IsNotEmpty()
  firstName!: string;

  @IsNotEmpty()
  lastName!: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  // MVP default role = Patient
  @IsOptional()
  role?: 'Patient' | 'Clinician' | 'LabTechnician' | 'Staff' | 'Admin';
}
