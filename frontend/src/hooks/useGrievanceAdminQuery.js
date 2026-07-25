import { useQuery } from '@tanstack/react-query';
import { grievanceAdminService } from '../services/grievanceAdminService';
import { useAuth } from '../hooks/useAuth';

export const useGrievanceAnalytics = (filters = {}) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['grievanceAnalytics', user?.id, filters],
    queryFn: () => grievanceAdminService.getGrievanceAnalytics(user, filters),
    enabled: !!user
  });
};

export const useGlobalGrievanceAudit = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['globalGrievanceAudit'],
    queryFn: () => grievanceAdminService.getGlobalGrievanceAudit(user),
    enabled: !!user
  });
};
