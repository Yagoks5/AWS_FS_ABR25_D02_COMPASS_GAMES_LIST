import api from './api';

export interface Category {
  id: number;
  name: string;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    games: number;
  };
}

export interface CategoryFormData {
  name: string;
  description?: string;
}

export interface PaginatedCategoriesResponse {
  success: boolean;
  message: string;
  data: Category[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

export interface CategoryResponse {
  success: boolean;
  message: string;
  data: Category;
}

export const categoryAPI = {
  getCategories: async (page?: number, limit?: number): Promise<PaginatedCategoriesResponse> => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    
    const response = await api.get(`/categories?${params.toString()}`);
    return response.data;
  },

  getAllCategories: async (): Promise<{ success: boolean; data: Category[] }> => {
    const response = await api.get('/categories/all');
    return response.data;
  },

  getCategoryById: async (id: number): Promise<CategoryResponse> => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },

  createCategory: async (categoryData: CategoryFormData): Promise<CategoryResponse> => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  updateCategory: async (id: number, categoryData: CategoryFormData): Promise<CategoryResponse> => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};
