import { useQuery } from '@tanstack/react-query';
import { analyticsDashboardService } from '../services/analyticsDashboardService';

export const useExecutiveDashboard = (filters) => {
  return useQuery({
    queryKey: ['executiveDashboard', filters],
    queryFn: () => analyticsDashboardService.getExecutiveDashboard(filters)
  });
};

export const useDepartmentDashboard = (departmentId, filters) => {
  return useQuery({
    queryKey: ['departmentDashboard', departmentId, filters],
    queryFn: () => analyticsDashboardService.getDepartmentDashboard(departmentId, filters),
    enabled: !!departmentId
  });
};
