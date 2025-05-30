import { getCurrentUser } from '../controllers/userController';
import { authenticateJWT } from '../middleware/auth.middleware';
import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';

const router = Router();

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

router.get('/me', authenticateJWT, asyncHandler(getCurrentUser));

export default router;
