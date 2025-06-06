import api from './api';

export interface Game {
  id: number;
  title: string;
  description?: string | null;
  imageUrl?: string | null;
  acquisitionDate: string;
  finishDate?: string | null;
  status: GameStatus;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  };
  platform?: {
    id: number;
    title: string;
  } | null;
}

export const GameStatus = {
  PLAYING: 'Playing',
  DONE: 'Done',
  ABANDONED: 'Abandoned',
} as const;

export type GameStatus = typeof GameStatus[keyof typeof GameStatus];

export interface GameFormData {
  title: string;
  description?: string;
  imageUrl?: string;
  acquisitionDate: string;
  finishDate?: string;
  status: GameStatus;
  categoryId: number;
  platformId?: number | null;
  isFavorite?: boolean;
}

export interface GameFilters {
  search?: string;
  categoryId?: number;
  platformId?: number;
  status?: GameStatus;
  isFavorite?: boolean;
}

export interface PaginatedGamesResponse {
  success: boolean;
  message: string;
  data: Game[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    limit: number;
  };
}

export interface GameResponse {
  success: boolean;
  message: string;
  data: Game;
}

export const gameAPI = {
  getGames: async (page?: number, limit?: number, filters?: GameFilters): Promise<PaginatedGamesResponse> => {
    const params = new URLSearchParams();
    if (page !== undefined) params.append('page', page.toString());
    if (limit !== undefined) params.append('limit', limit.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters?.platformId) params.append('platformId', filters.platformId.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.isFavorite !== undefined) params.append('isFavorite', filters.isFavorite.toString());
    
    const response = await api.get(`/games?${params.toString()}`);
    return response.data;
  },

  getAllGames: async (filters?: GameFilters): Promise<{ success: boolean; data: Game[] }> => {
    const params = new URLSearchParams();
    params.append('limit', '1000');
    
    if (filters?.search) params.append('search', filters.search);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters?.platformId) params.append('platformId', filters.platformId.toString());
    if (filters?.status) params.append('status', filters.status);
    if (filters?.isFavorite !== undefined) params.append('isFavorite', filters.isFavorite.toString());
    
    const response = await api.get(`/games?${params.toString()}`);    return response.data;
  },

  getGameById: async (id: number): Promise<GameResponse> => {
    const response = await api.get(`/games/${id}`);
    return response.data;
  },

  createGame: async (gameData: GameFormData): Promise<GameResponse> => {
    const response = await api.post('/games', gameData);
    return response.data;
  },

  updateGame: async (id: number, gameData: Partial<GameFormData>): Promise<GameResponse> => {
    const response = await api.put(`/games/${id}`, gameData);
    return response.data;
  },

  deleteGame: async (id: number): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/games/${id}`);
    return response.data;
  },

  toggleFavorite: async (id: number, isFavorite: boolean): Promise<GameResponse> => {
    const response = await api.put(`/games/${id}`, { isFavorite });
    return response.data;
  },
};
