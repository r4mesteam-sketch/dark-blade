import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Post('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async createConversation(
    @GetUser('id') userId: string,
    @Body('otherUserId') otherUserId: string,
  ) {
    return this.chatService.getOrCreateChat(userId, otherUserId);
  }

  @Get('conversations')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getConversations(@GetUser('id') userId: string) {
    return this.chatService.getConversations(userId);
  }

  @Get(':chatId/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getMessages(
    @Param('chatId') chatId: string,
    @Query('skip') skip = 0,
    @Query('take') take = 50,
  ) {
    return this.chatService.getMessages(chatId, skip, take);
  }

  @Post(':chatId/messages')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async sendMessage(
    @Param('chatId') chatId: string,
    @GetUser('id') userId: string,
    @Body('content') content: string,
  ) {
    return this.chatService.sendMessage(chatId, userId, content);
  }

  @Post(':chatId/mark-read')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async markAsRead(@Param('chatId') chatId: string, @GetUser('id') userId: string) {
    return this.chatService.markAsRead(chatId, userId);
  }
}
