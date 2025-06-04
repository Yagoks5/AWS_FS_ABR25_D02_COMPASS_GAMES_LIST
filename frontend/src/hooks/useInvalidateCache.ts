import { useQueryClient } from '@tanstack/react-query';

export const useInvalidateCache = () => {
  const queryClient = useQueryClient();

  const invalidateDashboard = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const invalidateGames = () => {
    queryClient.invalidateQueries({ queryKey: ['games'] });
    invalidateDashboard();
  };

  const invalidateCategories = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    invalidateDashboard();
  };

  const invalidatePlatforms = () => {
    queryClient.invalidateQueries({ queryKey: ['platforms'] });
    invalidateDashboard();
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['games'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    queryClient.invalidateQueries({ queryKey: ['platforms'] });
  };

  return {
    invalidateDashboard,
    invalidateGames,
    invalidateCategories,
    invalidatePlatforms,
    invalidateAll,
  };
};
