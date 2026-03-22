import prisma from '../lib/prisma';
import { DashboardStats, DashboardResponse } from '../types/dashboard.types';

export class DashboardService {
  private prisma = prisma;

  async getDashboardStats(userId: number): Promise<DashboardResponse> {
    const [totalGames, totalCategories, totalPlatforms, totalFavorites] =
      await Promise.all([
        this.prisma.game.count({
          where: { userId, isDeleted: false },
        }),
        this.prisma.category.count({
          where: { userId, isDeleted: false },
        }),
        this.prisma.platform.count({
          where: { userId, isDeleted: false },
        }),
        this.prisma.game.count({
          where: { userId, isDeleted: false, isFavorite: true },
        }),
      ]);

    const stats: DashboardStats = {
      totalGames,
      totalCategories,
      totalPlatforms,
      totalFavorites,
    };

    return { stats };
  }

  async getGamesByStatus(userId: number) {
    const gamesByStatus = await this.prisma.game.groupBy({
      by: ['status'],
      where: { userId, isDeleted: false },
      _count: {
        status: true,
      },
    });

    const statusSummary: Record<string, number> = {};

    for (const item of gamesByStatus as Array<{
      status: string;
      _count: { status: number };
    }>) {
      statusSummary[item.status] = item._count.status;
    }

    return statusSummary;
  }

  async getRecentGames(userId: number, limit: number = 5) {
    const recentGames = await this.prisma.game.findMany({
      where: { userId, isDeleted: false },
      select: {
        id: true,
        title: true,
        status: true,
        isFavorite: true,
        createdAt: true,
        category: { select: { id: true, name: true } },
        platform: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return recentGames;
  }
}
