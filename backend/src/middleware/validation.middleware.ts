import { Request, Response, NextFunction } from 'express';
import { GameStatus } from '../types/game.types';

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
  const { title, categoryId, status, acquisitionDate, finishDate } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length < 3) {
    res.status(400).json({
      success: false,
      message: 'Game title is required and must be at least 3 characters long.',
    });
    return;
  }
  req.body.title = title.trim();

  if (categoryId === undefined || typeof categoryId !== 'number') {
    res.status(400).json({
      success: false,
      message: 'Category ID is required and must be a number.',
    });
    return;
  }

  if (!status || !Object.values(GameStatus).includes(status as GameStatus)) {
    res.status(400).json({
      success: false,
      message: `Status is required and must be one of: ${Object.values(
        GameStatus,
      ).join(', ')}.`,
    });
    return;
  }

  const now = new Date();

  if (!acquisitionDate) {
    res.status(400).json({
      success: false,
      message: 'Acquisition date is required.',
    });
    return;
  }
  const acquisitionDateObj = new Date(acquisitionDate);
  if (isNaN(acquisitionDateObj.getTime())) {
    res.status(400).json({
      success: false,
      message: 'Invalid acquisition date format.',
    });
    return;
  }
  if (acquisitionDateObj > now) {
    res.status(400).json({
      success: false,
      message: 'Acquisition date cannot be in the future.',
    });
    return;
  }
  req.body.acquisitionDate = acquisitionDateObj;

  if (status === GameStatus.DONE || status === GameStatus.ABANDONED) {
    if (!finishDate) {
      res.status(400).json({
        success: false,
        message: 'Finish date is required when status is Done or Abandoned.',
      });
      return;
    }
    const finishDateObj = new Date(finishDate);
    if (isNaN(finishDateObj.getTime())) {
      res.status(400).json({
        success: false,
        message: 'Invalid finish date format.',
      });
      return;
    }
    if (finishDateObj < acquisitionDateObj) {
      res.status(400).json({
        success: false,
        message: 'Finish date cannot be earlier than acquisition date.',
      });
      return;
    }
    if (finishDateObj > now) {
      res.status(400).json({
        success: false,
        message: 'Finish date cannot be in the future.',
      });
      return;
    }
    req.body.finishDate = finishDateObj;
  } else {
    if (finishDate) {
      res.status(400).json({
        success: false,
        message:
          'Finish date should only be provided if status is Done or Abandoned.',
      });
      return;
    }
    req.body.finishDate = null;
  }

  if (req.body.description && typeof req.body.description === 'string') {
    req.body.description = req.body.description.trim();
  }
  if (req.body.imageUrl && typeof req.body.imageUrl === 'string') {
    req.body.imageUrl = req.body.imageUrl.trim();
  }

  next();
};

export const validateGameUpdateData = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { title, categoryId, status, acquisitionDate, finishDate } = req.body;

  if (title !== undefined) {
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      res.status(400).json({
        success: false,
        message: 'Game title must be at least 3 characters long.',
      });
      return;
    }
    req.body.title = title.trim();
  }

  if (categoryId !== undefined && typeof categoryId !== 'number') {
    res.status(400).json({
      success: false,
      message: 'Category ID must be a number.',
    });
    return;
  }

  if (
    status !== undefined &&
    !Object.values(GameStatus).includes(status as GameStatus)
  ) {
    res.status(400).json({
      success: false,
      message: `Status must be one of: ${Object.values(GameStatus).join(
        ', ',
      )}.`,
    });
    return;
  }

  if (acquisitionDate !== undefined) {
    if (isNaN(new Date(acquisitionDate).getTime())) {
      res.status(400).json({
        success: false,
        message: 'Invalid acquisition date format.',
      });
      return;
    }
    req.body.acquisitionDate = new Date(acquisitionDate);
  }

  if (status !== undefined) {
    if (status === GameStatus.DONE || status === GameStatus.ABANDONED) {
      if (!finishDate) {
        res.status(400).json({
          success: false,
          message: 'Finish date is required when status is Done or Abandoned.',
        });
        return;
      }
      if (isNaN(new Date(finishDate).getTime())) {
        res.status(400).json({
          success: false,
          message: 'Invalid finish date format.',
        });
        return;
      }
      req.body.finishDate = new Date(finishDate);

      if (
        req.body.acquisitionDate &&
        req.body.finishDate < req.body.acquisitionDate
      ) {
        res.status(400).json({
          success: false,
          message: 'Finish date cannot be earlier than acquisition date.',
        });
        return;
      }
    } else if (status === GameStatus.PLAYING) {
      req.body.finishDate = null;
    }
  }

  if (finishDate !== undefined && status === undefined) {
    if (finishDate && isNaN(new Date(finishDate).getTime())) {
      res.status(400).json({
        success: false,
        message: 'Invalid finish date format.',
      });
      return;
    }
    if (finishDate) {
      req.body.finishDate = new Date(finishDate);
    }
  }

  if (req.body.description && typeof req.body.description === 'string') {
    req.body.description = req.body.description.trim();
  }
  if (req.body.imageUrl && typeof req.body.imageUrl === 'string') {
    req.body.imageUrl = req.body.imageUrl.trim();
  }

  next();
};
