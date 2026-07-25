import { useQuery } from '@tanstack/react-query';
import { cscAdminService } from '../services/cscAdminService';

export const useCscAnalytics = () => useQuery({
  queryKey: ['cscAnalytics'],
  queryFn: () => cscAdminService.getAllCentresAnalytics()
});
