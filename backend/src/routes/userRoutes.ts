import { getCurrentUser } from '../controllers/userController';
import { authenticateJWT } from '../middleware/auth.middleware';
import { Router } from 'express';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get('/me', authenticateJWT, asyncHandler(getCurrentUser));

export default router;
