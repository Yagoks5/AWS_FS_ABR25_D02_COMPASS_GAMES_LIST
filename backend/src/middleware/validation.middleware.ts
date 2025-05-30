import { Request, Response, NextFunction } from 'express';

export const validateCategoryData = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { name } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length < 3) {
    res.status(400).json({
      success: false,
      message:
        'Category name is required and must be at least 3 characters long.',
    });
    return;
  }

  req.body.name = name.trim();
  if (req.body.description) {
    req.body.description = req.body.description.trim();
  }

  next();
};

export const validatePlatformData = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { title } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    res.status(400).json({
      success: false,
      message:
        'Platform title is required and must be at least 3 characters long.',
    });
    return;
  }

  req.body.title = title.trim();
  if (req.body.company) {
    req.body.company = req.body.company.trim();
  }

  next();
};

export const validateGameData = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { title, categoryId, status, acquisitionDate } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    res.status(400).json({
      success: false,
      message: 'Game title is required and must be at least 3 characters long.',
    });
    return;
  }

  if (!categoryId || typeof categoryId !== 'number') {
    res.status(400).json({
      success: false,
      message: 'Category ID is required and must be a number.',
    });
    return;
  }

  if (!status || !['Playing', 'Done', 'Abandoned'].includes(status)) {
    res.status(400).json({
      success: false,
      message: 'Status is required and must be Playing, Done, or Abandoned.',
    });
    return;
  }

  if (!acquisitionDate) {
    res.status(400).json({
      success: false,
      message: 'Acquisition date is required.',
    });
    return;
  }

  next();
};
