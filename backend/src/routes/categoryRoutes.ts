import {
  Router,
  Request,
  Response,
  NextFunction,
  RequestHandler,
} from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategories,
} from '../controllers/categoryController';
import { authenticateJWT } from '../middleware/auth.middleware';
import { validateCategoryData } from '../middleware/validation.middleware';

const router = Router();

const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

router.use(authenticateJWT);

router.get('/', asyncHandler(getCategories));

router.get('/all', asyncHandler(getAllCategories));

router.get('/:id', asyncHandler(getCategoryById));

router.post('/', validateCategoryData, asyncHandler(createCategory));

router.put('/:id', validateCategoryData, asyncHandler(updateCategory));

router.delete('/:id', asyncHandler(deleteCategory));

export default router;
