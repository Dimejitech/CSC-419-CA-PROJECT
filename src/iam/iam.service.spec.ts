import { Test, TestingModule } from '@nestjs/testing';
import { IamService } from './iam.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Mock bcrypt
jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashedPassword123'),
  compare: jest.fn(),
}));

// Mock jsonwebtoken
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockReturnValue('mock.jwt.token'),
  verify: jest.fn().mockReturnValue({ sub: 'user-uuid-123' }),
}));

// Mock crypto
jest.mock('crypto', () => ({
  randomBytes: jest.fn().mockReturnValue({
    toString: jest.fn().mockReturnValue('mockresettoken123'),
  }),
  createHash: jest.fn().mockReturnValue({
    update: jest.fn().mockReturnValue({
      digest: jest.fn().mockReturnValue('hashedtoken123'),
    }),
  }),
}));

describe('IamService', () => {
  let service: IamService;

  const mockPrismaService = {
    users: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
    },
    roles: {
      findUnique: jest.fn(),
    },
    system_audit_logs: {
      create: jest.fn(),
    },
  };

  const mockEventEmitter = {
    emit: jest.fn(),
  };

  beforeEach(async () => {
    // Set JWT_SECRET for tests
    process.env.JWT_SECRET = 'test-secret-key';

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IamService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    service = module.get<IamService>(IamService);

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
      role: 'Patient',
    };

    it('should successfully register a new patient', async () => {
      const mockRole = { id: 1, name: 'Patient' };
      const mockUser = {
        id: 'patient-uuid-123',
        email: registerDto.email,
        first_name: registerDto.firstName,
        last_name: registerDto.lastName,
        phone_number: null,
        role_id: 1,
        roles: { name: 'Patient' },
      };

      mockPrismaService.roles.findUnique.mockResolvedValue(mockRole);
      mockPrismaService.users.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('id');
      expect(result.email).toBe(registerDto.email);
      expect(result.first_name).toBe(registerDto.firstName);
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
        phone_number: null,
        role_id: 2,
        roles: { name: 'Clinician' },
      };

      mockPrismaService.roles.findUnique.mockResolvedValue(mockRole);
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
        phone_number: null,
        role_id: 1,
        roles: { name: 'Patient' },
      };

      mockPrismaService.roles.findUnique.mockResolvedValue(mockRole);
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
        phone_number: null,
        role_id: 1,
        roles: { name: 'Patient' },
      };

      mockPrismaService.roles.findUnique.mockResolvedValue(mockRole);
      mockPrismaService.users.create.mockResolvedValue(mockUser);

      await service.register(dtoWithoutRole);

      expect(mockPrismaService.roles.findUnique).toHaveBeenCalledWith({
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
      phone_number: null,
      address: null,
      city: null,
      state: null,
      zip_code: null,
      is_active: true,
      role_id: 1,
      roles: { id: 1, name: 'Patient' },
    };

    it('should successfully login with valid credentials', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.system_audit_logs.create.mockResolvedValue({});
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
      mockPrismaService.system_audit_logs.create.mockResolvedValue({});
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login('patient@citycare.com', 'password123');

      expect(result.accessToken).toBeDefined();
      expect(typeof result.accessToken).toBe('string');
    });
  });

  describe('getMe', () => {
    it('should return user profile for valid user ID', async () => {
      const mockUser = {
        id: 'user-uuid-123',
        email: 'patient@citycare.com',
        first_name: 'Demo',
        last_name: 'Patient',
        role_id: 1,
        phone_number: null,
        address: null,
        city: null,
        state: null,
        zip_code: null,
        is_active: true,
        created_at: new Date(),
        roles: { id: 1, name: 'Patient' },
      };

      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);

      const result = await service.getMe('user-uuid-123');

      expect(result).toEqual(mockUser);
    });

    it('should return null for non-existent user', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      const result = await service.getMe('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('changePassword', () => {
    const mockUser = {
      id: 'user-uuid-123',
      password_hash: 'oldHashedPassword',
    };

    it('should change password with valid current password', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.users.update.mockResolvedValue({});
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.changePassword('user-uuid-123', 'oldPassword', 'newPassword');

      expect(result).toEqual({ message: 'Password changed successfully' });
      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
    });

    it('should throw UnauthorizedException for wrong current password', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.changePassword('user-uuid-123', 'wrongPassword', 'newPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      await expect(
        service.changePassword('non-existent', 'oldPassword', 'newPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('forgotPassword', () => {
    it('should return success message for existing user', async () => {
      const mockUser = { id: 'user-uuid-123', email: 'test@example.com' };
      mockPrismaService.users.findUnique.mockResolvedValue(mockUser);
      mockPrismaService.users.update.mockResolvedValue({});
      mockPrismaService.system_audit_logs.create.mockResolvedValue({});

      const result = await service.forgotPassword('test@example.com');

      expect(result.message).toContain('If an account exists');
      expect(result._demo_token).toBeDefined();
    });

    it('should return success message for non-existent user (no enumeration)', async () => {
      mockPrismaService.users.findUnique.mockResolvedValue(null);

      const result = await service.forgotPassword('nonexistent@example.com');

      expect(result.message).toContain('If an account exists');
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const mockUser = {
        id: 'user-uuid-123',
        email: 'test@example.com',
        password_reset_token: 'hashedtoken123',
        password_reset_expires: new Date(Date.now() + 3600000),
      };
      mockPrismaService.users.findFirst.mockResolvedValue(mockUser);
      mockPrismaService.users.update.mockResolvedValue({});
      mockPrismaService.system_audit_logs.create.mockResolvedValue({});

      const result = await service.resetPassword('validtoken', 'newPassword123');

      expect(result.message).toContain('Password has been reset successfully');
    });

    it('should throw BadRequestException for invalid token', async () => {
      mockPrismaService.users.findFirst.mockResolvedValue(null);

      await expect(
        service.resetPassword('invalidtoken', 'newPassword123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateProfile', () => {
    it('should update user profile', async () => {
      const mockUpdatedUser = {
        id: 'user-uuid-123',
        email: 'updated@example.com',
        first_name: 'Updated',
        last_name: 'User',
        phone_number: '1234567890',
        address: '123 Main St',
        city: 'Test City',
        state: 'TS',
        zip_code: '12345',
        role_id: 1,
        roles: { id: 1, name: 'Patient' },
      };

      mockPrismaService.users.update.mockResolvedValue(mockUpdatedUser);

      const result = await service.updateProfile('user-uuid-123', {
        firstName: 'Updated',
        lastName: 'User',
        email: 'updated@example.com',
      });

      expect(result.first_name).toBe('Updated');
      expect(result.email).toBe('updated@example.com');
    });
  });
});
