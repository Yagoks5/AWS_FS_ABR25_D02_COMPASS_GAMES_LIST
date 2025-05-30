export interface DashboardStats {
  totalGames: number;
  totalCategories: number;
  totalPlatforms: number;
  totalFavorites: number;
}

export interface DashboardResponse {
  stats: DashboardStats;
}
