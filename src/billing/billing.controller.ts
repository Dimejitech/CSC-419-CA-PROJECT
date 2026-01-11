import { 
  Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards 
} from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { CreateLineItemDto } from './dto/create-line-item.dto';
import { InvoiceQueryDto } from './dto/invoice-query.dto';
import { CreateInsuranceClaimDto } from './dto/create-insurance-claim.dto';
import { UpdateInsuranceClaimDto } from './dto/update-insurance-claim.dto';

// Note: Ruth is still working on IAM. 
// These guards are placeholders so your code is "Security Ready".
@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('invoices')
  createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.billingService.createInvoice(dto);
  }

  @Get('invoices')
  findAll(@Query() query: InvoiceQueryDto) {
    return this.billingService.findAllInvoices(query);
  }

  // PRD Requirement: Get all invoices for a specific patient
  @Get('patients/:id/invoices')
  findPatientInvoices(@Param('id', ParseUUIDPipe) id: string) {
    return this.billingService.findPatientInvoices(id);
  }

  @Get('invoices/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.billingService.findOneInvoice(id);
  }

  @Patch('invoices/:id')
  updateStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateInvoiceDto) {
    return this.billingService.updateInvoiceStatus(id, dto);
  }

  @Post('invoices/:id/line-items')
  addLineItem(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateLineItemDto) {
    return this.billingService.addLineItem(id, dto);
  }

  // PRD Requirement: Delete a line item
  @Delete('line-items/:id')
  deleteLineItem(@Param('id', ParseUUIDPipe) id: string) {
    return this.billingService.deleteLineItem(id);
  }

  @Post('claims')
  createClaim(@Body() dto: CreateInsuranceClaimDto) {
    return this.billingService.createInsuranceClaim(dto);
  }

  @Patch('claims/:id')
  updateClaimStatus(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateInsuranceClaimDto) {
    return this.billingService.updateInsuranceClaimStatus(id, dto);
  }
}