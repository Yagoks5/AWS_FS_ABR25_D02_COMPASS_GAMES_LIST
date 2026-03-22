import { Router } from 'express';
import {
  createPlatform,
  getPlatforms,
  getPlatformById,
  updatePlatform,
  deletePlatform,
  getAllPlatforms,
} from '../controllers/platformController';
import { authenticateJWT } from '../middleware/auth.middleware';
import {
  validatePlatformData,
  validatePlatformUpdateData,
} from '../middleware/validation.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticateJWT);

router.get('/', asyncHandler(getPlatforms));

router.get('/all', asyncHandler(getAllPlatforms));

router.get('/:id', asyncHandler(getPlatformById));

router.post('/', validatePlatformData, asyncHandler(createPlatform));

router.put('/:id', validatePlatformUpdateData, asyncHandler(updatePlatform));

router.delete('/:id', asyncHandler(deletePlatform));

export default router;
