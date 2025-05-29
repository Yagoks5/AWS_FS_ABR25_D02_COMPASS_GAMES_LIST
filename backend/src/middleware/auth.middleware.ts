import { Request, Response, NextFunction } from 'express';
import { extractBasicAuthCredentials } from '../utils/auth.utils';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const credentials = extractBasicAuthCredentials(req);

    if (!credentials) {
      res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
      return;
    }

    const { email, password } = credentials;
    const user = await authService.authenticateUser(email, password);

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
    });
  }
};
