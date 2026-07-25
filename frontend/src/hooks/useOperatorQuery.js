import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { tokenService } from '../services/tokenService';
import { operatorService } from '../services/operatorService';
import { useAuth } from './useAuth';

export const useCentreQueue = (centreId) => {
  return useQuery({
    queryKey: ['centreQueue', centreId],
    queryFn: () => tokenService.getCentreQueue(centreId),
    enabled: !!centreId
  });
};

export const useCallToken = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (tokenId) => tokenService.callToken(tokenId, user.id),
    onSuccess: (data) => queryClient.invalidateQueries(['centreQueue', data.centreId])
  });
};

export const useStartVisit = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ tokenId, citizenId, centreId }) => operatorService.startVisit(user.id, tokenId, citizenId, centreId),
    onSuccess: (data) => queryClient.invalidateQueries(['centreQueue', data.centreId])
  });
};

export const useCompleteVisit = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ visitId, summary }) => operatorService.completeVisit(visitId, summary)
  });
};
