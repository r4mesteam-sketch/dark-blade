import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(buyerId: string, data: any) {
    const orderNumber = `ORD-${Date.now()}`;
    return this.prisma.order.create({
      data: {
        orderNumber,
        buyerId,
        ...data,
      },
      include: { items: { include: { product: true } } },
    });
  }

  async findOne(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: { include: { product: true, variant: true } },
        user: true,
        store: true,
      },
    });
  }

  async findByBuyer(buyerId: string) {
    return this.prisma.order.findMany({
      where: { buyerId },
      include: { items: true, store: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByStore(storeId: string) {
    return this.prisma.order.findMany({
      where: { storeId },
      include: { items: true, user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status: status as any },
    });
  }
}
