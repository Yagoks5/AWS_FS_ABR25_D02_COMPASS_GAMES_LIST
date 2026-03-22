import { Request, Response, NextFunction } from 'express';
import { platformService } from '../services';
import {
  requireAuthenticatedUserId,
  parseIdParam,
  parseOptionalPositiveIntQueryParam,
} from '../utils/request.utils';
import {
  CreatePlatformData,
  UpdatePlatformData,
} from '../types/platform.types';
import logger from '../lib/logger';

export const createPlatform = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const platformData: CreatePlatformData = req.body;

    const platform = await platformService.createPlatform(userId, platformData);

    res.status(201).json({
      success: true,
      message: 'Platform created successfully',
      data: platform,
    });
  } catch (error) {
    next(error);
  }
};

export const getPlatforms = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const { page, limit } = req.query;
    const parsedPage = parseOptionalPositiveIntQueryParam(page, 'page');
    const parsedLimit = parseOptionalPositiveIntQueryParam(limit, 'limit');

    const result = await platformService.getPlatformsPaginated(
      userId,
      parsedPage,
      parsedLimit,
    );

    res.status(200).json({
      success: true,
      message: 'Platforms retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error({ err: error }, 'Get platforms failed');
    next(error);
  }
};

export const getPlatformById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const platformId = parseIdParam(req.params.id, 'platform');

    const platform = await platformService.getPlatformById(userId, platformId);

    res.status(200).json({
      success: true,
      message: 'Platform retrieved successfully',
      data: platform,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePlatform = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const platformId = parseIdParam(req.params.id, 'platform');
    const updateData: UpdatePlatformData = req.body;

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
    next(error);
  }
};

export const deletePlatform = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const platformId = parseIdParam(req.params.id, 'platform');

    await platformService.deletePlatform(userId, platformId);

    res.status(200).json({
      success: true,
      message: 'Platform deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPlatforms = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);

    const platforms = await platformService.getAllPlatformsForUser(userId);

    res.status(200).json({
      success: true,
      message: 'All platforms retrieved successfully',
      data: platforms,
    });
  } catch (error) {
    next(error);
  }
};
