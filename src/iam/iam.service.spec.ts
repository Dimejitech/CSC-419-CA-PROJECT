import { Test, TestingModule } from '@nestjs/testing';
import { IamService } from './iam.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
  compare: jest.fn(),
}));

describe('IamService', () => {
  let service: IamService;
  let prismaService: PrismaService;
  let eventEmitter: EventEmitter2;

  const mockPrismaService = {
    users: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    roles: {
      findFirst: jest.fn(),
    },
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IamService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<IamService>(IamService);
    prismaService = module.get<PrismaService>(PrismaService);
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      email: 'patient@citycare.com',
      password: 'password123',
      firstName: 'Demo',
      lastName: 'Patient',
      phoneNumber: '+1234567890',
      role: 'Patient',
    };

    it('should successfully register a new patient', async () => {
      const mockRole = { id: 1, name: 'Patient' };
      const mockUser = {
        id: 'patient-uuid-123',
        email: registerDto.email,
        first_name: registerDto.firstName,
        last_name: registerDto.lastName,
        phone_number: registerDto.phoneNumber,
        created_at: new Date(),
        roles: { name: 'Patient' },
      };

      mockPrismaService.roles.findFirst.mockResolvedValue(mockRole);
      mockPrismaService.users.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('id');
      expect(result.email).toBe(registerDto.email);
      expect(result.firstName).toBe(registerDto.firstName);
      expect(result.role).toBe('Patient');
      expect(mockEventEmitter.emit).toHaveBeenCalledWith('patient.registered', expect.any(Object));
    });

    it('should successfully register a new clinician', async () => {
      const clinicianDto = {
        email: 'clinician@citycare.com',
        password: 'password123',
        firstName: 'Dr. Demo',
        lastName: 'Clinician',
        role: 'Clinician',
      };
      const mockRole = { id: 2, name: 'Clinician' };
      const mockUser = {
        id: 'clinician-uuid-123',
        email: clinicianDto.email,
        first_name: clinicianDto.firstName,
        last_name: clinicianDto.lastName,
        created_at: new Date(),
        roles: { name: 'Clinician' },
      };

      mockPrismaService.roles.findFirst.mockResolvedValue(mockRole);
      mockPrismaService.users.create.mockResolvedValue(mockUser);

      const result = await service.register(clinicianDto);

      expect(result.role).toBe('Clinician');
      expect(mockEventEmitter.emit).not.toHaveBeenCalledWith('patient.registered', expect.any(Object));
    });

    it('should hash password before storing', async () => {
      const mockRole = { id: 1, name: 'Patient' };
      const mockUser = {
        id: 'user-uuid-123',
        email: registerDto.email,
        first_name: registerDto.firstName,
        last_name: registerDto.lastName,
        created_at: new Date(),
        roles: { name: 'Patient' },
      };

      mockPrismaService.roles.findFirst.mockResolvedValue(mockRole);
      mockPrismaService.users.create.mockResolvedValue(mockUser);

      await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
    });

    it('should default to Patient role if not specified', async () => {
      const dtoWithoutRole = { ...registerDto };
      delete (dtoWithoutRole as any).role;

      const mockRole = { id: 1, name: 'Patient' };
      const mockUser = {
        id: 'user-uuid-123',
        email: dtoWithoutRole.email,
        first_name: dtoWithoutRole.firstName,
        last_name: dtoWithoutRole.lastName,
        created_at: new Date(),
        roles: { name: 'Patient' },
      };

      mockPrismaService.roles.findFirst.mockResolvedValue(mockRole);
      mockPrismaService.users.create.mockResolvedValue(mockUser);

      const result = await service.register(dtoWithoutRole);

      expect(mockPrismaService.roles.findFirst).toHaveBeenCalledWith({
        where: { name: 'Patient' },
      });
    });
  });

  describe('login', () => {
    const mockUser = {
      id: 'user-uuid-123',
      email: 'patient@citycare.com',
      password_hash: 'hashedPassword123',
      first_name: 'Demo',
      last_name: 'Patient',
      is_active: true,
      roles: { id: 1, name: 'Patient' },
    };

    it('should successfully login with valid credentials', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('patient@citycare.com', 'password123');

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('patient@citycare.com');
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(
        service.login('nonexistent@citycare.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login('patient@citycare.com', 'wrongpassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for inactive user', async () => {
      const inactiveUser = { ...mockUser, is_active: false };
      mockPrismaService.users.findUnique.mockResolvedValue(inactiveUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await expect(
        service.login('patient@citycare.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return JWT token on successful login', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('patient@citycare.com', 'password123');

      expect(result.accessToken).toBeDefined();
      expect(typeof result.accessToken).toBe('string');
      expect(result.accessToken.split('.')).toHaveLength(3); // JWT format
    });
  });

  describe('validateUser', () => {
    it('should return user for valid user ID', async () => {
      const mockUser = {
        id: 'user-uuid-123',
        email: 'patient@citycare.com',
        is_active: true,
        roles: { name: 'Patient' },
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);

      const result = await service.validateUser('user-uuid-123');

      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existent user', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      const result = await service.validateUser('non-existent-id');

      expect(result).toBeNull();
    });
  });
});
