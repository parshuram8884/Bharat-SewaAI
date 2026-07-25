import { useQuery } from '@tanstack/react-query';
import { documentAdminService } from '../services/documentAdminService';
import { useAuth } from './useAuth';

export const useDocumentAnalytics = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['documentAnalytics', user?.departmentId],
    queryFn: () => documentAdminService.getAnalytics(user),
    enabled: !!user && ['verification-manager', 'department-admin', 'super-admin'].includes(user.role)
  });
};
