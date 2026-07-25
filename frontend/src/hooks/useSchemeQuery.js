import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { schemeService } from '../services/schemeService';

export const SCHEME_KEYS = {
  list: (filters) => ['schemes', 'list', filters],
  search: (query) => ['schemes', 'search', query],
  detail: (id) => ['schemes', 'detail', id],
  recommended: ['schemes', 'recommended'],
  saved: ['schemes', 'saved'],
  documents: (id) => ['schemes', 'documents', id],
  questions: (id) => ['schemes', 'eligibility', 'questions', id],
  result: (resultId) => ['schemes', 'eligibility', 'result', resultId]
};

export function useSchemes(filters = {}) {
  return useQuery({
    queryKey: SCHEME_KEYS.list(filters),
    queryFn: () => schemeService.getSchemes(filters)
  });
}

export function useSchemeSearch(query = '') {
  return useQuery({
    queryKey: SCHEME_KEYS.search(query),
    queryFn: () => schemeService.searchSchemes(query)
  });
}

export function useSchemeDetails(schemeId) {
  return useQuery({
    queryKey: SCHEME_KEYS.detail(schemeId),
    queryFn: () => schemeService.getSchemeById(schemeId),
    enabled: Boolean(schemeId)
  });
}

export function useRecommendedSchemes() {
  return useQuery({
    queryKey: SCHEME_KEYS.recommended,
    queryFn: () => schemeService.getRecommendedSchemes()
  });
}

export function useSavedSchemes() {
  return useQuery({
    queryKey: SCHEME_KEYS.saved,
    queryFn: () => schemeService.getSavedSchemes()
  });
}

export function useSaveScheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schemeId) => schemeService.saveScheme(schemeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
    }
  });
}

export function useUnsaveScheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schemeId) => schemeService.unsaveScheme(schemeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemes'] });
    }
  });
}

export function useEligibilityQuestions(schemeId) {
  return useQuery({
    queryKey: SCHEME_KEYS.questions(schemeId),
    queryFn: () => schemeService.getEligibilityQuestions(schemeId),
    enabled: Boolean(schemeId)
  });
}

export function useEvaluateEligibility() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ schemeId, profile, answers }) =>
      schemeService.evaluateSchemeEligibility(schemeId, profile, answers),
    onSuccess: (data) => {
      if (data?.resultId) {
        queryClient.invalidateQueries({ queryKey: SCHEME_KEYS.result(data.resultId) });
      }
    }
  });
}

export function useEligibilityResult(resultId) {
  return useQuery({
    queryKey: SCHEME_KEYS.result(resultId),
    queryFn: () => schemeService.getEligibilityResult(resultId),
    enabled: Boolean(resultId)
  });
}
