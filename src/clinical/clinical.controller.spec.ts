import { Test, TestingModule } from '@nestjs/testing';
import { ClinicalController } from './clinical.controller';
import { ClinicalService } from './clinical.service';

describe('ClinicalController', () => {
  let controller: ClinicalController;

  const mockClinicalService = {
    getPatientChart: jest.fn(),
    searchPatients: jest.fn(),
    createChart: jest.fn(),
    updateChart: jest.fn(),
    getAllergies: jest.fn(),
    addAllergy: jest.fn(),
    removeAllergy: jest.fn(),
    getChartEncounters: jest.fn(),
    getChartPrescriptions: jest.fn(),
    createEncounter: jest.fn(),
    getEncounter: jest.fn(),
    updateEncounter: jest.fn(),
    createSoapNote: jest.fn(),
    createPrescription: jest.fn(),
    getEncounterPrescriptions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClinicalController],
      providers: [
        { provide: ClinicalService, useValue: mockClinicalService },
      ],
    }).compile();

    controller = module.get<ClinicalController>(ClinicalController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPatientChart', () => {
    it('should return a patient chart', async () => {
      const mockChart = {
        id: 'chart-uuid',
        patient_id: 'patient-uuid',
        blood_type: 'O+',
      };

      mockClinicalService.getPatientChart.mockResolvedValue(mockChart);

      const result = await controller.getPatientChart('patient-uuid');

      expect(result).toEqual(mockChart);
      expect(mockClinicalService.getPatientChart).toHaveBeenCalledWith('patient-uuid');
    });
  });

  describe('searchPatients', () => {
    it('should search patients with valid query', async () => {
      const query = 'John';
      const mockResults = [{ id: 'patient-1', first_name: 'John' }];

      mockClinicalService.searchPatients.mockResolvedValue(mockResults);

      const result = await controller.searchPatients(query);

      expect(result).toEqual(mockResults);
      expect(mockClinicalService.searchPatients).toHaveBeenCalledWith(query);
    });
  });

  describe('createChart', () => {
    it('should create a patient chart', async () => {
      const patientId = 'patient-uuid';
      const dto = { bloodType: 'O+', dob: '1990-01-01' };
      const mockResult = { id: 'chart-uuid', ...dto };

      mockClinicalService.createChart.mockResolvedValue(mockResult);

      const result = await controller.createChart(patientId, dto as any);

      expect(result).toEqual(mockResult);
      expect(mockClinicalService.createChart).toHaveBeenCalledWith(patientId, dto);
    });
  });

  describe('updateChart', () => {
    it('should update a patient chart', async () => {
      const patientId = 'patient-uuid';
      const dto = { bloodType: 'A+' };
      const mockResult = { id: 'chart-uuid', blood_type: 'A+' };

      mockClinicalService.updateChart.mockResolvedValue(mockResult);

      const result = await controller.updateChart(patientId, dto as any);

      expect(result).toEqual(mockResult);
      expect(mockClinicalService.updateChart).toHaveBeenCalledWith(patientId, dto);
    });
  });

  describe('addAllergy', () => {
    it('should add an allergy to a chart', async () => {
      const chartId = 'chart-uuid';
      const dto = { allergenName: 'Penicillin', severity: 'Severe' };
      const mockAllergy = { id: 'allergy-uuid', ...dto };

      mockClinicalService.addAllergy.mockResolvedValue(mockAllergy);

      const result = await controller.addAllergy(chartId, dto as any);

      expect(result).toEqual(mockAllergy);
      expect(mockClinicalService.addAllergy).toHaveBeenCalledWith(chartId, dto);
    });
  });

  describe('createEncounter', () => {
    it('should create an encounter', async () => {
      const dto = { chartId: 'chart-uuid', clinicianId: 'clinician-uuid' };
      const mockEncounter = {
        id: 'encounter-uuid',
        chart_id: dto.chartId,
        status: 'Open',
      };

      mockClinicalService.createEncounter.mockResolvedValue(mockEncounter);

      const result = await controller.createEncounter(dto as any);

      expect(result).toEqual(mockEncounter);
      expect(mockClinicalService.createEncounter).toHaveBeenCalledWith(dto);
    });
  });

  describe('getEncounter', () => {
    it('should return an encounter', async () => {
      const encounterId = 'encounter-uuid';
      const mockEncounter = { id: encounterId, status: 'Open' };

      mockClinicalService.getEncounter.mockResolvedValue(mockEncounter);

      const result = await controller.getEncounter(encounterId);

      expect(result).toEqual(mockEncounter);
      expect(mockClinicalService.getEncounter).toHaveBeenCalledWith(encounterId);
    });
  });

  describe('createSoapNote', () => {
    it('should create a SOAP note', async () => {
      const encounterId = 'encounter-uuid';
      const dto = {
        subjective: 'Patient reports headache',
        objective: 'BP 120/80',
        assessment: 'Tension headache',
        plan: 'Rest and pain relief',
      };
      const mockNote = { id: 'note-uuid', ...dto };

      mockClinicalService.createSoapNote.mockResolvedValue(mockNote);

      const result = await controller.createSoapNote(encounterId, dto as any);

      expect(result).toEqual(mockNote);
      expect(mockClinicalService.createSoapNote).toHaveBeenCalledWith(encounterId, dto);
    });
  });

  describe('createPrescription', () => {
    it('should create a prescription', async () => {
      const encounterId = 'encounter-uuid';
      const dto = {
        medicationName: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Every 6 hours',
        duration: '7 days',
      };
      const mockPrescription = { id: 'prescription-uuid', ...dto };

      mockClinicalService.createPrescription.mockResolvedValue(mockPrescription);

      const result = await controller.createPrescription(encounterId, dto as any);

      expect(result).toEqual(mockPrescription);
      expect(mockClinicalService.createPrescription).toHaveBeenCalledWith(encounterId, dto);
    });
  });

  describe('getEncounterPrescriptions', () => {
    it('should return prescriptions for an encounter', async () => {
      const encounterId = 'encounter-uuid';
      const mockPrescriptions = [
        { id: 'prescription-1', medication_name: 'Ibuprofen' },
        { id: 'prescription-2', medication_name: 'Acetaminophen' },
      ];

      mockClinicalService.getEncounterPrescriptions.mockResolvedValue(mockPrescriptions);

      const result = await controller.getEncounterPrescriptions(encounterId);

      expect(result).toEqual(mockPrescriptions);
      expect(mockClinicalService.getEncounterPrescriptions).toHaveBeenCalledWith(encounterId);
    });
  });
});
