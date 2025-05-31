import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import {
  getDashboardStats,
  getGamesByStatus,
  getRecentGames,
} from '../controllers/dashboardController';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

router.use(authenticateJWT);

router.get('/stats', asyncHandler(getDashboardStats));
router.get('/games-by-status', asyncHandler(getGamesByStatus));
router.get('/recent-games', asyncHandler(getRecentGames));

export default router;
