import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentVerificationService } from '../services/documentVerificationService';
import { useAuth } from './useAuth';

export const useVerificationQueue = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['verificationQueue', user?.departmentId],
    queryFn: () => documentVerificationService.getVerificationQueue(user),
    enabled: !!user && ['document-officer', 'verification-manager', 'department-admin', 'super-admin'].includes(user.role)
  });
};

export const useVerificationLogs = (documentId) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['verificationLogs', documentId],
    queryFn: () => documentVerificationService.getVerificationLogs(user, documentId),
    enabled: !!user && !!documentId
  });
};

export const useAssignDocument = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId) => documentVerificationService.assignDocument(user, documentId),
    onSuccess: (data, documentId) => {
      queryClient.invalidateQueries({ queryKey: ['verificationQueue'] });
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      queryClient.invalidateQueries({ queryKey: ['verificationLogs', documentId] });
    }
  });
};

export const useAddInternalNote = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, note }) => documentVerificationService.addInternalNote(user, documentId, note),
    onSuccess: (data, { documentId }) => {
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
    }
  });
};

export const useSubmitRecommendation = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, recommendation, remark }) => documentVerificationService.submitRecommendation(user, documentId, recommendation, remark),
    onSuccess: (data, { documentId }) => {
      queryClient.invalidateQueries({ queryKey: ['verificationQueue'] });
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      queryClient.invalidateQueries({ queryKey: ['verificationLogs', documentId] });
    }
  });
};

export const useApproveVerification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId) => documentVerificationService.approveVerification(user, documentId),
    onSuccess: (data, documentId) => {
      queryClient.invalidateQueries({ queryKey: ['verificationQueue'] });
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
      queryClient.invalidateQueries({ queryKey: ['verificationLogs', documentId] });
    }
  });
};
