import { Router } from 'express';
import {
  getDashboardStats,
  getGamesByStatus,
  getRecentGames,
} from '../controllers/dashboardController';
import { authenticateJWT } from '../middleware/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticateJWT);

router.get('/stats', asyncHandler(getDashboardStats));
router.get('/games-by-status', asyncHandler(getGamesByStatus));
router.get('/recent-games', asyncHandler(getRecentGames));

export default router;
