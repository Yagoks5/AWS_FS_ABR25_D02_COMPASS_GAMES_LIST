import api from './api';

export interface DashboardStats {
  totalGames: number;
  totalCategories: number;
  totalPlatforms: number;
  totalFavorites: number;
}

export interface GameByStatus {
  [status: string]: number;
}

export interface RecentGame {
  id: number;
  title: string;
  status: string;
  isFavorite: boolean;
  createdAt: string;
  category: {
    id: number;
    name: string;
  };
  platform?: {
    id: number;
    title: string;
  } | null;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get('/dashboard/stats');
    return response.data.data.stats;
  },

  getGamesByStatus: async (): Promise<GameByStatus> => {
    const response = await api.get('/dashboard/games-by-status');
    return response.data.data;
  },

  getRecentGames: async (limit = 5): Promise<RecentGame[]> => {
    const response = await api.get(`/dashboard/recent-games?limit=${limit}`);
    return response.data.data;
  },
};
