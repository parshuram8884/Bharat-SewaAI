import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ocrService } from '../services/ocrService';
import { applicationService } from '../services/applicationService';

export const OCR_KEYS = {
  session: (id) => ['ocr', 'session', id],
  status: (id) => ['ocr', 'status', id],
  result: (id) => ['ocr', 'result', id],
  history: ['ocr', 'history']
};

export function useDocumentSession(documentId) {
  return useQuery({
    queryKey: OCR_KEYS.session(documentId),
    queryFn: () => ocrService.getDocumentSession(documentId),
    enabled: Boolean(documentId)
  });
}

export function useDocumentHistory() {
  return useQuery({
    queryKey: OCR_KEYS.history,
    queryFn: () => ocrService.getDocumentHistory()
  });
}

export function useCreateDocumentSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentType, metadata }) => ocrService.createDocumentSession(documentType, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: OCR_KEYS.history });
    }
  });
}

export function useRunQualityCheck() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId) => ocrService.runQualityCheck(documentId),
    onSuccess: (res, documentId) => {
      queryClient.invalidateQueries({ queryKey: OCR_KEYS.session(documentId) });
    }
  });
}

export function useStartExtraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId) => ocrService.startExtraction(documentId),
    onSuccess: (res, documentId) => {
      queryClient.invalidateQueries({ queryKey: OCR_KEYS.session(documentId) });
    }
  });
}

export function useExtractionStatus(documentId, isExtracting = false) {
  return useQuery({
    queryKey: OCR_KEYS.status(documentId),
    queryFn: () => ocrService.getExtractionStatus(documentId),
    enabled: Boolean(documentId) && isExtracting,
    refetchInterval: isExtracting ? 800 : false
  });
}

export function useUpdateExtractedField() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ documentId, fieldKey, value }) =>
      ocrService.updateExtractedField(documentId, fieldKey, value),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: OCR_KEYS.session(vars.documentId) });
    }
  });
}

export function useConfirmExtraction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId) => ocrService.confirmExtraction(documentId),
    onSuccess: (res, documentId) => {
      queryClient.invalidateQueries({ queryKey: OCR_KEYS.session(documentId) });
    }
  });
}

export function useSaveToMockLocker() {
  return useMutation({
    mutationFn: (documentId) => ocrService.saveToMockLocker(documentId)
  });
}

export function useApplyAutofillMappings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, selectedMappings }) =>
      applicationService.applyDocumentAutofill(applicationId, selectedMappings),
    onSuccess: (res, vars) => {
      queryClient.invalidateQueries({ queryKey: ['applications', 'detail', vars.applicationId] });
    }
  });
}
