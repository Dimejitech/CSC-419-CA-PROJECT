import { Test, TestingModule } from '@nestjs/testing';
import { SlotService } from './slot.service';
import { PrismaService } from '../../prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('SlotService', () => {
  let service: SlotService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    $queryRaw: jest.fn(),
    appt_slots: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    users: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SlotService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<SlotService>(SlotService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSlot', () => {
    const createSlotDto = {
      clinicianId: 'clinician-uuid-123',
      startTime: '2024-01-15T09:00:00Z',
      endTime: '2024-01-15T09:30:00Z',
    };

    it('should successfully create a new slot', async () => {
      const mockSlot = {
        id: 'slot-uuid-123',
        clinician_id: createSlotDto.clinicianId,
        status: 'Available',
        time_range: '[2024-01-15 09:00:00+00,2024-01-15 09:30:00+00)',
      };

      mockPrismaService.$queryRaw.mockResolvedValue([mockSlot]);

      const result = await service.createSlot(createSlotDto);

      expect(result).toHaveProperty('id');
      expect(result.status).toBe('Available');
    });

    it('should throw BadRequestException for invalid time range', async () => {
      const invalidDto = {
        ...createSlotDto,
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T09:00:00Z', // End before start
      };

      await expect(service.createSlot(invalidDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAvailableSlots', () => {
    const clinicianId = 'clinician-uuid-123';
    const startDate = '2024-01-15T00:00:00Z';
    const endDate = '2024-01-15T23:59:59Z';

    it('should return available slots for clinician', async () => {
      const mockSlots = [
        {
          id: 'slot-1',
          clinician_id: clinicianId,
          status: 'Available',
          start_time: new Date('2024-01-15T09:00:00Z'),
          end_time: new Date('2024-01-15T09:30:00Z'),
        },
        {
          id: 'slot-2',
          clinician_id: clinicianId,
          status: 'Available',
          start_time: new Date('2024-01-15T10:00:00Z'),
          end_time: new Date('2024-01-15T10:30:00Z'),
        },
      ];

      mockPrismaService.$queryRaw.mockResolvedValue(mockSlots);

      const result = await service.getAvailableSlots(clinicianId, startDate, endDate);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('startTime');
      expect(result[0]).toHaveProperty('endTime');
    });

    it('should return empty array when no slots available', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue([]);

      const result = await service.getAvailableSlots(clinicianId, startDate, endDate);

      expect(result).toHaveLength(0);
    });
  });

  describe('getClinicians', () => {
    it('should return all active clinicians', async () => {
      const mockClinicians = [
        {
          id: 'clinician-1',
          first_name: 'Dr. John',
          last_name: 'Smith',
          email: 'john@citycare.com',
          roles: { name: 'Clinician' },
        },
        {
          id: 'clinician-2',
          first_name: 'Dr. Jane',
          last_name: 'Doe',
          email: 'jane@citycare.com',
          roles: { name: 'Clinician' },
        },
      ];

      mockPrismaService.users.findMany.mockResolvedValue(mockClinicians);

      const result = await service.getClinicians();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('firstName');
      expect(result[0]).toHaveProperty('lastName');
    });
  });

  describe('getClinicianSchedule', () => {
    const clinicianId = 'clinician-uuid-123';
    const startDate = '2024-01-15T00:00:00Z';
    const endDate = '2024-01-15T23:59:59Z';

    it('should return clinician schedule with bookings', async () => {
      const mockSchedule = [
        {
          id: 'slot-1',
          clinician_id: clinicianId,
          status: 'Booked',
          start_time: new Date('2024-01-15T09:00:00Z'),
          end_time: new Date('2024-01-15T09:30:00Z'),
          booking_id: 'booking-1',
          booking_status: 'Confirmed',
          patient_id: 'patient-1',
          patient_first_name: 'Demo',
          patient_last_name: 'Patient',
          reason_for_visit: 'Checkup',
        },
      ];

      mockPrismaService.$queryRaw.mockResolvedValue(mockSchedule);

      const result = await service.getClinicianSchedule(clinicianId, startDate, endDate);

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('patient');
      expect(result[0].patient).toHaveProperty('first_name', 'Demo');
    });

    it('should return empty array when no schedule', async () => {
      mockPrismaService.$queryRaw.mockResolvedValue([]);

      const result = await service.getClinicianSchedule(clinicianId, startDate, endDate);

      expect(result).toHaveLength(0);
    });
  });
});
