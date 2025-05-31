export interface Category {
  id: number;
  name: string;
  description?: string | null;
  userId: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategoryData {
  name: string;
  description?: string;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string | null;
}

export interface CategoryResponse {
  id: number;
  name: string;
  description?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithGameCount extends CategoryResponse {
  _count: {
    games: number;
  };
}
