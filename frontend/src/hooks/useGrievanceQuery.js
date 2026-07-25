import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { grievanceService } from '../services/grievanceService';
import { useAuth } from '../hooks/useAuth';

export const useCitizenGrievances = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['citizenGrievances', user?.id],
    queryFn: () => grievanceService.getCitizenGrievances(user),
    enabled: !!user && user.role === 'citizen'
  });
};

export const useGrievance = (id) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['grievance', id],
    queryFn: () => grievanceService.getGrievance(user, id),
    enabled: !!user && !!id
  });
};

export const useGrievanceTimeline = (id) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['grievanceTimeline', id],
    queryFn: () => grievanceService.getGrievanceTimeline(user, id),
    enabled: !!user && !!id
  });
};

export const useGrievanceRequests = (id) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['grievanceRequests', id],
    queryFn: () => grievanceService.getGrievanceRequests(user, id),
    enabled: !!user && !!id
  });
};

export const useGrievanceResolution = (id) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['grievanceResolution', id],
    queryFn: () => grievanceService.getGrievanceResolution(user, id),
    enabled: !!user && !!id
  });
};

export const useCreateGrievanceDraft = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (draftData) => grievanceService.createGrievanceDraft(user, draftData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizenGrievances'] });
    }
  });
};

export const useSubmitGrievance = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => grievanceService.submitGrievance(user, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['citizenGrievances'] });
      queryClient.invalidateQueries({ queryKey: ['grievance', id] });
      queryClient.invalidateQueries({ queryKey: ['grievanceTimeline', id] });
    }
  });
};

export const useSubmitGrievanceClarification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, responseText }) => grievanceService.submitClarificationResponse(user, requestId, responseText),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['grievanceRequests'] });
      queryClient.invalidateQueries({ queryKey: ['grievance'] }); // to update status
    }
  });
};

export const useRespondToResolution = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, accepted, responseText }) => grievanceService.respondToResolution(user, id, accepted, responseText),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['grievanceResolution', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['grievance', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['grievanceTimeline', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['citizenGrievances'] });
    }
  });
};
