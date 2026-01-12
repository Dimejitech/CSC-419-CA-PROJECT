import { Module } from '@nestjs/common';
import { IamService } from './iam.service';
import { IamController } from './iam.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    PassportModule,
    EventEmitterModule.forRoot(),
  ],
  providers: [IamService, JwtStrategy],
  controllers: [IamController],
})
export class IamModule {}
