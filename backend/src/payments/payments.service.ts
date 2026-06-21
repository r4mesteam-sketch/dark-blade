import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../common/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class PaymentsService {
  private readonly COINGECKO_API = 'https://api.coingecko.com/api/v3';

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  /**
   * Create a Bitcoin payment request
   */
  async initiateBitcoinPayment(orderId: string, amountUSD: number) {
    // Generate unique payment address for this order
    const paymentAddress = this.generatePaymentAddress();

    // Get current BTC price
    const btcPrice = await this.getBTCPrice();
    const amountBTC = amountUSD / btcPrice;

    // Create transaction record
    const transaction = await this.prisma.bitcoinTransaction.create({
      data: {
        orderId,
        toAddress: paymentAddress,
        amountBTC,
        amountUSD,
        status: 'PENDING',
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour expiry
      },
    });

    return {
      id: transaction.id,
      paymentAddress,
      amountBTC: amountBTC.toFixed(8),
      amountUSD,
      expiresAt: transaction.expiresAt,
    };
  }

  /**
   * Verify Bitcoin payment (mock implementation)
   */
  async verifyPayment(transactionId: string) {
    const transaction = await this.prisma.bitcoinTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    // Mock blockchain verification
    // In production, connect to Bitcoin node or blockchain API
    const isConfirmed = await this.checkBlockchainConfirmation(
      transaction.toAddress,
      transaction.amountBTC,
    );

    if (isConfirmed) {
      // Update transaction status
      await this.prisma.bitcoinTransaction.update({
        where: { id: transactionId },
        data: {
          status: 'CONFIRMED',
          confirmedAt: new Date(),
          confirmations: 3,
        },
      });

      // Update order status to PAYMENT_CONFIRMED
      if (transaction.orderId) {
        await this.prisma.order.update({
          where: { id: transaction.orderId },
          data: { status: 'PAYMENT_CONFIRMED' },
        });
      }

      return { status: 'CONFIRMED', message: 'Payment verified' };
    }

    return { status: 'PENDING', message: 'Awaiting confirmations' };
  }

  /**
   * Get current BTC price in USD
   */
  async getBTCPrice(): Promise<number> {
    try {
      const response = await axios.get(
        `${this.COINGECKO_API}/simple/price?ids=bitcoin&vs_currencies=usd`,
      );
      return response.data.bitcoin.usd || 40000; // Fallback price
    } catch (error) {
      console.error('Error fetching BTC price:', error);
      return 40000; // Fallback price
    }
  }

  /**
   * Helper: Generate unique payment address (mock)
   */
  private generatePaymentAddress(): string {
    return `1DarkBlade${Math.random().toString(36).substring(2, 20).toUpperCase()}`;
  }

  /**
   * Helper: Check blockchain confirmations (mock)
   */
  private async checkBlockchainConfirmation(
    address: string,
    amount: number,
  ): Promise<boolean> {
    // Mock: randomly return confirmed status after a few seconds
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(Math.random() > 0.5);
      }, 2000);
    });
  }

  /**
   * Get payment status
   */
  async getPaymentStatus(transactionId: string) {
    const transaction = await this.prisma.bitcoinTransaction.findUnique({
      where: { id: transactionId },
    });

    if (!transaction) {
      throw new BadRequestException('Transaction not found');
    }

    return {
      id: transaction.id,
      status: transaction.status,
      amountBTC: transaction.amountBTC,
      amountUSD: transaction.amountUSD,
      confirmations: transaction.confirmations,
      confirmedAt: transaction.confirmedAt,
    };
  }
}
