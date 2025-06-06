import { PrismaClient } from '../generated/prisma';
import {
  CreatePlatformData,
  UpdatePlatformData,
  PlatformResponse,
  PlatformWithGameCount,
} from '../types/platform.types';
import {
  PaginationResult,
  getPaginationParams,
  createPaginationResult,
} from '../utils/pagination.utils';

export class PlatformService {
  private prisma = new PrismaClient();

  async createPlatform(
    userId: number,
    platformData: CreatePlatformData,
  ): Promise<PlatformResponse> {
    const userPlatforms = await this.prisma.platform.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      select: {
        title: true,
      },
    });

    const titleExists = userPlatforms.some(
      (platform) =>
        platform.title.toLowerCase() === platformData.title.toLowerCase(),
    );

    if (titleExists) {
      throw new Error('A platform with this title already exists.');
    }

    const platform = await this.prisma.platform.create({
      data: {
        ...platformData,
        userId,
      },
      select: {
        id: true,
        title: true,
        company: true,
        acquisitionYear: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return platform;
  }

  async getPlatformsPaginated(
    userId: number,
    page?: number,
    limit?: number,
  ): Promise<PaginationResult<PlatformWithGameCount>> {
    const {
      skip,
      take,
      page: currentPage,
      limit: currentLimit,
    } = getPaginationParams(page, limit || 10);

    const [platforms, totalItems] = await Promise.all([
      this.prisma.platform.findMany({
        where: {
          userId,
          isDeleted: false,
        },
        select: {
          id: true,
          title: true,
          company: true,
          acquisitionYear: true,
          imageUrl: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              games: {
                where: {
                  isDeleted: false,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      this.prisma.platform.count({
        where: {
          userId,
          isDeleted: false,
        },
      }),
    ]);

    return createPaginationResult(
      platforms,
      totalItems,
      currentPage,
      currentLimit,
    );
  }

  async getPlatformById(
    userId: number,
    platformId: number,
  ): Promise<PlatformWithGameCount> {
    const platform = await this.prisma.platform.findFirst({
      where: {
        id: platformId,
        userId,
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        company: true,
        acquisitionYear: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            games: {
              where: {
                isDeleted: false,
              },
            },
          },
        },
      },
    });

    if (!platform) {
      throw new Error('Platform not found.');
    }

    return platform;
  }

  async updatePlatform(
    userId: number,
    platformId: number,
    updateData: UpdatePlatformData,
  ): Promise<PlatformResponse> {
    const existingPlatform = await this.prisma.platform.findFirst({
      where: {
        id: platformId,
        userId,
        isDeleted: false,
      },
    });

    if (!existingPlatform) {
      throw new Error('Platform not found.');
    }    if (updateData.title && updateData.title !== existingPlatform.title) {
      const otherPlatforms = await this.prisma.platform.findMany({
        where: {
          userId,
          isDeleted: false,
          id: {
            not: platformId,
          },
        },
        select: {
          title: true,
        },
      });

      const titleExists = otherPlatforms.some(
        (platform) =>
          platform.title.toLowerCase() === updateData.title!.toLowerCase(),
      );

      if (titleExists) {
        throw new Error('A platform with this title already exists.');
      }
    }

    const updatedPlatform = await this.prisma.platform.update({
      where: {
        id: platformId,
      },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        company: true,
        acquisitionYear: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedPlatform;
  }

  async deletePlatform(userId: number, platformId: number): Promise<void> {
    const platform = await this.prisma.platform.findFirst({
      where: {
        id: platformId,
        userId,
        isDeleted: false,
      },
      include: {
        _count: {
          select: {
            games: {
              where: {
                isDeleted: false,
              },
            },
          },
        },
      },
    });

    if (!platform) {
      throw new Error('Platform not found.');
    }

    if (platform._count.games > 0) {
      throw new Error(
        'Cannot delete platform that has games associated with it.',
      );
    }

    await this.prisma.platform.update({
      where: {
        id: platformId,
      },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });
  }
  async getAllPlatformsForUser(userId: number): Promise<PlatformWithGameCount[]> {
    const platforms = await this.prisma.platform.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
        company: true,
        acquisitionYear: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            games: {
              where: {
                isDeleted: false,
              },
            },
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });

    return platforms;
  }
}
