import { Request, Response, NextFunction } from 'express';
import { PlatformService } from '../services/platform.service';
import {
  CreatePlatformData,
  UpdatePlatformData,
} from '../types/platform.types';

const platformService = new PlatformService();

export const createPlatform = async (
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
    const platformData: CreatePlatformData = req.body;

    const platform = await platformService.createPlatform(userId, platformData);

    res.status(201).json({
      success: true,
      message: 'Platform created successfully',
      data: platform,
    });
  } catch (error) {
    console.error('Create platform error:', error);

    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

export const getPlatforms = async (
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
    const { page, limit } = req.query;

    const result = await platformService.getPlatformsPaginated(
      userId,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );

    res.status(200).json({
      success: true,
      message: 'Platforms retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Get platforms error:', error);
    next(error);
  }
};

export const getPlatformById = async (
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
    const platformId = parseInt(req.params.id, 10);

    if (isNaN(platformId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid platform ID',
      });
      return;
    }

    const platform = await platformService.getPlatformById(userId, platformId);

    res.status(200).json({
      success: true,
      message: 'Platform retrieved successfully',
      data: platform,
    });
  } catch (error) {
    console.error('Get platform by ID error:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

export const updatePlatform = async (
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
    const platformId = parseInt(req.params.id, 10);
    const updateData: UpdatePlatformData = req.body;

    if (isNaN(platformId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid platform ID',
      });
      return;
    }

    const platform = await platformService.updatePlatform(
      userId,
      platformId,
      updateData,
    );

    res.status(200).json({
      success: true,
      message: 'Platform updated successfully',
      data: platform,
    });
  } catch (error) {
    console.error('Update platform error:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

export const deletePlatform = async (
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

    const platformId = parseInt(req.params.id, 10);

    if (isNaN(platformId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid platform ID',
      });
      return;
    }

    await platformService.deletePlatform(userId, platformId);

    res.status(200).json({
      success: true,
      message: 'Platform deleted successfully',
    });
  } catch (error) {
    console.error('Delete platform error:', error);

    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        res.status(404).json({
          success: false,
          message: error.message,
        });
        return;
      }
      res.status(400).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
};

export const getAllPlatforms = async (
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

    const platforms = await platformService.getAllPlatformsForUser(userId);

    res.status(200).json({
      success: true,
      message: 'All platforms retrieved successfully',
      data: platforms,
    });
  } catch (error) {
    console.error('Get all platforms error:', error);
    next(error);
  }
};
