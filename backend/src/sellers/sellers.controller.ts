import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SellersService } from './sellers.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { GetUser } from '../common/decorators/get-user.decorator';
import { Role } from '@prisma/client';

@ApiTags('Sellers')
@Controller('sellers')
export class SellersController {
  constructor(private sellersService: SellersService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async registerSeller(
    @GetUser('id') userId: string,
    @Body() data: any,
  ) {
    return this.sellersService.create(userId, data);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.SELLER)
  @ApiBearerAuth('access-token')
  async getMySeller(@GetUser('id') userId: string) {
    return this.sellersService.findByUserId(userId);
  }

  @Get(':id')
  async getSeller(@Param('id') id: string) {
    return this.sellersService.findOne(id);
  }
}
