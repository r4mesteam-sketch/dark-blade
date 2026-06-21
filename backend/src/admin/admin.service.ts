import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get dashboard stats
   */
  async getDashboardStats() {
    const [userCount, sellerCount, orderCount, revenue] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.seller.count(),
      this.prisma.order.count(),
      this.prisma.order.aggregate({
        _sum: { total: true },
      }),
    ]);

    return {
      totalUsers: userCount,
      totalSellers: sellerCount,
      totalOrders: orderCount,
      totalRevenue: revenue._sum.total || 0,
    };
  }

  /**
   * Get all users
   */
  async getUsers(skip = 0, take = 20) {
    return this.prisma.user.findMany({
      skip,
      take,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Suspend user
   */
  async suspendUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isSuspended: true },
    });
  }

  /**
   * Activate user
   */
  async activateUser(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isSuspended: false, isActive: true },
    });
  }

  /**
   * Get all reports
   */
  async getReports(skip = 0, take = 20) {
    return this.prisma.report.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Review report
   */
  async reviewReport(reportId: string, status: string, notes?: string) {
    return this.prisma.report.update({
      where: { id: reportId },
      data: {
        status: status as any,
        adminNotes: notes,
        reviewedAt: new Date(),
      },
    });
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(skip = 0, take = 50) {
    return this.prisma.auditLog.findMany({
      skip,
      take,
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get site settings
   */
  async getSettings() {
    const settings = await this.prisma.siteSettings.findMany();
    const result = {};
    settings.forEach((s) => {
      result[s.key] = s.value;
    });
    return result;
  }

  /**
   * Update site settings
   */
  async updateSettings(key: string, value: string) {
    return this.prisma.siteSettings.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}
