import { Request, Response, NextFunction } from 'express';
import { dashboardService } from '../services';
import {
  requireAuthenticatedUserId,
  parseOptionalPositiveIntQueryParam,
} from '../utils/request.utils';

const MAX_RECENT_GAMES_LIMIT = 100;

export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const dashboardData = await dashboardService.getDashboardStats(userId);

    res.status(200).json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: dashboardData,
    });
  } catch (error) {
    next(error);
  }
};

export const getGamesByStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const gamesByStatus = await dashboardService.getGamesByStatus(userId);

    res.status(200).json({
      success: true,
      message: 'Games by status retrieved successfully',
      data: gamesByStatus,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentGames = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const requestedLimit = parseOptionalPositiveIntQueryParam(
      req.query.limit,
      'limit',
    );

    const limit = Math.min(requestedLimit ?? 5, MAX_RECENT_GAMES_LIMIT);

    const recentGames = await dashboardService.getRecentGames(userId, limit);

    res.status(200).json({
      success: true,
      message: 'Recent games retrieved successfully',
      data: recentGames,
    });
  } catch (error) {
    next(error);
  }
};
