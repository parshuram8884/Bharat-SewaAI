import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../services/applicationService';

export const APPLICATION_KEYS = {
  list: (filters) => ['applications', 'list', filters],
  detail: (id) => ['applications', 'detail', id],
  draftByScheme: (schemeId) => ['applications', 'draft', schemeId],
  requirements: (id) => ['applications', 'requirements', id],
  validation: (id) => ['applications', 'validation', id],
  acknowledgement: (id) => ['applications', 'acknowledgement', id]
};

export function useApplications(filters = {}) {
  return useQuery({
    queryKey: APPLICATION_KEYS.list(filters),
    queryFn: () => applicationService.getApplications(filters)
  });
}

export function useApplication(applicationId) {
  return useQuery({
    queryKey: APPLICATION_KEYS.detail(applicationId),
    queryFn: () => applicationService.getApplication(applicationId),
    enabled: Boolean(applicationId)
  });
}

export function useDraftApplicationByScheme(schemeId) {
  return useQuery({
    queryKey: APPLICATION_KEYS.draftByScheme(schemeId),
    queryFn: () => applicationService.getDraftApplicationByScheme(schemeId),
    enabled: Boolean(schemeId)
  });
}

export function useCreateApplicationDraft() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ schemeId, eligibilityResultId }) =>
      applicationService.createApplicationDraft(schemeId, eligibilityResultId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    }
  });
}

export function useUpdateApplicationForm() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, formData }) =>
      applicationService.updateApplicationForm(applicationId, formData),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(vars.applicationId) });
    }
  });
}

export function useAttachApplicationDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, docMetadata }) =>
      applicationService.attachDocument(applicationId, docMetadata),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(vars.applicationId) });
    }
  });
}

export function useRemoveApplicationDocument() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, documentId }) =>
      applicationService.removeDocument(applicationId, documentId),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(vars.applicationId) });
    }
  });
}

export function useValidateApplication(applicationId) {
  return useQuery({
    queryKey: APPLICATION_KEYS.validation(applicationId),
    queryFn: () => applicationService.validateApplication(applicationId),
    enabled: Boolean(applicationId)
  });
}

export function useSaveApplicationDeclaration() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, declaration }) =>
      applicationService.saveDeclaration(applicationId, declaration),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(vars.applicationId) });
    }
  });
}

export function useSubmitApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId) => applicationService.submitApplication(applicationId),
    onSuccess: (res, applicationId) => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: APPLICATION_KEYS.detail(applicationId) });
    }
  });
}

export function useWithdrawApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (applicationId) => applicationService.withdrawApplication(applicationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    }
  });
}
