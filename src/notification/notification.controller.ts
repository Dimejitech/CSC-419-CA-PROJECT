import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from '../iam/guards/jwt-auth.guard';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async findAll(@Request() req: any, @Query('limit') limit?: string) {
    const userId = req.user.sub;
    const notifications = await this.notificationService.findAllForUser(
      userId,
      limit ? parseInt(limit, 10) : 20,
    );
    const unreadCount = await this.notificationService.getUnreadCount(userId);

    return {
      notifications,
      unreadCount,
    };
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req: any) {
    const userId = req.user.sub;
    const count = await this.notificationService.getUnreadCount(userId);
    return { count };
  }

  @Patch(':id/read')
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    await this.notificationService.markAsRead(id, userId);
    return { success: true };
  }

  @Post('read-all')
  async markAllAsRead(@Request() req: any) {
    const userId = req.user.sub;
    await this.notificationService.markAllAsRead(userId);
    return { success: true };
  }

  @Delete(':id')
  async delete(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.sub;
    await this.notificationService.delete(id, userId);
    return { success: true };
  }
}
