import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('bitcoin/initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async initiateBitcoinPayment(
    @Body('orderId') orderId: string,
    @Body('amountUSD') amountUSD: number,
  ) {
    return this.paymentsService.initiateBitcoinPayment(orderId, amountUSD);
  }

  @Post(':id/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async verifyPayment(@Param('id') transactionId: string) {
    return this.paymentsService.verifyPayment(transactionId);
  }

  @Get(':id/status')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getPaymentStatus(@Param('id') transactionId: string) {
    return this.paymentsService.getPaymentStatus(transactionId);
  }

  @Get('btc-price')
  async getBTCPrice() {
    const price = await this.paymentsService.getBTCPrice();
    return { btcPriceUSD: price };
  }
}
