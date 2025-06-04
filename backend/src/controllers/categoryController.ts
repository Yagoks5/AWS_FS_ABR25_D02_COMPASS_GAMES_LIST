import { Request, Response, NextFunction } from 'express';
import { CategoryService } from '../services/category.service';
import {
  CreateCategoryData,
  UpdateCategoryData,
} from '../types/category.types';

const categoryService = new CategoryService();

export const createCategory = async (
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
    const categoryData: CreateCategoryData = req.body;

    const category = await categoryService.createCategory(userId, categoryData);

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Create category error:', error);

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

export const getCategories = async (
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

    const result = await categoryService.getCategoriesPaginated(
      userId,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );

    res.status(200).json({
      success: true,
      message: 'Categories retrieved successfully',
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('Get categories error:', error);
    next(error);
  }
};

export const getCategoryById = async (
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
    const categoryId = parseInt(req.params.id, 10);

    if (isNaN(categoryId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      });
      return;
    }

    const category = await categoryService.getCategoryById(userId, categoryId);

    res.status(200).json({
      success: true,
      message: 'Category retrieved successfully',
      data: category,
    });
  } catch (error) {
    console.error('Get category by ID error:', error);

    if (error instanceof Error) {
      res.status(404).json({
        success: false,
        message: error.message,
      });
      return;
    }

    next(error);
  }
};

export const updateCategory = async (
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
    const categoryId = parseInt(req.params.id, 10);
    const updateData: UpdateCategoryData = req.body;

    if (isNaN(categoryId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      });
      return;
    }

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
    console.error('Update category error:', error);

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

export const deleteCategory = async (
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
    const categoryId = parseInt(req.params.id, 10);

    if (isNaN(categoryId)) {
      res.status(400).json({
        success: false,
        message: 'Invalid category ID',
      });
      return;
    }

    await categoryService.deleteCategory(userId, categoryId);

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Delete category error:', error);

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

export const getAllCategories = async (
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

    const categories = await categoryService.getAllCategoriesForUser(userId);

    res.status(200).json({
      success: true,
      message: 'All categories retrieved successfully',
      data: categories,
    });
  } catch (error) {
    console.error('Get all categories error:', error);
    next(error);
  }
};
