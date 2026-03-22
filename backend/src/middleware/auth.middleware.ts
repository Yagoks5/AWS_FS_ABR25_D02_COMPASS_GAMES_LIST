import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { verifyToken } from '../utils/jwt.utils';
import { UnauthorizedError } from '../utils/appError';

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next(new UnauthorizedError('Token required'));
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
    };
    next();
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      next(new UnauthorizedError('Token expired'));
      return;
    }

    if (error instanceof JsonWebTokenError) {
      next(new UnauthorizedError('Invalid token'));
      return;
    }

    next(error);
  }
};
