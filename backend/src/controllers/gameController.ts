import { Request, Response, NextFunction } from 'express';
import { GameService } from '../services/game.service';
import {
  CreateGameData,
  UpdateGameData,
  GameFilters,
  GameStatus,
} from '../types/game.types';

const gameService = new GameService();

export const createGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }
    const gameData: CreateGameData = req.body;
    const game = await gameService.createGame(userId, gameData);
    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: game,
    });
  } catch (error) {
    console.error('Create game error:', error);
    if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
};

export const getGames = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }
    const { page, limit, search, categoryId, platformId, status, isFavorite } =
      req.query;

    const filters: GameFilters = {
      search: search as string | undefined,
      categoryId: categoryId ? parseInt(categoryId as string, 10) : undefined,
      platformId: platformId ? parseInt(platformId as string, 10) : undefined,
      status: status as GameStatus | undefined,
      isFavorite: isFavorite !== undefined ? isFavorite === 'true' : undefined,
    };

    if (filters.categoryId && isNaN(filters.categoryId))
      delete filters.categoryId;
    if (filters.platformId && isNaN(filters.platformId))
      delete filters.platformId;

    const result = await gameService.getGamesPaginated(
      userId,
      filters,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
    res.status(200).json({
      success: true,
      message: 'Games retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Get games error:', error);
    next(error);
  }
};

export const getGameById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
      return;
    }
    const gameId = parseInt(req.params.id, 10);
    if (isNaN(gameId)) {
      res.status(400).json({ success: false, message: 'Invalid game ID' });
      return;
    }
    const game = await gameService.getGameById(userId, gameId);
    res.status(200).json({
      success: true,
      message: 'Game retrieved successfully',
      data: game,
    });
  } catch (error) {
    console.error('Get game by ID error:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      next(error);
    }
  }
};

export const updateGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: 'User not authenticated' });
      return;
    }
    const gameId = parseInt(req.params.id, 10);
    if (isNaN(gameId)) {
      res.status(400).json({ success: false, message: 'Invalid game ID' });
      return;
    }
    const updateData: UpdateGameData = req.body;
    const game = await gameService.updateGame(userId, gameId, updateData);
    res.status(200).json({
      success: true,
      message: 'Game updated successfully',
      data: game,
    });
  } catch (error) {
    console.error('Update game error:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      next(error);
    }
  }
};

export const deleteGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user.userId;
    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: 'User not authenticated' });
      return;
    }
    const gameId = parseInt(req.params.id, 10);
    if (isNaN(gameId)) {
      res.status(400).json({ success: false, message: 'Invalid game ID' });
      return;
    }
    await gameService.deleteGame(userId, gameId);
    res.status(200).json({
      success: true,
      message: 'Game deleted successfully',
    });
  } catch (error) {
    console.error('Delete game error:', error);
    if (error instanceof Error && error.message.includes('not found')) {
      res.status(404).json({ success: false, message: error.message });
    } else if (error instanceof Error) {
      res.status(400).json({ success: false, message: error.message });
    } else {
      next(error);
    }
  }
};
