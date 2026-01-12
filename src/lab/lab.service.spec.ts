import { Test, TestingModule } from '@nestjs/testing';
import { LabService } from './lab.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('LabService', () => {
  let service: LabService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    lab_orders: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    lab_test_items: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    lab_results: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    patient_charts: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LabService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<LabService>(LabService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createLabOrder', () => {
    const createOrderDto = {
      encounterId: 'encounter-uuid-123',
      priority: 'Routine',
      testItems: [
        { testName: 'Complete Blood Count' },
        { testName: 'Lipid Panel' },
      ],
    };

    it('should successfully create a lab order with test items', async () => {
      const mockOrder = {
        id: 'order-uuid-123',
        encounter_id: createOrderDto.encounterId,
        priority: 'Routine',
        status: 'Ordered',
        lab_test_items: [
          { id: 'item-1', test_name: 'Complete Blood Count' },
          { id: 'item-2', test_name: 'Lipid Panel' },
        ],
      };

      mockPrismaService.lab_orders.create.mockResolvedValue(mockOrder);

      const result = await service.createLabOrder(createOrderDto);

      expect(result).toHaveProperty('id');
      expect(result.status).toBe('Ordered');
      expect(result.lab_test_items).toHaveLength(2);
    });

    it('should create STAT priority order', async () => {
      const statOrderDto = { ...createOrderDto, priority: 'STAT' };
      const mockOrder = {
        id: 'order-uuid-123',
        priority: 'STAT',
        status: 'Ordered',
        lab_test_items: [],
      };

      mockPrismaService.lab_orders.create.mockResolvedValue(mockOrder);

      const result = await service.createLabOrder(statOrderDto);

      expect(result.priority).toBe('STAT');
    });
  });

  describe('getLabOrders', () => {
    it('should return all lab orders', async () => {
      const mockOrders = [
        {
          id: 'order-1',
          status: 'Pending',
          priority: 'Routine',
          lab_test_items: [{ test_name: 'CBC' }],
          patient_encounters: {
            patient_charts: {
              users: { first_name: 'Demo', last_name: 'Patient' },
            },
          },
        },
        {
          id: 'order-2',
          status: 'Completed',
          priority: 'STAT',
          lab_test_items: [{ test_name: 'Urinalysis' }],
          patient_encounters: {
            patient_charts: {
              users: { first_name: 'John', last_name: 'Doe' },
            },
          },
        },
      ];

      mockPrismaService.lab_orders.findMany.mockResolvedValue(mockOrders);

      const result = await service.getLabOrders({});

      expect(result).toHaveLength(2);
    });

    it('should filter by status', async () => {
      const mockOrders = [
        { id: 'order-1', status: 'Pending', priority: 'Routine' },
      ];

      mockPrismaService.lab_orders.findMany.mockResolvedValue(mockOrders);

      const result = await service.getLabOrders({ status: 'Pending' });

      expect(result).toHaveLength(1);
      expect(mockPrismaService.lab_orders.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ status: 'Pending' }),
        }),
      );
    });
  });

  describe('updateOrderStatus', () => {
    const orderId = 'order-uuid-123';

    it('should update order status to InProgress', async () => {
      const mockOrder = { id: orderId, status: 'Ordered' };

      mockPrismaService.lab_orders.findUnique.mockResolvedValue(mockOrder);
      mockPrismaService.lab_orders.update.mockResolvedValue({ ...mockOrder, status: 'InProgress' });

      const result = await service.updateOrderStatus(orderId, 'InProgress');

      expect(result.status).toBe('InProgress');
    });

    it('should throw NotFoundException for non-existent order', async () => {
      mockPrismaService.lab_orders.findUnique.mockResolvedValue(null);

      await expect(service.updateOrderStatus('non-existent-id', 'InProgress')).rejects.toThrow(NotFoundException);
    });
  });

  describe('uploadResult', () => {
    const uploadResultDto = {
      testItemId: 'test-item-uuid-123',
      resultValue: '120/80',
      abnormalityFlag: 'Normal',
    };

    it('should successfully upload lab result', async () => {
      const mockResult = {
        id: 'result-uuid-123',
        test_item_id: uploadResultDto.testItemId,
        result_value: uploadResultDto.resultValue,
        abnormality_flag: uploadResultDto.abnormalityFlag,
        is_verified: false,
      };

      mockPrismaService.lab_results.create.mockResolvedValue(mockResult);

      const result = await service.uploadResult(uploadResultDto);

      expect(result).toHaveProperty('id');
      expect(result.result_value).toBe('120/80');
      expect(result.is_verified).toBe(false);
    });
  });

  describe('verifyResult', () => {
    const resultId = 'result-uuid-123';
    const clinicianId = 'clinician-uuid-456';

    it('should verify lab result', async () => {
      const mockResult = {
        id: resultId,
        is_verified: false,
        verified_by: null,
      };

      mockPrismaService.lab_results.findUnique.mockResolvedValue(mockResult);
      mockPrismaService.lab_results.update.mockResolvedValue({
        ...mockResult,
        is_verified: true,
        verified_by: clinicianId,
      });

      const result = await service.verifyResult(resultId, clinicianId);

      expect(result.is_verified).toBe(true);
      expect(result.verified_by).toBe(clinicianId);
    });

    it('should throw NotFoundException for non-existent result', async () => {
      mockPrismaService.lab_results.findUnique.mockResolvedValue(null);

      await expect(service.verifyResult('non-existent-id', clinicianId)).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if already verified', async () => {
      const verifiedResult = {
        id: resultId,
        is_verified: true,
        verified_by: 'another-clinician',
      };

      mockPrismaService.lab_results.findUnique.mockResolvedValue(verifiedResult);

      await expect(service.verifyResult(resultId, clinicianId)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUnverifiedResults', () => {
    it('should return all unverified results', async () => {
      const mockResults = [
        {
          id: 'result-1',
          result_value: '120/80',
          is_verified: false,
          lab_test_items: {
            test_name: 'Blood Pressure',
            lab_orders: {
              patient_encounters: {
                patient_charts: {
                  users: { first_name: 'Demo', last_name: 'Patient' },
                },
              },
            },
          },
        },
      ];

      mockPrismaService.lab_results.findMany.mockResolvedValue(mockResults);

      const result = await service.getUnverifiedResults();

      expect(result).toHaveLength(1);
      expect(result[0].is_verified).toBe(false);
    });
  });

  describe('getLabStats', () => {
    it('should return lab statistics', async () => {
      const mockPendingOrders = [{ id: '1' }, { id: '2' }, { id: '3' }];
      const mockUrgentOrders = [{ id: '1' }];
      const mockCompletedToday = [{ id: '1' }, { id: '2' }];

      mockPrismaService.lab_orders.findMany
        .mockResolvedValueOnce(mockPendingOrders)
        .mockResolvedValueOnce(mockUrgentOrders)
        .mockResolvedValueOnce(mockCompletedToday);

      const result = await service.getLabStats();

      expect(result).toEqual({
        pending: 3,
        urgent: 1,
        completedToday: 2,
      });
    });
  });
});
