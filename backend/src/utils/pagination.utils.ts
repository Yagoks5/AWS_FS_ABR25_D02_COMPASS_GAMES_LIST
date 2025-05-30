export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export function getPaginationParams(
  page?: number | string,
  limit?: number | string,
): { skip: number; take: number; page: number; limit: number } {
  const pageNum = page ? Math.max(1, parseInt(page.toString(), 10)) : 1;
  const limitNum = limit ? Math.max(1, parseInt(limit.toString(), 10)) : 10;

  return {
    skip: (pageNum - 1) * limitNum,
    take: limitNum,
    page: pageNum,
    limit: limitNum,
  };
}

export function createPaginationResult<T>(
  data: T[],
  totalItems: number,
  page: number,
  limit: number,
): PaginationResult<T> {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    data,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}
