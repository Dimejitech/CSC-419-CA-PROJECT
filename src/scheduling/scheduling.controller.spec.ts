import { Test, TestingModule } from '@nestjs/testing';
import { SchedulingController } from './scheduling.controller';
import { BookingService } from './services/booking.service';
import { SlotService } from './services/slot.service';
import { SlotAvailabilityService } from './services/slot-availability.service';
import { WalkInManagerService } from './services/walkin-manager.service';

describe('SchedulingController', () => {
  let controller: SchedulingController;

  const mockBookingService = {
    createBooking: jest.fn(),
    getPatientAppointments: jest.fn(),
    getBookingById: jest.fn(),
    updateBooking: jest.fn(),
    cancelBooking: jest.fn(),
    rescheduleBooking: jest.fn(),
  };

  const mockSlotService = {
    createSlot: jest.fn(),
    getClinicians: jest.fn(),
    getClinicianSchedule: jest.fn(),
    getSlotById: jest.fn(),
    updateSlot: jest.fn(),
    deleteSlot: jest.fn(),
    blockSlot: jest.fn(),
  };

  const mockSlotAvailabilityService = {
    getAvailableSlots: jest.fn(),
  };

  const mockWalkInManagerService = {
    registerWalkIn: jest.fn(),
    getWalkInsForDate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SchedulingController],
      providers: [
        { provide: BookingService, useValue: mockBookingService },
        { provide: SlotService, useValue: mockSlotService },
        { provide: SlotAvailabilityService, useValue: mockSlotAvailabilityService },
        { provide: WalkInManagerService, useValue: mockWalkInManagerService },
      ],
    }).compile();

    controller = module.get<SchedulingController>(SchedulingController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('createBooking', () => {
    it('should create a booking', async () => {
      const dto = { slotId: 'slot-123', patientId: 'patient-123' };
      const expected = { id: 'booking-123', ...dto };
      mockBookingService.createBooking.mockResolvedValue(expected);

      const result = await controller.createBooking(dto as any);

      expect(result).toEqual(expected);
      expect(mockBookingService.createBooking).toHaveBeenCalledWith(dto);
    });
  });

  describe('getPatientAppointments', () => {
    it('should return patient appointments', async () => {
      const patientId = 'patient-123';
      const expected = [{ id: 'booking-1' }, { id: 'booking-2' }];
      mockBookingService.getPatientAppointments.mockResolvedValue(expected);

      const result = await controller.getPatientAppointments(patientId);

      expect(result).toEqual(expected);
      expect(mockBookingService.getPatientAppointments).toHaveBeenCalledWith(patientId);
    });
  });

  describe('getBookingById', () => {
    it('should return a booking by id', async () => {
      const bookingId = 'booking-123';
      const expected = { id: bookingId, status: 'Scheduled' };
      mockBookingService.getBookingById.mockResolvedValue(expected);

      const result = await controller.getBookingById(bookingId);

      expect(result).toEqual(expected);
      expect(mockBookingService.getBookingById).toHaveBeenCalledWith(bookingId);
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking', async () => {
      const bookingId = 'booking-123';
      const expected = { id: bookingId, status: 'Cancelled' };
      mockBookingService.cancelBooking.mockResolvedValue(expected);

      const result = await controller.cancelBooking(bookingId);

      expect(result).toEqual(expected);
      expect(mockBookingService.cancelBooking).toHaveBeenCalledWith(bookingId);
    });
  });

  describe('rescheduleBooking', () => {
    it('should reschedule a booking', async () => {
      const bookingId = 'booking-123';
      const dto = { newSlotId: 'slot-456', reason: 'Schedule conflict' };
      const expected = { id: bookingId, slotId: dto.newSlotId };
      mockBookingService.rescheduleBooking.mockResolvedValue(expected);

      const result = await controller.rescheduleBooking(bookingId, dto);

      expect(result).toEqual(expected);
      expect(mockBookingService.rescheduleBooking).toHaveBeenCalledWith(bookingId, dto.newSlotId, dto.reason);
    });
  });

  describe('getClinicians', () => {
    it('should return list of clinicians', async () => {
      const expected = [
        { id: 'clinician-1', first_name: 'Dr. John' },
        { id: 'clinician-2', first_name: 'Dr. Jane' },
      ];
      mockSlotService.getClinicians.mockResolvedValue(expected);

      const result = await controller.getClinicians();

      expect(result).toEqual(expected);
    });
  });

  describe('createSlot', () => {
    it('should create a slot', async () => {
      const dto = { clinicianId: 'clinician-123', startTime: new Date(), endTime: new Date() };
      const expected = { id: 'slot-123', ...dto };
      mockSlotService.createSlot.mockResolvedValue(expected);

      const result = await controller.createSlot(dto as any);

      expect(result).toEqual(expected);
      expect(mockSlotService.createSlot).toHaveBeenCalledWith(dto);
    });
  });

  describe('getAvailableSlots', () => {
    it('should return available slots', async () => {
      const query = { clinicianId: 'clinician-123', date: '2024-01-15' };
      const expected = [{ id: 'slot-1', status: 'Available' }];
      mockSlotAvailabilityService.getAvailableSlots.mockResolvedValue(expected);

      const result = await controller.getAvailableSlots(query as any);

      expect(result).toEqual(expected);
    });
  });

  describe('deleteSlot', () => {
    it('should delete a slot', async () => {
      const slotId = 'slot-123';
      const expected = { message: 'Slot deleted successfully' };
      mockSlotService.deleteSlot.mockResolvedValue(expected);

      const result = await controller.deleteSlot(slotId);

      expect(result).toEqual(expected);
      expect(mockSlotService.deleteSlot).toHaveBeenCalledWith(slotId);
    });
  });

  describe('registerWalkIn', () => {
    it('should register a walk-in patient', async () => {
      const dto = { patientId: 'patient-123', clinicianId: 'clinician-123', reason: 'Urgent care' };
      const expected = { id: 'walkin-123', ...dto };
      mockWalkInManagerService.registerWalkIn.mockResolvedValue(expected);

      const result = await controller.registerWalkIn(dto as any);

      expect(result).toEqual(expected);
      expect(mockWalkInManagerService.registerWalkIn).toHaveBeenCalledWith(dto);
    });
  });
});
