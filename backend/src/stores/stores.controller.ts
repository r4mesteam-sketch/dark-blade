import { Controller, Get, Post, Put, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { StoresService } from './stores.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@ApiTags('Stores')
@Controller('stores')
export class StoresController {
  constructor(private storesService: StoresService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async createStore(@GetUser() user: any, @Body() data: any) {
    return this.storesService.create(user.id, data);
  }

  @Get()
  async getAllStores(@Query('skip') skip = 0, @Query('take') take = 20) {
    return this.storesService.findAll(skip, take);
  }

  @Get('slug/:slug')
  async getStoreBySlug(@Param('slug') slug: string) {
    return this.storesService.findBySlug(slug);
  }

  @Get(':id')
  async getStore(@Param('id') id: string) {
    return this.storesService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  async updateStore(@Param('id') id: string, @Body() data: any) {
    return this.storesService.update(id, data);
  }
}
