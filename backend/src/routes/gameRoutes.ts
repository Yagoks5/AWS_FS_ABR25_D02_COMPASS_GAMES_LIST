import { Router } from 'express';
import {
  createGame,
  getGames,
  getGameById,
  updateGame,
  deleteGame,
} from '../controllers/gameController';
import { authenticateJWT } from '../middleware/auth.middleware';
import {
  validateGameData,
  validateGameUpdateData,
} from '../middleware/validation.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticateJWT);

router.post('/', validateGameData, asyncHandler(createGame));
router.get('/', asyncHandler(getGames));
router.get('/:id', asyncHandler(getGameById));
router.put('/:id', validateGameUpdateData, asyncHandler(updateGame));
router.delete('/:id', asyncHandler(deleteGame));

export default router;
