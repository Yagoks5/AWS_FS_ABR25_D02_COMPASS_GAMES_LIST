import { Router } from 'express';
import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
  getAllCategories,
} from '../controllers/categoryController';
import { authenticateJWT } from '../middleware/auth.middleware';
import {
  validateCategoryData,
  validateCategoryUpdateData,
} from '../middleware/validation.middleware';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.use(authenticateJWT);

router.get('/', asyncHandler(getCategories));

router.get('/all', asyncHandler(getAllCategories));

router.get('/:id', asyncHandler(getCategoryById));

router.post('/', validateCategoryData, asyncHandler(createCategory));

router.put('/:id', validateCategoryUpdateData, asyncHandler(updateCategory));

router.delete('/:id', asyncHandler(deleteCategory));

export default router;
