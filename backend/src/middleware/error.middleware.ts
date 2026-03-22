import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/appError';
import logger from '../lib/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (process.env.NODE_ENV !== 'production') {
    logger.error(
      {
        err: error,
        path: req.originalUrl,
        method: req.method,
      },
      'Unhandled request error',
    );
  } else {
    logger.error(
      {
        message: error.message,
        path: req.originalUrl,
        method: req.method,
      },
      'Request error',
    );
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    res.status(400).json({
      success: false,
      message: 'A record with these unique fields already exists.',
    });
    return;
  }

  if (error.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: error.message,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
