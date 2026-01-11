import { IsIn, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateClaimStatusDto {
  @IsNotEmpty()
  @IsIn(['Submitted', 'Pending', 'Approved', 'Denied', 'Paid'])
  status!: string;

  @IsOptional()
  @IsString()
  remarks?: string; // e.g., "Denied due to expired policy"
}