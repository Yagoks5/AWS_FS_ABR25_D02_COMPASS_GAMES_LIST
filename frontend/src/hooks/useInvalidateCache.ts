import { useQueryClient } from '@tanstack/react-query';

export const useInvalidateCache = () => {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ['dashboard'] });
  };

  const invalidatePlatforms = () => {
    queryClient.invalidateQueries({ queryKey: ['platforms'] });
  };

  return {
    invalidateAll,
    invalidatePlatforms,
  };
};
