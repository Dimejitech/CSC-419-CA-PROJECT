import { Test, TestingModule } from '@nestjs/testing';
import { LabController } from './lab.controller';
import { LabOrderService } from './services/lab-order.service';
import { LabTestItemService } from './services/lab-test-item.service';
import { LabResultService } from './services/lab-result.service';
import { ResultVerificationService } from './services/result-verification.service';

describe('LabController', () => {
  let controller: LabController;

  const mockLabOrderService = {
    createOrder: jest.fn(),
    createOrderForPatient: jest.fn(),
    getOrders: jest.fn(),
    getOrderById: jest.fn(),
    updateStatus: jest.fn(),
    getOrdersByChartId: jest.fn(),
  };

  const mockLabTestItemService = {
    addTestItem: jest.fn(),
    getTestItemsByOrderId: jest.fn(),
    getTestItemById: jest.fn(),
    removeTestItem: jest.fn(),
  };

  const mockLabResultService = {
    uploadResult: jest.fn(),
    getAllResults: jest.fn(),
    getResultById: jest.fn(),
    getResultsByOrderId: jest.fn(),
    getResultsByChartId: jest.fn(),
  };

  const mockResultVerificationService = {
    getUnverifiedResults: jest.fn(),
    verifyResult: jest.fn(),
    getVerifiedResultsForPatient: jest.fn(),
    getVerificationStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LabController],
      providers: [
        { provide: LabOrderService, useValue: mockLabOrderService },
        { provide: LabTestItemService, useValue: mockLabTestItemService },
        { provide: LabResultService, useValue: mockLabResultService },
        { provide: ResultVerificationService, useValue: mockResultVerificationService },
      ],
    }).compile();

    controller = module.get<LabController>(LabController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createOrder', () => {
    it('should create a new lab order', async () => {
      const dto = { encounterId: 'encounter-123', priority: 'Routine' };
      const expected = { id: 'order-123', ...dto };
      mockLabOrderService.createOrder.mockResolvedValue(expected);

      const result = await controller.createOrder(dto as any);

      expect(result).toEqual(expected);
      expect(mockLabOrderService.createOrder).toHaveBeenCalledWith(dto);
    });
  });

  describe('getOrders', () => {
    it('should return all orders', async () => {
      const expected = [{ id: 'order-1' }, { id: 'order-2' }];
      mockLabOrderService.getOrders.mockResolvedValue(expected);

      const result = await controller.getOrders();

      expect(result).toEqual(expected);
    });

    it('should filter orders by status', async () => {
      const expected = [{ id: 'order-1', status: 'Pending' }];
      mockLabOrderService.getOrders.mockResolvedValue(expected);

      const result = await controller.getOrders('Pending' as any);

      expect(mockLabOrderService.getOrders).toHaveBeenCalledWith({
        status: 'Pending',
        encounterId: undefined,
        priority: undefined,
      });
    });
  });

  describe('getOrderById', () => {
    it('should return a specific order', async () => {
      const expected = { id: 'order-123', status: 'Pending' };
      mockLabOrderService.getOrderById.mockResolvedValue(expected);

      const result = await controller.getOrderById('order-123');

      expect(result).toEqual(expected);
      expect(mockLabOrderService.getOrderById).toHaveBeenCalledWith('order-123');
    });
  });

  describe('getAllResults', () => {
    it('should return all results', async () => {
      const expected = [{ id: 'result-1' }, { id: 'result-2' }];
      mockLabResultService.getAllResults.mockResolvedValue(expected);

      const result = await controller.getAllResults();

      expect(result).toEqual(expected);
    });
  });

  describe('verifyResult', () => {
    it('should verify a result', async () => {
      const expected = { id: 'result-123', is_verified: true };
      mockResultVerificationService.verifyResult.mockResolvedValue(expected);

      const result = await controller.verifyResult('result-123', { id: 'clinician-123' });

      expect(result).toEqual(expected);
      expect(mockResultVerificationService.verifyResult).toHaveBeenCalledWith('result-123', 'clinician-123');
    });
  });

  describe('getStats', () => {
    it('should return verification statistics', async () => {
      const expected = { total: 100, verified: 80, pending: 20 };
      mockResultVerificationService.getVerificationStats.mockResolvedValue(expected);

      const result = await controller.getStats();

      expect(result).toEqual(expected);
    });
  });
});
