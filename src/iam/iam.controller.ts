import { Controller, Post, Body, Get, Req, UseGuards } from '@nestjs/common';
import { IamService } from './iam.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class IamController {
  constructor(private readonly iamService: IamService) {}

  @Post('register')
  register(@Body() body: any) {
    return this.iamService.register(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.iamService.login(body.email, body.password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Req() req: any) {
    return this.iamService.getMe(req.user.id);
}

}

