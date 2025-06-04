import { Request, Response, NextFunction } from 'express';
import { DashboardService } from '../services/dashboard.service';

const dashboardService = new DashboardService();

export const getDashboardStats = async (
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
    const dashboardData = await dashboardService.getDashboardStats(userId);

    res.status(200).json({
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: dashboardData,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    next(error);
  }
};

export const getGamesByStatus = async (
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
    const gamesByStatus = await dashboardService.getGamesByStatus(userId);

    res.status(200).json({
      success: true,
      message: 'Games by status retrieved successfully',
      data: gamesByStatus,
    });
  } catch (error) {
    console.error('Get games by status error:', error);
    next(error);
  }
};

export const getRecentGames = async (
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
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 5;
    const recentGames = await dashboardService.getRecentGames(userId, limit);

    res.status(200).json({
      success: true,
      message: 'Recent games retrieved successfully',
      data: recentGames,
    });
  } catch (error) {
    console.error('Get recent games error:', error);
    next(error);
  }
};
