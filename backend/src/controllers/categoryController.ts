import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services';
import {
  requireAuthenticatedUserId,
  parseIdParam,
  parseOptionalPositiveIntQueryParam,
} from '../utils/request.utils';
import {
  CreateCategoryData,
  UpdateCategoryData,
} from '../types/category.types';
import logger from '../lib/logger';

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const categoryData: CreateCategoryData = req.body;

    const category = await categoryService.createCategory(userId, categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const { page, limit } = req.query;
    const parsedPage = parseOptionalPositiveIntQueryParam(page, 'page');
    const parsedLimit = parseOptionalPositiveIntQueryParam(limit, 'limit');

    const result = await categoryService.getCategoriesPaginated(
      userId,
      parsedPage,
      parsedLimit,
    );

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    logger.error({ err: error }, 'Get categories failed');
    next(error);
  }
};

export const getCategoryById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const categoryId = parseIdParam(req.params.id, 'category');

    const category = await categoryService.getCategoryById(userId, categoryId);

    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const categoryId = parseIdParam(req.params.id, 'category');
    const updateData: UpdateCategoryData = req.body;

    const category = await categoryService.updateCategory(
      userId,
      categoryId,
      updateData,
    );

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const categoryId = parseIdParam(req.params.id, 'category');

    await categoryService.deleteCategory(userId, categoryId);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getAllCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);

    const categories = await categoryService.getAllCategoriesForUser(userId);

    res.status(200).json({
      success: true,
      message: 'All categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
