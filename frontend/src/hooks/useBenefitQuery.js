import { useQuery } from '@tanstack/react-query';
import { benefitService } from '../services/benefitService';
import { useAuth } from './useAuth';

export const BENEFIT_KEYS = {
  all: ['benefits'],
  list: (citizenId) => [...BENEFIT_KEYS.all, 'list', citizenId],
  detail: (id) => [...BENEFIT_KEYS.all, 'detail', id],
  timeline: (id) => [...BENEFIT_KEYS.all, 'timeline', id],
  history: (id) => [...BENEFIT_KEYS.all, 'history', id],
  sanction: (id) => [...BENEFIT_KEYS.all, 'sanction', id]
};

export function useCitizenBenefits() {
  const { user } = useAuth();
  return useQuery({
    queryKey: BENEFIT_KEYS.list(user?.id),
    queryFn: () => benefitService.getCitizenBenefits(user?.id),
    enabled: Boolean(user?.id)
  });
}

export function useBenefitDetail(benefitId) {
  return useQuery({
    queryKey: BENEFIT_KEYS.detail(benefitId),
    queryFn: () => benefitService.getBenefit(benefitId),
    enabled: Boolean(benefitId)
  });
}

export function useBenefitTimeline(benefitId) {
  return useQuery({
    queryKey: BENEFIT_KEYS.timeline(benefitId),
    queryFn: () => benefitService.getBenefitTimeline(benefitId),
    enabled: Boolean(benefitId)
  });
}

export function useBenefitPaymentHistory(benefitId) {
  return useQuery({
    queryKey: BENEFIT_KEYS.history(benefitId),
    queryFn: () => benefitService.getBenefitPaymentHistory(benefitId),
    enabled: Boolean(benefitId)
  });
}

export function useBenefitSanction(benefitId) {
  return useQuery({
    queryKey: BENEFIT_KEYS.sanction(benefitId),
    queryFn: () => benefitService.getBenefitSanction(benefitId),
    enabled: Boolean(benefitId)
  });
}
