import { PrismaClient } from '../generated/prisma';
import {
  Category,
  CreateCategoryData,
  UpdateCategoryData,
  CategoryResponse,
  CategoryWithGameCount,
} from '../types/category.types';
import {
  PaginationResult,
  getPaginationParams,
  createPaginationResult,
} from '../utils/pagination.utils';

export class CategoryService {
  private prisma = new PrismaClient();

  async createCategory(
    userId: number,
    categoryData: CreateCategoryData,
  ): Promise<CategoryResponse> {
    const userCategories = await this.prisma.category.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      select: {
        name: true,
      },
    });

    const nameExists = userCategories.some(
      (category) =>
        category.name.toLowerCase() === categoryData.name.toLowerCase(),
    );

    if (nameExists) {
      throw new Error('A category with this name already exists.');
    }

    const category = await this.prisma.category.create({
      data: {
        name: categoryData.name,
        description: categoryData.description,
        userId,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return category;
  }

  async getCategoriesPaginated(
    userId: number,
    page?: number,
    limit?: number,
  ): Promise<PaginationResult<CategoryWithGameCount>> {
    const {
      skip,
      take,
      page: currentPage,
      limit: currentLimit,
    } = getPaginationParams(page, limit || 15);

    const [categories, totalItems] = await Promise.all([
      this.prisma.category.findMany({
        where: {
          userId,
          isDeleted: false,
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              games: {
                where: {
                  isDeleted: false,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take,
      }),
      this.prisma.category.count({
        where: {
          userId,
          isDeleted: false,
        },
      }),
    ]);

    return createPaginationResult(
      categories,
      totalItems,
      currentPage,
      currentLimit,
    );
  }

  async getCategoryById(
    userId: number,
    categoryId: number,
  ): Promise<CategoryWithGameCount> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            games: {
              where: {
                isDeleted: false,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new Error('Category not found.');
    }

    return category;
  }

  async updateCategory(
    userId: number,
    categoryId: number,
    updateData: UpdateCategoryData,
  ): Promise<CategoryResponse> {
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
        isDeleted: false,
      },
    });

    if (!existingCategory) {
      throw new Error('Category not found.');
    }

    if (updateData.name && updateData.name !== existingCategory.name) {
      const otherCategories = await this.prisma.category.findMany({
        where: {
          userId,
          isDeleted: false,
          id: {
            not: categoryId,
          },
        },
        select: {
          name: true,
        },
      });

      const nameExists = otherCategories.some(
        (category) =>
          category.name.toLowerCase() === updateData.name!.toLowerCase(),
      );

      if (nameExists) {
        throw new Error('A category with this name already exists.');
      }
    }

    const updatedCategory = await this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedCategory;
  }

  async deleteCategory(userId: number, categoryId: number): Promise<void> {
    const category = await this.prisma.category.findFirst({
      where: {
        id: categoryId,
        userId,
        isDeleted: false,
      },
      include: {
        _count: {
          select: {
            games: {
              where: {
                isDeleted: false,
              },
            },
          },
        },
      },
    });

    if (!category) {
      throw new Error('Category not found.');
    }

    if (category._count.games > 0) {
      throw new Error(
        'Cannot delete category that has games associated with it.',
      );
    }

    await this.prisma.category.update({
      where: {
        id: categoryId,
      },
      data: {
        isDeleted: true,
        updatedAt: new Date(),
      },
    });
  }
  async getAllCategoriesForUser(userId: number): Promise<CategoryWithGameCount[]> {
    const categories = await this.prisma.category.findMany({
      where: {
        userId,
        isDeleted: false,
      },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            games: {
              where: {
                isDeleted: false,
              },
            },
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    return categories;
  }
}
