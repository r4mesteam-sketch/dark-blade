import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class StoresService {
  constructor(private prisma: PrismaService) {}

  async create(sellerId: string, data: any) {
    return this.prisma.store.create({
      data: {
        sellerId,
        ...data,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.store.findUnique({
      where: { id },
      include: {
        seller: { include: { user: true } },
        products: { take: 10 },
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.store.findUnique({
      where: { storeSlug: slug },
      include: { seller: true, products: true },
    });
  }

  async findAll(skip = 0, take = 20) {
    return this.prisma.store.findMany({
      skip,
      take,
      include: { seller: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.store.update({
      where: { id },
      data,
    });
  }
}
