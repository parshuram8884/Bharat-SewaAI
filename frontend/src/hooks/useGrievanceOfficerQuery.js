import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { grievanceOfficerService } from '../services/grievanceOfficerService';
import { useAuth } from '../hooks/useAuth';

export const useGrievanceQueue = (filters = {}) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['grievanceQueue', user?.id, filters],
    queryFn: () => grievanceOfficerService.getGrievanceQueue(user, filters),
    enabled: !!user
  });
};

export const useOfficerGrievance = (id) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['officerGrievance', id],
    queryFn: () => grievanceOfficerService.getOfficerGrievance(user, id),
    enabled: !!user && !!id
  });
};

export const useAssignGrievance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (grievanceId) => grievanceOfficerService.assignGrievance(user, grievanceId, user.id, user.name),
    onSuccess: (_, grievanceId) => {
      queryClient.invalidateQueries({ queryKey: ['grievanceQueue'] });
      queryClient.invalidateQueries({ queryKey: ['officerGrievance', grievanceId] });
      queryClient.invalidateQueries({ queryKey: ['grievanceAudit'] });
    }
  });
};

export const useProposeResolution = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ grievanceId, resolutionData }) => grievanceOfficerService.proposeResolution(user, grievanceId, resolutionData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['officerGrievance', variables.grievanceId] });
      queryClient.invalidateQueries({ queryKey: ['grievanceQueue'] });
    }
  });
};

export const useApproveResolution = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ grievanceId, resolutionId }) => grievanceOfficerService.approveResolution(user, grievanceId, resolutionId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['officerGrievance', variables.grievanceId] });
      queryClient.invalidateQueries({ queryKey: ['grievanceQueue'] });
      queryClient.invalidateQueries({ queryKey: ['grievanceAudit'] });
    }
  });
};

export const useCreateClarificationRequest = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ grievanceId, requestData }) => grievanceOfficerService.createGrievanceClarificationRequest(user, grievanceId, requestData),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['officerGrievance', variables.grievanceId] });
      queryClient.invalidateQueries({ queryKey: ['grievanceRequests', variables.grievanceId] });
    }
  });
};
