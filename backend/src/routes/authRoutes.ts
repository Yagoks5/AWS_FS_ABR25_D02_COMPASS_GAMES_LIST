import { Router } from 'express';
import { register, login } from '../controllers/authController';
import { Request, Response, NextFunction } from 'express';

const router = Router();

const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));

export default router;
