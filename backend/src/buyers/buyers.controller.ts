import { Controller, Get, Post, Delete, Param, UseGuards, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BuyersService } from './buyers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Buyers')
@Controller('buyers')
export class BuyersController {
  constructor(private buyersService: BuyersService) {}

  @Get('wishlists')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async getWishlist(@GetUser() user: any) {
    const buyer = await this.buyersService.findByUserId(user.id);
    return this.buyersService.getWishlist(buyer.id);
  }

  @Post('wishlists/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async addToWishlist(@GetUser() user: any, @Param('productId') productId: string) {
    const buyer = await this.buyersService.findByUserId(user.id);
    return this.buyersService.addToWishlist(buyer.id, productId);
  }

  @Delete('wishlists/:productId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async removeFromWishlist(@GetUser() user: any, @Param('productId') productId: string) {
    const buyer = await this.buyersService.findByUserId(user.id);
    return this.buyersService.removeFromWishlist(buyer.id, productId);
  }
}
