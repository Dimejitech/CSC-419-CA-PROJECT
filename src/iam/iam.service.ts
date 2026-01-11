import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import type { StringValue } from 'ms';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RegisterDto } from './dto/register.dto';


@Injectable()
export class IamService {
  constructor(private readonly prisma: PrismaService) {}

  async register(data: RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
  
    try {
      const user = await this.prisma.users.create({
        data: {
          email: data.email,
          password_hash: hashedPassword,
          first_name: data.firstName,
          last_name: data.lastName,
        },
        select: {
          id: true,
          email: true,
        },
      });
  
      return user;
    } catch (error: unknown) {
      
      if (error instanceof PrismaClientKnownRequestError) {

        if (error.code === 'P2002') {
          throw new ConflictException('Email already exists');
        }
      }
  
      throw new InternalServerErrorException('Registration failed');
    }
  }
  
  

  
  async login(email: string, password: string) {
    const user = await this.prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    
    const jwtOptions: SignOptions = {
      expiresIn: (process.env.JWT_EXPIRES_IN ?? '1d') as StringValue,
    };
    

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      jwtOptions,
    );

    return {
      accessToken: token,
    };
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
