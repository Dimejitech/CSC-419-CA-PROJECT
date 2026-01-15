import { Test, TestingModule } from '@nestjs/testing';
import { IamController } from './iam.controller';
import { IamService } from './iam.service';

describe('IamController', () => {
  let controller: IamController;

  const mockIamService = {
    register: jest.fn(),
    login: jest.fn(),
    refreshToken: jest.fn(),
    getMe: jest.fn(),
    updateProfile: jest.fn(),
    changePassword: jest.fn(),
    forgotPassword: jest.fn(),
    resetPassword: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IamController],
      providers: [
        { provide: IamService, useValue: mockIamService },
      ],
    }).compile();

    controller = module.get<IamController>(IamController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = { email: 'test@example.com', password: 'password123', firstName: 'Test', lastName: 'User' };
      const expected = { id: 'user-123', email: dto.email };
      mockIamService.register.mockResolvedValue(expected);

      const result = await controller.register(dto as any);

      expect(result).toEqual(expected);
      expect(mockIamService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const dto = { email: 'test@example.com', password: 'password123' };
      const expected = { accessToken: 'jwt.token.here', user: { id: 'user-123' } };
      mockIamService.login.mockResolvedValue(expected);

      const result = await controller.login(dto);

      expect(result).toEqual(expected);
      expect(mockIamService.login).toHaveBeenCalledWith(dto.email, dto.password);
    });
  });

  describe('forgotPassword', () => {
    it('should handle forgot password request', async () => {
      const dto = { email: 'test@example.com' };
      const expected = { message: 'If an account exists, you will receive an email' };
      mockIamService.forgotPassword.mockResolvedValue(expected);

      const result = await controller.forgotPassword(dto);

      expect(result).toEqual(expected);
      expect(mockIamService.forgotPassword).toHaveBeenCalledWith(dto.email);
    });
  });

  describe('resetPassword', () => {
    it('should reset password', async () => {
      const dto = { token: 'reset-token', newPassword: 'newPassword123' };
      const expected = { message: 'Password reset successfully' };
      mockIamService.resetPassword.mockResolvedValue(expected);

      const result = await controller.resetPassword(dto);

      expect(result).toEqual(expected);
      expect(mockIamService.resetPassword).toHaveBeenCalledWith(dto.token, dto.newPassword);
    });
  });
});
