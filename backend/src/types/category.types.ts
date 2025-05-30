export interface Category {
  id: number;
  name: string;
  descripton?: string;
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
  descripton?: string;
}

export interface CategoryResponse {
  id: number;
  name: string;
  descripton?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryWithGameCount extends CategoryResponse {
  _count: {
    games: number;
  };
}
