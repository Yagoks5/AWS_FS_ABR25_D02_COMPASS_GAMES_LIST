import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboardService';
import { useAuth } from '../contexts/AuthContext';

export const useDashboardStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['dashboard', 'stats', user?.id],
    queryFn: dashboardService.getStats,
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5,
  });
};
