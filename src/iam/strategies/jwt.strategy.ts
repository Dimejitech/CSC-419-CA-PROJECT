import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.prisma.users.findUnique({
      where: { id: payload.sub },
    });

    if (!user || user.is_active === false) {
      throw new UnauthorizedException();
    }

    // 👇 THIS is what becomes req.user
    return {
      id: user.id,
      email: user.email,
      roleId: user.role_id,
    };
  }
}
