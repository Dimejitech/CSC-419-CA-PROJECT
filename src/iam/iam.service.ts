import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PatientRegisteredEvent } from './events/patient-registered.event';

@Injectable()
export class IamService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async register(data: any) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Look up role_id based on role name (default to 'Patient')
    const roleName = data.role || 'Patient';
    const role = await this.prisma.roles.findUnique({
      where: { name: roleName },
    });

    try {
      const user = await this.prisma.users.create({
        data: {
          email: data.email,
          password_hash: hashedPassword,
          first_name: data.firstName,
          last_name: data.lastName,
          role_id: role?.id,
        },
        include: {
          roles: true,
        },
      });

      // Emit event for patient registration (creates patient chart)
      if (roleName === 'Patient') {
        this.eventEmitter.emit(
          'patient.registered',
          new PatientRegisteredEvent(user.id),
        );
      }

      return {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        role: user.roles?.name,
        role_id: user.role_id,
      };
    } catch {
      throw new ConflictException('Email already exists');
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
      include: { roles: true },
    });

    if (!user) throw new UnauthorizedException();

    // Check if user is active
    if (user.is_active === false) {
      throw new UnauthorizedException('Account is deactivated');
    }

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new UnauthorizedException();

    const accessToken = jwt.sign(
      { sub: user.id, role: user.roles?.name },
      process.env.JWT_SECRET!,
      { expiresIn: '3h' },
    );

    const refreshToken = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' },
    );

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        phone_number: user.phone_number,
        address: user.address,
        city: user.city,
        state: user.state,
        zip_code: user.zip_code,
        role: user.roles?.name,
        role_id: user.role_id,
      },
    };
  }

  async refreshToken(token: string) {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const accessToken = jwt.sign(
      { sub: payload.sub },
      process.env.JWT_SECRET!,
      { expiresIn: '3h' },
    );

    return { accessToken };
  }

  async getMe(userId: string) {
    return this.prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        role_id: true,
        phone_number: true,
        address: true,
        city: true,
        state: true,
        zip_code: true,
        is_active: true,
        created_at: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async updateProfile(
    userId: string,
    data: {
      firstName?: string;
      lastName?: string;
      phoneNumber?: string;
      email?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    },
  ) {
    const updateData: any = {};

    if (data.firstName) updateData.first_name = data.firstName;
    if (data.lastName) updateData.last_name = data.lastName;
    if (data.phoneNumber) updateData.phone_number = data.phoneNumber;
    if (data.email) updateData.email = data.email;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.state !== undefined) updateData.state = data.state;
    if (data.zipCode !== undefined) updateData.zip_code = data.zipCode;

    const user = await this.prisma.users.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        phone_number: true,
        address: true,
        city: true,
        state: true,
        zip_code: true,
        role_id: true,
        roles: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.users.update({
      where: { id: userId },
      data: { password_hash: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }
}
