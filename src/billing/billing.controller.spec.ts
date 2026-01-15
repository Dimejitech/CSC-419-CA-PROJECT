import { Test, TestingModule } from '@nestjs/testing';
import { BillingController } from './billing.controller';
import { BillingService } from './billing.service';

describe('BillingController', () => {
  let controller: BillingController;

  const mockBillingService = {
    createInvoice: jest.fn(),
    findAllInvoices: jest.fn(),
    findPatientInvoices: jest.fn(),
    findOneInvoice: jest.fn(),
    updateInvoiceStatus: jest.fn(),
    addLineItem: jest.fn(),
    deleteLineItem: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BillingController],
      providers: [
        { provide: BillingService, useValue: mockBillingService },
      ],
    }).compile();

    controller = module.get<BillingController>(BillingController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createInvoice', () => {
    it('should create an invoice', async () => {
      const dto = { patientId: 'patient-123', encounterId: 'encounter-123' };
      const expected = { id: 'invoice-123', ...dto };
      mockBillingService.createInvoice.mockResolvedValue(expected);

      const result = await controller.createInvoice(dto as any);

      expect(result).toEqual(expected);
      expect(mockBillingService.createInvoice).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return all invoices', async () => {
      const query = { status: 'Unpaid' };
      const expected = [{ id: 'invoice-1' }, { id: 'invoice-2' }];
      mockBillingService.findAllInvoices.mockResolvedValue(expected);

      const result = await controller.findAll(query as any);

      expect(result).toEqual(expected);
      expect(mockBillingService.findAllInvoices).toHaveBeenCalledWith(query);
    });
  });

  describe('findPatientInvoices', () => {
    it('should return patient invoices', async () => {
      const patientId = 'patient-123';
      const expected = [{ id: 'invoice-1', patientId }];
      mockBillingService.findPatientInvoices.mockResolvedValue(expected);

      const result = await controller.findPatientInvoices(patientId);

      expect(result).toEqual(expected);
      expect(mockBillingService.findPatientInvoices).toHaveBeenCalledWith(patientId);
    });
  });

  describe('findOne', () => {
    it('should return a single invoice', async () => {
      const invoiceId = 'invoice-123';
      const expected = { id: invoiceId, status: 'Paid', total: 150.00 };
      mockBillingService.findOneInvoice.mockResolvedValue(expected);

      const result = await controller.findOne(invoiceId);

      expect(result).toEqual(expected);
      expect(mockBillingService.findOneInvoice).toHaveBeenCalledWith(invoiceId);
    });
  });

  describe('updateStatus', () => {
    it('should update invoice status', async () => {
      const invoiceId = 'invoice-123';
      const dto = { status: 'Paid' };
      const expected = { id: invoiceId, status: 'Paid' };
      mockBillingService.updateInvoiceStatus.mockResolvedValue(expected);

      const result = await controller.updateStatus(invoiceId, dto as any);

      expect(result).toEqual(expected);
      expect(mockBillingService.updateInvoiceStatus).toHaveBeenCalledWith(invoiceId, dto);
    });
  });

  describe('addLineItem', () => {
    it('should add a line item to invoice', async () => {
      const invoiceId = 'invoice-123';
      const dto = { description: 'Consultation', amount: 100.00 };
      const expected = { id: 'line-item-123', invoiceId, ...dto };
      mockBillingService.addLineItem.mockResolvedValue(expected);

      const result = await controller.addLineItem(invoiceId, dto as any);

      expect(result).toEqual(expected);
      expect(mockBillingService.addLineItem).toHaveBeenCalledWith(invoiceId, dto);
    });
  });

  describe('deleteLineItem', () => {
    it('should delete a line item', async () => {
      const lineItemId = 'line-item-123';
      const expected = { message: 'Line item deleted successfully' };
      mockBillingService.deleteLineItem.mockResolvedValue(expected);

      const result = await controller.deleteLineItem(lineItemId);

      expect(result).toEqual(expected);
      expect(mockBillingService.deleteLineItem).toHaveBeenCalledWith(lineItemId);
    });
  });
});
