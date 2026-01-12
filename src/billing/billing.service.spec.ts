import { Test, TestingModule } from '@nestjs/testing';
import { BillingService } from './billing.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('BillingService', () => {
  let service: BillingService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    billing_invoices: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    billing_line_items: {
      create: jest.fn(),
      findMany: jest.fn(),
      deleteMany: jest.fn(),
    },
    users: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BillingService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<BillingService>(BillingService);
    prismaService = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createInvoice', () => {
    const createInvoiceDto = {
      patientId: 'patient-uuid-123',
      encounterId: 'encounter-uuid-456',
      lineItems: [
        { description: 'Consultation', cost: 50.00 },
        { description: 'Lab Test', cost: 25.00 },
      ],
    };

    it('should successfully create an invoice with line items', async () => {
      const mockInvoice = {
        id: 'invoice-uuid-123',
        patient_id: createInvoiceDto.patientId,
        encounter_id: createInvoiceDto.encounterId,
        total_amount: 75.00,
        status: 'Draft',
        billing_line_items: [
          { id: 'item-1', description: 'Consultation', cost: 50.00 },
          { id: 'item-2', description: 'Lab Test', cost: 25.00 },
        ],
      };

      mockPrismaService.billing_invoices.create.mockResolvedValue(mockInvoice);

      const result = await service.createInvoice(createInvoiceDto);

      expect(result).toHaveProperty('id');
      expect(result.total_amount).toBe(75.00);
      expect(result.billing_line_items).toHaveLength(2);
    });

    it('should calculate total amount correctly', async () => {
      const dto = {
        ...createInvoiceDto,
        lineItems: [
          { description: 'Item 1', cost: 100.00 },
          { description: 'Item 2', cost: 50.00 },
          { description: 'Item 3', cost: 25.50 },
        ],
      };

      const mockInvoice = {
        id: 'invoice-uuid-123',
        patient_id: dto.patientId,
        total_amount: 175.50,
        status: 'Draft',
        billing_line_items: dto.lineItems,
      };

      mockPrismaService.billing_invoices.create.mockResolvedValue(mockInvoice);

      const result = await service.createInvoice(dto);

      expect(result.total_amount).toBe(175.50);
    });
  });

  describe('getPatientInvoices', () => {
    const patientId = 'patient-uuid-123';

    it('should return all invoices for a patient', async () => {
      const mockInvoices = [
        {
          id: 'invoice-1',
          patient_id: patientId,
          total_amount: 100.00,
          status: 'Paid',
          billing_line_items: [{ description: 'Consultation', cost: 100.00 }],
        },
        {
          id: 'invoice-2',
          patient_id: patientId,
          total_amount: 50.00,
          status: 'Pending',
          billing_line_items: [{ description: 'Lab Test', cost: 50.00 }],
        },
      ];

      mockPrismaService.billing_invoices.findMany.mockResolvedValue(mockInvoices);

      const result = await service.getPatientInvoices(patientId);

      expect(result).toHaveLength(2);
    });

    it('should return empty array for patient with no invoices', async () => {
      mockPrismaService.billing_invoices.findMany.mockResolvedValue([]);

      const result = await service.getPatientInvoices('patient-no-invoices');

      expect(result).toHaveLength(0);
    });
  });

  describe('getInvoiceById', () => {
    const invoiceId = 'invoice-uuid-123';

    it('should return invoice with line items', async () => {
      const mockInvoice = {
        id: invoiceId,
        patient_id: 'patient-uuid-123',
        total_amount: 75.00,
        status: 'Pending',
        billing_line_items: [
          { description: 'Consultation', cost: 50.00 },
          { description: 'Lab Test', cost: 25.00 },
        ],
        users: {
          first_name: 'Demo',
          last_name: 'Patient',
        },
      };

      mockPrismaService.billing_invoices.findUnique.mockResolvedValue(mockInvoice);

      const result = await service.getInvoiceById(invoiceId);

      expect(result.id).toBe(invoiceId);
      expect(result.billing_line_items).toHaveLength(2);
    });

    it('should throw NotFoundException for non-existent invoice', async () => {
      mockPrismaService.billing_invoices.findUnique.mockResolvedValue(null);

      await expect(service.getInvoiceById('non-existent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateInvoiceStatus', () => {
    const invoiceId = 'invoice-uuid-123';

    it('should update invoice status to Paid', async () => {
      const mockInvoice = {
        id: invoiceId,
        status: 'Pending',
        total_amount: 100.00,
      };

      mockPrismaService.billing_invoices.findUnique.mockResolvedValue(mockInvoice);
      mockPrismaService.billing_invoices.update.mockResolvedValue({ ...mockInvoice, status: 'Paid' });

      const result = await service.updateInvoiceStatus(invoiceId, 'Paid');

      expect(result.status).toBe('Paid');
    });

    it('should throw NotFoundException for non-existent invoice', async () => {
      mockPrismaService.billing_invoices.findUnique.mockResolvedValue(null);

      await expect(service.updateInvoiceStatus('non-existent-id', 'Paid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getOutstandingBalance', () => {
    const patientId = 'patient-uuid-123';

    it('should calculate outstanding balance correctly', async () => {
      const mockInvoices = [
        { id: 'invoice-1', total_amount: 100.00, status: 'Pending' },
        { id: 'invoice-2', total_amount: 50.00, status: 'Pending' },
        { id: 'invoice-3', total_amount: 75.00, status: 'Paid' }, // Should not count
      ];

      mockPrismaService.billing_invoices.findMany.mockResolvedValue(
        mockInvoices.filter(i => i.status !== 'Paid'),
      );

      const result = await service.getOutstandingBalance(patientId);

      expect(result).toBe(150.00);
    });

    it('should return 0 when all invoices are paid', async () => {
      mockPrismaService.billing_invoices.findMany.mockResolvedValue([]);

      const result = await service.getOutstandingBalance(patientId);

      expect(result).toBe(0);
    });
  });
});
