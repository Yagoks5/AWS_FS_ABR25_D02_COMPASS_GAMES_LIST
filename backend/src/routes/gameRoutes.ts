import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
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

const router = Router();

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

router.use(authenticateJWT);

router.post('/', validateGameData, asyncHandler(createGame));
router.get('/', asyncHandler(getGames));
router.get('/:id', asyncHandler(getGameById));
router.put('/:id', validateGameUpdateData, asyncHandler(updateGame));
router.delete('/:id', asyncHandler(deleteGame));

export default router;
