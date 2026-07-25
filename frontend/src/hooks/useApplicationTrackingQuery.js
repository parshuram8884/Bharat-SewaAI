import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationTrackingService } from '../services/applicationTrackingService';

export const trackingKeys = {
  all: ['tracking-applications'],
  lists: () => [...trackingKeys.all, 'list'],
  list: (filters) => [...trackingKeys.lists(), { filters }],
  details: () => [...trackingKeys.all, 'detail'],
  detail: (id) => [...trackingKeys.details(), id],
  timelines: () => [...trackingKeys.all, 'timeline'],
  timeline: (id) => [...trackingKeys.timelines(), id],
  status: (id) => [...trackingKeys.all, 'status', id],
  remarks: (id) => [...trackingKeys.all, 'remarks', id],
  docRequests: (id) => [...trackingKeys.all, 'doc-requests', id],
  clarifications: (id) => [...trackingKeys.all, 'clarifications', id],
  history: (id) => [...trackingKeys.all, 'history', id],
};

export function useTrackingApplications(filters) {
  return useQuery({
    queryKey: trackingKeys.list(filters),
    queryFn: () => applicationTrackingService.getApplications(filters),
  });
}

export function useApplicationTrackingSummary(applicationId) {
  return useQuery({
    queryKey: trackingKeys.detail(applicationId),
    queryFn: () => applicationTrackingService.getApplicationTrackingSummary(applicationId),
    enabled: !!applicationId,
  });
}

export function useApplicationTimeline(applicationId) {
  return useQuery({
    queryKey: trackingKeys.timeline(applicationId),
    queryFn: () => applicationTrackingService.getApplicationTimeline(applicationId),
    enabled: !!applicationId,
  });
}

export function useApplicationStatus(applicationId) {
  return useQuery({
    queryKey: trackingKeys.status(applicationId),
    queryFn: () => applicationTrackingService.getApplicationStatus(applicationId),
    enabled: !!applicationId,
  });
}

export function useApplicationRemarks(applicationId) {
  return useQuery({
    queryKey: trackingKeys.remarks(applicationId),
    queryFn: () => applicationTrackingService.getApplicationRemarks(applicationId),
    enabled: !!applicationId,
  });
}

export function useDocumentRequests(applicationId) {
  return useQuery({
    queryKey: trackingKeys.docRequests(applicationId),
    queryFn: () => applicationTrackingService.getDocumentRequests(applicationId),
    enabled: !!applicationId,
  });
}

export function useClarificationRequests(applicationId) {
  return useQuery({
    queryKey: trackingKeys.clarifications(applicationId),
    queryFn: () => applicationTrackingService.getClarificationRequests(applicationId),
    enabled: !!applicationId,
  });
}

export function useApplicationHistory(applicationId) {
  return useQuery({
    queryKey: trackingKeys.history(applicationId),
    queryFn: () => applicationTrackingService.getApplicationHistory(applicationId),
    enabled: !!applicationId,
  });
}

export function useUploadRequestedDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, requestId, documentMetadata }) => 
      applicationTrackingService.uploadRequestedDocument(applicationId, requestId, documentMetadata),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: trackingKeys.detail(variables.applicationId) });
      queryClient.invalidateQueries({ queryKey: trackingKeys.timeline(variables.applicationId) });
      queryClient.invalidateQueries({ queryKey: trackingKeys.docRequests(variables.applicationId) });
      queryClient.invalidateQueries({ queryKey: trackingKeys.status(variables.applicationId) });
    },
  });
}

export function useSaveClarificationDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, requestId, responseText, attachments }) => 
      applicationTrackingService.saveClarificationDraft(applicationId, requestId, responseText, attachments),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: trackingKeys.clarifications(variables.applicationId) });
    },
  });
}

export function useSubmitClarification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, requestId, responseText, attachments }) => 
      applicationTrackingService.submitClarification(applicationId, requestId, responseText, attachments),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: trackingKeys.detail(variables.applicationId) });
      queryClient.invalidateQueries({ queryKey: trackingKeys.timeline(variables.applicationId) });
      queryClient.invalidateQueries({ queryKey: trackingKeys.clarifications(variables.applicationId) });
      queryClient.invalidateQueries({ queryKey: trackingKeys.status(variables.applicationId) });
    },
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, reason }) => applicationTrackingService.withdrawApplication(applicationId, reason),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: trackingKeys.detail(variables.applicationId) });
      queryClient.invalidateQueries({ queryKey: trackingKeys.timeline(variables.applicationId) });
      queryClient.invalidateQueries({ queryKey: trackingKeys.status(variables.applicationId) });
      queryClient.invalidateQueries({ queryKey: trackingKeys.lists() });
    },
  });
}
