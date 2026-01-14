import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string | undefined;

  @IsOptional()
  @IsString()
  lastName?: string | undefined;

  @IsOptional()
  @IsString()
  phoneNumber?: string | undefined;

  @IsOptional()
  @IsEmail()
  email?: string | undefined;

  @IsOptional()
  @IsString()
  address?: string | undefined;

  @IsOptional()
  @IsString()
  city?: string | undefined;

  @IsOptional()
  @IsString()
  state?: string | undefined;

  @IsOptional()
  @IsString()
  zipCode?: string | undefined;
}
