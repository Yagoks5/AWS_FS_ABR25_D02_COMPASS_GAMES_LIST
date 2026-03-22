import { Request, Response, NextFunction } from 'express';
import { userService } from '../services';
import { requireAuthenticatedUserId } from '../utils/request.utils';

export const getCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = requireAuthenticatedUserId(req);
    const user = await userService.getCurrentUser(userId);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
