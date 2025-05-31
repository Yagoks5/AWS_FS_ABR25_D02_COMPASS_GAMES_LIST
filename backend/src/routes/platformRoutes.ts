import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import {
  createPlatform,
  getPlatforms,
  getPlatformById,
  updatePlatform,
  deletePlatform,
  getAllPlatforms,
} from '../controllers/platformController';
import { authenticateJWT } from '../middleware/auth.middleware';
import { validatePlatformData } from '../middleware/validation.middleware';

const router = Router();

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

router.use(authenticateJWT);

router.get('/', asyncHandler(getPlatforms));

router.get('/all', asyncHandler(getAllPlatforms));

router.get('/:id', asyncHandler(getPlatformById));

router.post('/', validatePlatformData, asyncHandler(createPlatform));

router.put('/:id', validatePlatformData, asyncHandler(updatePlatform));

router.delete('/:id', asyncHandler(deletePlatform));

export default router;
