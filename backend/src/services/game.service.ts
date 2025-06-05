import { PrismaClient, GameStatus } from '../generated/prisma';
import {
  CreateGameData,
  UpdateGameData,
  GameResponse,
  GameFilters,
} from '../types/game.types';
import {
  PaginationResult,
  getPaginationParams,
  createPaginationResult,
} from '../utils/pagination.utils';

export class GameService {
  private prisma = new PrismaClient();

  async createGame(
    userId: number,
    gameData: CreateGameData,
  ): Promise<GameResponse> {
    const userGames = await this.prisma.game.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      select: {
        title: true,
      },
    });

    const titleExists = userGames.some(
      (game) => game.title.toLowerCase() === gameData.title.toLowerCase(),
    );

    if (titleExists) {
      throw new Error('A game with this title already exists.');
    }

    const category = await this.prisma.category.findFirst({
      where: { id: gameData.categoryId, userId, isDeleted: false },
    });
    if (!category) {
      throw new Error('Category not found or access denied.');
    }

    if (gameData.platformId) {
      const platform = await this.prisma.platform.findFirst({
        where: { id: gameData.platformId, userId, isDeleted: false },
      });
      if (!platform) {
        throw new Error('Platform not found or access denied.');
      }
    }

    let finalFinishDate: Date | null = gameData.finishDate
      ? new Date(gameData.finishDate)
      : null;
    if (gameData.status === GameStatus.Playing) {
      finalFinishDate = null;
    } else {
      if (!finalFinishDate) {
        throw new Error(
          'Finish date is required for Done or Abandoned status.',
        );
      }
      if (finalFinishDate < new Date(gameData.acquisitionDate)) {
        throw new Error('Finish date cannot be earlier than acquisition date.');
      }
    }

    const game = await this.prisma.game.create({
      data: {
        ...gameData,
        userId,
        acquisitionDate: new Date(gameData.acquisitionDate),
        finishDate: finalFinishDate,
        platformId: gameData.platformId ?? undefined,
        isFavorite: gameData.isFavorite ?? false,
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        acquisitionDate: true,
        finishDate: true,
        status: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, name: true } },
        platform: { select: { id: true, title: true } },
      },
    });
    return game as GameResponse;
  }

  async getGamesPaginated(
    userId: number,
    filters: GameFilters,
    page?: number,
    limit?: number,
  ): Promise<PaginationResult<GameResponse>> {
    const {
      skip,
      take,
      page: currentPage,
      limit: currentLimit,
    } = getPaginationParams(page, limit || 10);

    const whereClause: any = { userId, isDeleted: false };

    let searchMatchingIds: number[] | undefined;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const allUserGames = await this.prisma.game.findMany({
        where: { userId, isDeleted: false },
        select: { id: true, title: true, description: true },
      });

      searchMatchingIds = allUserGames
        .filter(
          (game) =>
            game.title.toLowerCase().includes(searchLower) ||
            (game.description &&
              game.description.toLowerCase().includes(searchLower)),
        )
        .map((game) => game.id);

      if (searchMatchingIds.length === 0) {
        return createPaginationResult([], 0, currentPage, currentLimit);
      }
    }

    if (searchMatchingIds) {
      whereClause.id = { in: searchMatchingIds };
    }
    if (filters.categoryId) {
      whereClause.categoryId = filters.categoryId;
    }
    if (filters.platformId) {
      whereClause.platformId = filters.platformId;
    }
    if (filters.status) {
      whereClause.status = filters.status;
    }
    if (filters.isFavorite !== undefined) {
      whereClause.isFavorite = filters.isFavorite;
    }

    const [games, totalItems] = await Promise.all([
      this.prisma.game.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          acquisitionDate: true,
          finishDate: true,
          status: true,
          isFavorite: true,
          createdAt: true,
          updatedAt: true,
          category: { select: { id: true, name: true } },
          platform: { select: { id: true, title: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.game.count({ where: whereClause }),
    ]);

    return createPaginationResult(
      games as GameResponse[],
      totalItems,
      currentPage,
      currentLimit,
    );
  }

  async getGameById(
    userId: number,
    gameId: number,
  ): Promise<GameResponse | null> {
    const game = await this.prisma.game.findFirst({
      where: { id: gameId, userId, isDeleted: false },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        acquisitionDate: true,
        finishDate: true,
        status: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, name: true } },
        platform: { select: { id: true, title: true } },
      },
    });
    if (!game) {
      throw new Error('Game not found or access denied.');
    }
    return game as GameResponse;
  }

  async updateGame(
    userId: number,
    gameId: number,
    updateData: UpdateGameData,
  ): Promise<GameResponse> {
    const game = await this.prisma.game.findFirst({
      where: { id: gameId, userId, isDeleted: false },
    });

    if (!game) {
      throw new Error('Game not found or access denied.');
    }

    if (updateData.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: updateData.categoryId, userId, isDeleted: false },
      });
      if (!category) {
        throw new Error('Category not found or access denied.');
      }
    }

    if (updateData.platformId !== undefined) {
      if (updateData.platformId !== null) {
        const platform = await this.prisma.platform.findFirst({
          where: { id: updateData.platformId, userId, isDeleted: false },
        });
        if (!platform) {
          throw new Error('Platform not found or access denied.');
        }
      }
    }

    if (updateData.title && updateData.title !== game.title) {
      const otherGames = await this.prisma.game.findMany({
        where: {
          userId,
          isDeleted: false,
          id: {
            not: gameId,
          },
        },
        select: {
          title: true,
        },
      });

      const titleExists = otherGames.some(
        (existingGame) =>
          existingGame.title.toLowerCase() === updateData.title!.toLowerCase(),
      );

      if (titleExists) {
        throw new Error('A game with this title already exists.');
      }
    }

    const currentStatus = updateData.status ?? game.status;
    let finalFinishDate: Date | null | undefined = updateData.finishDate
      ? new Date(updateData.finishDate)
      : game.finishDate;
    const currentAcquisitionDate = updateData.acquisitionDate
      ? new Date(updateData.acquisitionDate)
      : game.acquisitionDate;

    if (currentStatus === GameStatus.Playing) {
      finalFinishDate = null;
    } else if (
      currentStatus === GameStatus.Done ||
      currentStatus === GameStatus.Abandoned
    ) {
      if (updateData.finishDate === undefined && game.finishDate === null) {
        throw new Error(
          'Finish date is required for Done or Abandoned status.',
        );
      }
      if (finalFinishDate && finalFinishDate < currentAcquisitionDate) {
        throw new Error('Finish date cannot be earlier than acquisition date.');
      }
    }

    const updatedGame = await this.prisma.game.update({
      where: { id: gameId },
      data: {
        ...updateData,
        acquisitionDate: updateData.acquisitionDate
          ? new Date(updateData.acquisitionDate)
          : undefined,
        finishDate: finalFinishDate,
        platformId:
          updateData.platformId === null
            ? null
            : updateData.platformId ?? undefined,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        title: true,
        description: true,
        imageUrl: true,
        acquisitionDate: true,
        finishDate: true,
        status: true,
        isFavorite: true,
        createdAt: true,
        updatedAt: true,
        category: { select: { id: true, name: true } },
        platform: { select: { id: true, title: true } },
      },
    });
    return updatedGame as GameResponse;
  }

  async deleteGame(userId: number, gameId: number): Promise<void> {
    const game = await this.prisma.game.findFirst({
      where: { id: gameId, userId, isDeleted: false },
    });

    if (!game) {
      throw new Error('Game not found or access denied.');
    }

    await this.prisma.game.update({
      where: { id: gameId },
      data: { isDeleted: true, updatedAt: new Date() },
    });
  }
}
