import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  console.error('Error occurred:', error);

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
