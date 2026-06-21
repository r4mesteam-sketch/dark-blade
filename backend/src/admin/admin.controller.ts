import { Controller, Get, Post, Patch, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
import { Role } from '@prisma/client';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth('access-token')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  async getDashboard() {
    return this.adminService.getDashboardStats();
  }

  @Get('users')
  async getUsers(@Query('skip') skip = 0, @Query('take') take = 20) {
    return this.adminService.getUsers(skip, take);
  }

  @Patch('users/:id/suspend')
  async suspendUser(@Param('id') userId: string) {
    return this.adminService.suspendUser(userId);
  }

  @Patch('users/:id/activate')
  async activateUser(@Param('id') userId: string) {
    return this.adminService.activateUser(userId);
  }

  @Get('reports')
  async getReports(@Query('skip') skip = 0, @Query('take') take = 20) {
    return this.adminService.getReports(skip, take);
  }

  @Patch('reports/:id')
  async reviewReport(
    @Param('id') reportId: string,
    @Body('status') status: string,
    @Body('notes') notes?: string,
  ) {
    return this.adminService.reviewReport(reportId, status, notes);
  }

  @Get('audit-logs')
  async getAuditLogs(@Query('skip') skip = 0, @Query('take') take = 50) {
    return this.adminService.getAuditLogs(skip, take);
  }

  @Get('settings')
  async getSettings() {
    return this.adminService.getSettings();
  }

  @Post('settings')
  async updateSettings(@Body('key') key: string, @Body('value') value: string) {
    return this.adminService.updateSettings(key, value);
  }
}
