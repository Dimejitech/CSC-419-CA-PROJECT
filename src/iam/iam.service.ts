import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class IamService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    return this.prisma.users.create({
      data: {
        email: dto.email,
        first_name: dto.firstName,
        last_name: dto.lastName,
        password_hash: passwordHash,
      },
      select: {
        id: true,
        email: true,
      },
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.users.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(
      dto.password,
      user.password_hash,
    );

    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const jwtSecret = process.env.JWT_SECRET as string;

    const signOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN ?? '1d') as StringValue,
    };

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      jwtSecret,
      signOptions,
    );

    return { accessToken: token };
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
