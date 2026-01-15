import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalService } from './clinical.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationService } from '../notification/notification.service';
import { NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { EncounterStatus } from './dto/create-encounter.dto';

describe('ClinicalService', () => {
  let service: ClinicalService;

  const mockPrismaService = {
    patient_charts: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    patient_encounters: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    patient_notes_soap: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    patient_prescriptions: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    patient_allergies: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
    },
    users: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  const mockNotificationService = {
    notifyPrescriptionAdded: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClinicalService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
        { provide: NotificationService, useValue: mockNotificationService },
      ],
    }).compile();

    service = module.get<ClinicalService>(ClinicalService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ============================================
  // PATIENT CHART TESTS
  // ============================================

  describe('getPatientChart', () => {
    it('should return patient chart when found', async () => {
      const mockChart = {
        id: 'chart-123',
        patient_id: 'patient-123',
        blood_type: 'O+',
        dob: new Date('1990-01-01'),
        users: {
          id: 'patient-123',
          first_name: 'John',
          last_name: 'Doe',
          email: 'john@example.com',
          phone_number: '1234567890',
        },
        patient_allergies: [],
        patient_encounters: [],
      };

      mockPrismaService.patient_charts.findUnique.mockResolvedValue(mockChart);

      const result = await service.getPatientChart('patient-123');

      expect(result).toEqual(mockChart);
    });

    it('should throw NotFoundException when chart not found', async () => {
      mockPrismaService.patient_charts.findUnique.mockResolvedValue(null);

      await expect(service.getPatientChart('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('searchPatients', () => {
    it('should return all patients when no query provided', async () => {
      const mockPatients = [
        { id: 'patient-1', first_name: 'John', last_name: 'Doe' },
        { id: 'patient-2', first_name: 'Jane', last_name: 'Smith' },
      ];

      mockPrismaService.users.findMany.mockResolvedValue(mockPatients);

      const result = await service.searchPatients('');

      expect(result).toEqual(mockPatients);
    });

    it('should search patients by query', async () => {
      const mockPatients = [{ id: 'patient-1', first_name: 'John', last_name: 'Doe' }];

      mockPrismaService.users.findMany.mockResolvedValue(mockPatients);

      const result = await service.searchPatients('John');

      expect(result).toEqual(mockPatients);
    });
  });

  // ============================================
  // ENCOUNTER TESTS
  // ============================================

  describe('createEncounter', () => {
    const createEncounterDto = {
      chartId: 'chart-123',
      clinicianId: 'clinician-123',
      status: EncounterStatus.Open,
    };

    it('should create encounter successfully', async () => {
      const mockChart = { id: 'chart-123' };
      const mockClinician = {
        id: 'clinician-123',
        roles: { name: 'Clinician' },
      };
      const mockEncounter = {
        id: 'encounter-123',
        chart_id: 'chart-123',
        clinician_id: 'clinician-123',
        status: 'Open',
      };

      mockPrismaService.patient_charts.findUnique.mockResolvedValue(mockChart);
      mockPrismaService.users.findUnique.mockResolvedValue(mockClinician);
      mockPrismaService.patient_encounters.create.mockResolvedValue(mockEncounter);

      const result = await service.createEncounter(createEncounterDto);

      expect(result).toEqual(mockEncounter);
      expect(mockPrismaService.patient_encounters.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException when chart not found', async () => {
      mockPrismaService.patient_charts.findUnique.mockResolvedValue(null);

      await expect(service.createEncounter(createEncounterDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user is not a clinician', async () => {
      const mockChart = { id: 'chart-123' };
      const mockUser = {
        id: 'user-123',
        roles: { name: 'Patient' },
      };

      mockPrismaService.patient_charts.findUnique.mockResolvedValue(mockChart);
      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);

      await expect(service.createEncounter(createEncounterDto)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getEncounter', () => {
    it('should return encounter when found', async () => {
      const mockEncounter = {
        id: 'encounter-123',
        chart_id: 'chart-123',
        clinician_id: 'clinician-123',
        status: 'Open',
      };

      mockPrismaService.patient_encounters.findUnique.mockResolvedValue(mockEncounter);

      const result = await service.getEncounter('encounter-123');

      expect(result).toEqual(mockEncounter);
    });

    it('should throw NotFoundException when encounter not found', async () => {
      mockPrismaService.patient_encounters.findUnique.mockResolvedValue(null);

      await expect(service.getEncounter('invalid-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateEncounter', () => {
    it('should update encounter status', async () => {
      const mockEncounter = {
        id: 'encounter-123',
        status: 'Open',
        patient_charts: { id: 'chart-123', patient_id: 'patient-123' },
      };
      const updatedEncounter = {
        ...mockEncounter,
        status: 'Completed',
      };

      mockPrismaService.patient_encounters.findUnique.mockResolvedValue(mockEncounter);
      mockPrismaService.patient_encounters.update.mockResolvedValue(updatedEncounter);

      const result = await service.updateEncounter('encounter-123', { status: EncounterStatus.Completed });

      expect(result.status).toBe('Completed');
      expect(mockPrismaService.patient_encounters.update).toHaveBeenCalled();
    });

    it('should emit event when encounter is completed', async () => {
      const mockEncounter = {
        id: 'encounter-123',
        status: 'Open',
        patient_charts: { id: 'chart-123', patient_id: 'patient-123' },
        clinician_id: 'clinician-123',
        chart_id: 'chart-123',
      };
      const updatedEncounter = {
        ...mockEncounter,
        status: 'Completed',
      };

      mockPrismaService.patient_encounters.findUnique.mockResolvedValue(mockEncounter);
      mockPrismaService.patient_encounters.update.mockResolvedValue(updatedEncounter);

      await service.updateEncounter('encounter-123', { status: EncounterStatus.Completed });

      expect(mockEventEmitter.emit).toHaveBeenCalledWith('encounter.closed', expect.any(Object));
    });
  });

  // ============================================
  // SOAP NOTES TESTS
  // ============================================

  describe('createSoapNote', () => {
    const createSoapNoteDto = {
      subjective: 'Patient reports headache',
      objective: 'BP 120/80',
      assessment: 'Tension headache',
      plan: 'Rest and pain relief',
      vitals: {
        bloodPressure: '120/80',
        heartRate: 72,
      },
    };

    it('should create new SOAP note', async () => {
      const mockEncounter = {
        id: 'encounter-123',
        status: 'Open',
      };
      const mockNote = {
        id: 'note-123',
        encounter_id: 'encounter-123',
        ...createSoapNoteDto,
      };

      mockPrismaService.patient_encounters.findUnique.mockResolvedValue(mockEncounter);
      mockPrismaService.patient_notes_soap.findFirst.mockResolvedValue(null);
      mockPrismaService.patient_notes_soap.create.mockResolvedValue(mockNote);

      const result = await service.createSoapNote('encounter-123', createSoapNoteDto);

      expect(result).toEqual(mockNote);
      expect(mockPrismaService.patient_notes_soap.create).toHaveBeenCalled();
    });

    it('should update existing SOAP note', async () => {
      const mockEncounter = {
        id: 'encounter-123',
        status: 'Open',
      };
      const existingNote = {
        id: 'note-123',
        encounter_id: 'encounter-123',
      };
      const updatedNote = {
        ...existingNote,
        ...createSoapNoteDto,
      };

      mockPrismaService.patient_encounters.findUnique.mockResolvedValue(mockEncounter);
      mockPrismaService.patient_notes_soap.findFirst.mockResolvedValue(existingNote);
      mockPrismaService.patient_notes_soap.update.mockResolvedValue(updatedNote);

      await service.createSoapNote('encounter-123', createSoapNoteDto);

      expect(mockPrismaService.patient_notes_soap.update).toHaveBeenCalled();
    });

    it('should throw BadRequestException for cancelled encounter', async () => {
      const mockEncounter = {
        id: 'encounter-123',
        status: 'Cancelled',
      };

      mockPrismaService.patient_encounters.findUnique.mockResolvedValue(mockEncounter);

      await expect(
        service.createSoapNote('encounter-123', createSoapNoteDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  // ============================================
  // PRESCRIPTION TESTS
  // ============================================

  describe('createPrescription', () => {
    const createPrescriptionDto = {
      medicationName: 'Ibuprofen',
      dosage: '400mg',
      frequency: 'Every 6 hours',
      duration: '7 days',
    };

    it('should create prescription successfully', async () => {
      const mockEncounter = {
        id: 'encounter-123',
        status: 'Open',
        patient_charts: {
          patient_id: 'patient-123',
          patient_allergies: [],
        },
      };
      const mockPrescription = {
        id: 'prescription-123',
        encounter_id: 'encounter-123',
        ...createPrescriptionDto,
      };

      mockPrismaService.patient_encounters.findUnique.mockResolvedValue(mockEncounter);
      mockPrismaService.patient_prescriptions.create.mockResolvedValue(mockPrescription);

      const result = await service.createPrescription('encounter-123', createPrescriptionDto);

      expect(result).toEqual(mockPrescription);
      expect(mockPrismaService.patient_prescriptions.create).toHaveBeenCalled();
    });

    it('should throw BadRequestException when patient is allergic to medication', async () => {
      const mockEncounter = {
        id: 'encounter-123',
        status: 'Open',
        patient_charts: {
          patient_allergies: [
            {
              allergen_name: 'Ibuprofen',
              severity: 'Severe',
            },
          ],
        },
      };

      mockPrismaService.patient_encounters.findUnique.mockResolvedValue(mockEncounter);

      await expect(
        service.createPrescription('encounter-123', createPrescriptionDto),
      ).rejects.toThrow(BadRequestException);
      expect(mockPrismaService.patient_prescriptions.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException for cancelled encounter', async () => {
      const mockEncounter = {
        id: 'encounter-123',
        status: 'Cancelled',
        patient_charts: {
          patient_allergies: [],
        },
      };

      mockPrismaService.patient_encounters.findUnique.mockResolvedValue(mockEncounter);

      await expect(
        service.createPrescription('encounter-123', createPrescriptionDto),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getEncounterPrescriptions', () => {
    it('should return all prescriptions for an encounter', async () => {
      const mockEncounter = { id: 'encounter-123' };
      const mockPrescriptions = [
        { id: 'prescription-1', medication_name: 'Ibuprofen' },
        { id: 'prescription-2', medication_name: 'Acetaminophen' },
      ];

      mockPrismaService.patient_encounters.findUnique.mockResolvedValue(mockEncounter);
      mockPrismaService.patient_prescriptions.findMany.mockResolvedValue(mockPrescriptions);

      const result = await service.getEncounterPrescriptions('encounter-123');

      expect(result).toEqual(mockPrescriptions);
      expect(result).toHaveLength(2);
    });
  });
});
