import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { openDataService } from '../services/openDataService';

export const useOpenDataCatalogue = () => useQuery({
  queryKey: ['openDataCatalogue'],
  queryFn: () => openDataService.getOpenDataCatalogue()
});

export const usePublishOpenData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (datasetId) => openDataService.publishOpenDataDatasetDemo(datasetId),
    onSuccess: () => queryClient.invalidateQueries(['openDataCatalogue'])
  });
};
