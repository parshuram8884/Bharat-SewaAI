import { useQuery } from '@tanstack/react-query';
import { dataQualityService } from '../services/dataQualityService';

export const useDataQualityIssues = () => useQuery({
  queryKey: ['dataQualityIssues'],
  queryFn: () => dataQualityService.getDataQualityIssues()
});
