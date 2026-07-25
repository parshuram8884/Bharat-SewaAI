import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { analyticsReportService } from '../services/analyticsReportService';

export const useReports = () => useQuery({
  queryKey: ['analyticsReports'],
  queryFn: () => analyticsReportService.getReports()
});

export const useReportRuns = (reportId) => useQuery({
  queryKey: ['reportRuns', reportId],
  queryFn: () => analyticsReportService.getReportRunHistory(reportId),
  enabled: !!reportId
});

export const useRunReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reportId, user }) => analyticsReportService.runReport(reportId, user),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['reportRuns', data.reportId]);
      queryClient.invalidateQueries(['analyticsReports']); // In case lastRun info updates
    }
  });
};
