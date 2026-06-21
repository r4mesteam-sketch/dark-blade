import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(storeId: string, data: any) {
    return this.prisma.product.create({
      data: {
        storeId,
        ...data,
      },
    });
  }

  async findOne(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        variants: true,
        reviews: true,
        store: true,
      },
    });
  }

  async findAll(skip = 0, take = 20, filters?: any) {
    const where: any = { isDraft: false, status: 'active' };

    if (filters?.categoryId) where.categoryId = filters.categoryId;
    if (filters?.storeId) where.storeId = filters.storeId;
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.product.findMany({
      where,
      skip,
      take,
      include: { images: { take: 1 }, store: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
