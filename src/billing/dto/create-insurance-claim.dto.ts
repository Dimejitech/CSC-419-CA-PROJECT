import { IsUUID, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateInsuranceClaimDto {
  @IsUUID()
  @IsNotEmpty()
  invoiceId!: string; // The specific bill being claimed

  @IsString()
  @IsNotEmpty()
  providerName!: string; // e.g., "AXA Mansard", "Reliance HMO"

  @IsString()
  @IsNotEmpty()
  policyNumber!: string; // The patient's unique Insurance ID

  @IsOptional()
  @IsString()
  groupNumber?: string; // Optional: Some plans have a group ID
}