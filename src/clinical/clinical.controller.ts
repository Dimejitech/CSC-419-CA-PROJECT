import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClinicalService } from './clinical.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { UpdateEncounterDto } from './dto/update-encounter.dto';
import { CreateSoapNoteDto } from './dto/create-soap-note.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Controller('clinical')
export class ClinicalController {
  constructor(private readonly clinicalService: ClinicalService) {}

  // ============================================
  // PATIENT CHART ENDPOINTS
  // ============================================

  /**
   * GET /clinical/patients/:id/chart
   * Get patient chart with all related data
   */
  @Get('patients/:id/chart')
  async getPatientChart(@Param('id') id: string) {
    return this.clinicalService.getPatientChart(id);
  }

  // ============================================
  // ENCOUNTER ENDPOINTS
  // ============================================

  /**
   * POST /clinical/encounters
   * Create a new patient encounter
   */
  @Post('encounters')
  @HttpCode(HttpStatus.CREATED)
  async createEncounter(@Body() createEncounterDto: CreateEncounterDto) {
    return this.clinicalService.createEncounter(createEncounterDto);
  }

  /**
   * GET /clinical/encounters/:id
   * Get a specific encounter by ID
   */
  @Get('encounters/:id')
  async getEncounter(@Param('id') id: string) {
    return this.clinicalService.getEncounter(id);
  }

  /**
   * PUT /clinical/encounters/:id
   * Update encounter status
   */
  @Put('encounters/:id')
  async updateEncounter(
    @Param('id') id: string,
    @Body() updateEncounterDto: UpdateEncounterDto,
  ) {
    return this.clinicalService.updateEncounter(id, updateEncounterDto);
  }

  // ============================================
  // SOAP NOTES ENDPOINTS
  // ============================================

  /**
   * POST /clinical/encounters/:id/notes
   * Add or update SOAP notes for an encounter
   */
  @Post('encounters/:id/notes')
  @HttpCode(HttpStatus.CREATED)
  async createSoapNote(
    @Param('id') id: string,
    @Body() createSoapNoteDto: CreateSoapNoteDto,
  ) {
    return this.clinicalService.createSoapNote(id, createSoapNoteDto);
  }

  // ============================================
  // PRESCRIPTION ENDPOINTS
  // ============================================

  /**
   * POST /clinical/encounters/:id/prescriptions
   * Create a prescription for an encounter
   */
  @Post('encounters/:id/prescriptions')
  @HttpCode(HttpStatus.CREATED)
  async createPrescription(
    @Param('id') id: string,
    @Body() createPrescriptionDto: CreatePrescriptionDto,
  ) {
    return this.clinicalService.createPrescription(id, createPrescriptionDto);
  }

  /**
   * GET /clinical/encounters/:id/prescriptions
   * Get all prescriptions for an encounter
   */
  @Get('encounters/:id/prescriptions')
  async getEncounterPrescriptions(@Param('id') id: string) {
    return this.clinicalService.getEncounterPrescriptions(id);
  }
}