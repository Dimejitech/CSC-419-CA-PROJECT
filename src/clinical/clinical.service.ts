import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEncounterDto } from './dto/create-encounter.dto';
import { UpdateEncounterDto } from './dto/update-encounter.dto';
import { CreateSoapNoteDto } from './dto/create-soap-note.dto';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';

@Injectable()
export class ClinicalService {
  constructor(private readonly prisma: PrismaService) {}

  // ============================================
  // PATIENT CHART OPERATIONS
  // ============================================

  /**
   * Get patient chart with all related data
   */
  async getPatientChart(patientId: string) {
    const chart = await this.prisma.patient_charts.findUnique({
      where: { patient_id: patientId },
      include: {
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone_number: true,
          },
        },
        patient_allergies: true,
        patient_encounters: {
          include: {
            users: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
            patient_notes_soap: true,
            patient_prescriptions: true,
          },
          orderBy: {
            date: 'desc',
          },
        },
      },
    });

    if (!chart) {
      throw new NotFoundException(`Patient chart not found for patient ID: ${patientId}`);
    }

    return chart;
  }

  // ============================================
  // ENCOUNTER OPERATIONS
  // ============================================

  /**
   * Create a new patient encounter
   */
  async createEncounter(createEncounterDto: CreateEncounterDto) {
    const { chartId, clinicianId, status } = createEncounterDto;

    // Verify chart exists
    const chartExists = await this.prisma.patient_charts.findUnique({
      where: { id: chartId },
    });

    if (!chartExists) {
      throw new NotFoundException(`Chart not found with ID: ${chartId}`);
    }

    // Verify clinician exists and has clinician role
    const clinician = await this.prisma.users.findUnique({
      where: { id: clinicianId },
      include: { roles: true },
    });

    if (!clinician) {
      throw new NotFoundException(`Clinician not found with ID: ${clinicianId}`);
    }

    if (clinician.roles?.name !== 'Clinician') {
      throw new ForbiddenException('User is not a clinician');
    }

    // Create encounter
    const encounter = await this.prisma.patient_encounters.create({
      data: {
        chart_id: chartId,
        clinician_id: clinicianId,
        status: status || 'Open',
      },
      include: {
        patient_charts: {
          include: {
            users: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return encounter;
  }

  /**
   * Get a specific encounter by ID
   */
  async getEncounter(encounterId: string) {
    const encounter = await this.prisma.patient_encounters.findUnique({
      where: { id: encounterId },
      include: {
        patient_charts: {
          include: {
            users: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
            patient_allergies: true,
          },
        },
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
        patient_notes_soap: true,
        patient_prescriptions: true,
        lab_orders: {
          include: {
            lab_test_items: {
              include: {
                lab_results: true,
              },
            },
          },
        },
      },
    });

    if (!encounter) {
      throw new NotFoundException(`Encounter not found with ID: ${encounterId}`);
    }

    return encounter;
  }

  /**
   * Update encounter status
   */
  async updateEncounter(encounterId: string, updateEncounterDto: UpdateEncounterDto) {
    const encounter = await this.prisma.patient_encounters.findUnique({
      where: { id: encounterId },
    });

    if (!encounter) {
      throw new NotFoundException(`Encounter not found with ID: ${encounterId}`);
    }

    const updatedEncounter = await this.prisma.patient_encounters.update({
      where: { id: encounterId },
      data: {
        status: updateEncounterDto.status,
      },
      include: {
        patient_charts: {
          include: {
            users: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
          },
        },
      },
    });

    return updatedEncounter;
  }

  // ============================================
  // SOAP NOTES OPERATIONS
  // ============================================

  /**
   * Add or update SOAP notes to an encounter
   */
  async createSoapNote(encounterId: string, createSoapNoteDto: CreateSoapNoteDto) {
    const encounter = await this.prisma.patient_encounters.findUnique({
      where: { id: encounterId },
    });

    if (!encounter) {
      throw new NotFoundException(`Encounter not found with ID: ${encounterId}`);
    }

    if (encounter.status === 'Cancelled') {
      throw new BadRequestException('Cannot add notes to a cancelled encounter');
    }

    // Check if SOAP note already exists for this encounter
    const existingNote = await this.prisma.patient_notes_soap.findFirst({
      where: { encounter_id: encounterId },
    });

    if (existingNote) {
      // Update existing note
      const updatedNote = await this.prisma.patient_notes_soap.update({
        where: { id: existingNote.id },
        data: {
          subjective: createSoapNoteDto.subjective,
          objective: createSoapNoteDto.objective,
          assessment: createSoapNoteDto.assessment,
          plan: createSoapNoteDto.plan,
          vitals: createSoapNoteDto.vitals as any,
        },
      });
      return updatedNote;
    }

    // Create new note
    const soapNote = await this.prisma.patient_notes_soap.create({
      data: {
        encounter_id: encounterId,
        subjective: createSoapNoteDto.subjective,
        objective: createSoapNoteDto.objective,
        assessment: createSoapNoteDto.assessment,
        plan: createSoapNoteDto.plan,
        vitals: createSoapNoteDto.vitals as any,
      },
    });

    return soapNote;
  }

  // ============================================
  // PRESCRIPTION OPERATIONS
  // ============================================

  /**
   * Create a prescription for an encounter with allergy checking
   */
  async createPrescription(encounterId: string, createPrescriptionDto: CreatePrescriptionDto) {
    const encounter = await this.prisma.patient_encounters.findUnique({
      where: { id: encounterId },
      include: {
        patient_charts: {
          include: {
            patient_allergies: true,
          },
        },
      },
    });

    if (!encounter) {
      throw new NotFoundException(`Encounter not found with ID: ${encounterId}`);
    }

    if (encounter.status === 'Cancelled') {
      throw new BadRequestException('Cannot add prescription to a cancelled encounter');
    }

    // Check for allergies
    const allergies = encounter.patient_charts?.patient_allergies || [];
    const medicationLower = createPrescriptionDto.medicationName.toLowerCase();

    for (const allergy of allergies) {
      if (
        allergy.allergen_name.toLowerCase().includes(medicationLower) ||
        medicationLower.includes(allergy.allergen_name.toLowerCase())
      ) {
        throw new BadRequestException(
          `ALLERGY ALERT: Patient is allergic to ${allergy.allergen_name} (${allergy.severity}). Cannot prescribe ${createPrescriptionDto.medicationName}.`,
        );
      }
    }

    // Create prescription
    const prescription = await this.prisma.patient_prescriptions.create({
      data: {
        encounter_id: encounterId,
        medication_name: createPrescriptionDto.medicationName,
        dosage: createPrescriptionDto.dosage,
        frequency: createPrescriptionDto.frequency,
        duration: createPrescriptionDto.duration,
      },
    });

    return prescription;
  }

  /**
   * Get all prescriptions for an encounter
   */
  async getEncounterPrescriptions(encounterId: string) {
    const encounter = await this.prisma.patient_encounters.findUnique({
      where: { id: encounterId },
    });

    if (!encounter) {
      throw new NotFoundException(`Encounter not found with ID: ${encounterId}`);
    }

    const prescriptions = await this.prisma.patient_prescriptions.findMany({
      where: { encounter_id: encounterId },
    });

    return prescriptions;
  }
}