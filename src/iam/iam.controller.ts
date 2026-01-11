import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { IamService } from './iam.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.iamService.register(dto);
  }

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.iamService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: any) {
    return this.iamService.getMe(req.user.sub);
  }
}

