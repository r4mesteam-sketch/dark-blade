import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class BuyersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string) {
    return this.prisma.buyer.create({
      data: { userId },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.buyer.findUnique({
      where: { userId },
    });
  }

  async getWishlist(buyerId: string) {
    return this.prisma.wishlist.findMany({
      where: { buyerId },
      include: { product: true },
    });
  }

  async addToWishlist(buyerId: string, productId: string) {
    return this.prisma.wishlist.create({
      data: { buyerId, productId },
    });
  }

  async removeFromWishlist(buyerId: string, productId: string) {
    return this.prisma.wishlist.delete({
      where: { buyerId_productId: { buyerId, productId } },
    });
  }
}
