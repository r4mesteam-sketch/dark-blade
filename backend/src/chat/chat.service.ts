import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import * as crypto from 'crypto';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create or get existing chat conversation
   */
  async getOrCreateChat(userId1: string, userId2: string) {
    let chat = await this.prisma.chat.findFirst({
      where: {
        OR: [
          { initiatedById: userId1, chatWithId: userId2 },
          { initiatedById: userId2, chatWithId: userId1 },
        ],
      },
      include: { messages: { take: 20, orderBy: { createdAt: 'desc' } } },
    });

    if (!chat) {
      chat = await this.prisma.chat.create({
        data: {
          initiatedById: userId1,
          chatWithId: userId2,
        },
        include: { messages: true },
      });
    }

    return chat;
  }

  /**
   * Send encrypted message
   */
  async sendMessage(chatId: string, senderId: string, content: string) {
    // Encrypt message content
    const encryptedContent = this.encryptMessage(content);

    const message = await this.prisma.message.create({
      data: {
        chatId,
        senderId,
        content: encryptedContent,
        isEncrypted: true,
      },
    });

    // Update last message time on chat
    await this.prisma.chat.update({
      where: { id: chatId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  /**
   * Get chat messages
   */
  async getMessages(chatId: string, skip = 0, take = 50) {
    const messages = await this.prisma.message.findMany({
      where: { chatId, isDeleted: false },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });

    // Decrypt messages
    return messages.map((msg) => ({
      ...msg,
      content: msg.isEncrypted ? this.decryptMessage(msg.content) : msg.content,
    }));
  }

  /**
   * Get conversations for user
   */
  async getConversations(userId: string) {
    return this.prisma.chat.findMany({
      where: {
        OR: [{ initiatedById: userId }, { chatWithId: userId }],
        isArchived: false,
      },
      include: {
        initiatedBy: { select: { id: true, email: true, firstName: true } },
        chatWith: { select: { id: true, email: true, firstName: true } },
        messages: { take: 1, orderBy: { createdAt: 'desc' } },
      },
      orderBy: { lastMessageAt: 'desc' },
    });
  }

  /**
   * Mark messages as read
   */
  async markAsRead(chatId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: { chatId, senderId: { not: userId }, isRead: false },
      data: { isRead: true, readAt: new Date() },
    });
  }

  /**
   * Block user
   */
  async blockUser(chatId: string, userId: string) {
    return this.prisma.chat.update({
      where: { id: chatId },
      data: { blockedBy: userId },
    });
  }

  /**
   * Helper: Encrypt message
   */
  private encryptMessage(text: string): string {
    // Simple encryption - in production use proper encryption like libsodium
    const cipher = crypto.createCipher('aes-256-cbc', 'dark-blade-secret');
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  /**
   * Helper: Decrypt message
   */
  private decryptMessage(encrypted: string): string {
    try {
      const decipher = crypto.createDecipher('aes-256-cbc', 'dark-blade-secret');
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch (error) {
      return encrypted;
    }
  }
}
