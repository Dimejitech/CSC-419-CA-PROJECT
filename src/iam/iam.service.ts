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

    try {
      const user = await this.prisma.users.create({
        data: {
          email: data.email,
          password_hash: hashedPassword,
          first_name: data.firstName,
          last_name: data.lastName,
        },
      });

      // ✅ Emit event
      this.eventEmitter.emit(
        'patient.registered',
        new PatientRegisteredEvent(user.id),
      );

      return { id: user.id, email: user.email };
    } catch {
      throw new ConflictException('Email already exists');
    }
  }

  async login(email: string, password: string) {
    const user = await this.prisma.users.findUnique({ where: { email } });

    if (!user) throw new UnauthorizedException();

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) throw new UnauthorizedException();

    const accessToken = jwt.sign(
      { sub: user.id },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' },
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
      },
    };
  }

  async refreshToken(token: string) {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const accessToken = jwt.sign(
      { sub: payload.sub },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' },
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
      },
    });
  }
}
