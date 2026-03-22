import { Request, Response, NextFunction } from 'express';
import { gameService } from '../services';
import {
  requireAuthenticatedUserId,
  parseIdParam,
  parseOptionalPositiveIntQueryParam,
} from '../utils/request.utils';
import {
  CreateGameData,
  UpdateGameData,
  GameFilters,
  GameStatus,
} from '../types/game.types';
import logger from '../lib/logger';

export const createGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const gameData: CreateGameData = req.body;
    const game = await gameService.createGame(userId, gameData);
    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

export const getGames = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const { page, limit, search, categoryId, platformId, status, isFavorite } =
      req.query;

    const parsedCategoryId = parseOptionalPositiveIntQueryParam(
      categoryId,
      'categoryId',
    );
    const parsedPlatformId = parseOptionalPositiveIntQueryParam(
      platformId,
      'platformId',
    );
    const parsedPage = parseOptionalPositiveIntQueryParam(page, 'page');
    const parsedLimit = parseOptionalPositiveIntQueryParam(limit, 'limit');

    const filters: GameFilters = {
      search: search as string | undefined,
      categoryId: parsedCategoryId,
      platformId: parsedPlatformId,
      status: status as GameStatus | undefined,
      isFavorite: isFavorite !== undefined ? isFavorite === 'true' : undefined,
    };

    const result = await gameService.getGamesPaginated(
      userId,
      filters,
      parsedPage,
      parsedLimit,
    );
    res.status(200).json({
      success: true,
      message: 'Games retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error({ err: error }, 'Get games failed');
    next(error);
  }
};

export const getGameById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const gameId = parseIdParam(req.params.id, 'game');
    const game = await gameService.getGameById(userId, gameId);
    res.status(200).json({
      success: true,
      message: 'Game retrieved successfully',
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

export const updateGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const gameId = parseIdParam(req.params.id, 'game');
    const updateData: UpdateGameData = req.body;
    const game = await gameService.updateGame(userId, gameId, updateData);
    res.status(200).json({
      success: true,
      message: 'Game updated successfully',
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteGame = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const gameId = parseIdParam(req.params.id, 'game');
    await gameService.deleteGame(userId, gameId);
    res.status(200).json({
      success: true,
      message: 'Game deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
