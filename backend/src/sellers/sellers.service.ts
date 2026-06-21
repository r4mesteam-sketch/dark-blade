import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class SellersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: any) {
    return this.prisma.seller.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.seller.findUnique({
      where: { id },
      include: { user: true, store: true },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.seller.findUnique({
      where: { userId },
      include: { store: true },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.seller.update({
      where: { id },
      data,
    });
  }
}
