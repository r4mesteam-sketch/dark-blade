import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class SubscriptionsService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createSubscription(sellerId: string) {
    const priceUSD = parseFloat(
      this.configService.get('SELLER_SUBSCRIPTION_PRICE_USD') || '50',
    );
    const now = new Date();
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

    return this.prisma.subscription.create({
      data: {
        sellerId,
        status: 'ACTIVE',
        priceUSD,
        startDate: now,
        endDate,
        renewalDate: endDate,
      },
    });
  }

  async findByUserId(sellerId: string) {
    return this.prisma.subscription.findFirst({
      where: { sellerId },
    });
  }

  async checkSubscriptionStatus(sellerId: string): Promise<boolean> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { sellerId },
    });

    if (!subscription) return false;
    if (subscription.status !== 'ACTIVE') return false;

    const now = new Date();
    return subscription.endDate > now;
  }

  async renewSubscription(subscriptionId: string) {
    const subscription = await this.prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    const endDate = new Date(
      subscription.endDate.getTime() + 30 * 24 * 60 * 60 * 1000,
    );

    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status: 'ACTIVE',
        endDate,
        renewalDate: endDate,
      },
    });
  }

  async suspendSubscription(subscriptionId: string) {
    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'SUSPENDED' },
    });
  }

  async cancelSubscription(subscriptionId: string) {
    return this.prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: 'CANCELLED' },
    });
  }
}
