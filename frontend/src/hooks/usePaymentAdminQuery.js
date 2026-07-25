import { useQuery } from '@tanstack/react-query';
import { paymentAdminService } from '../services/paymentAdminService';

export const PAYMENT_ADMIN_KEYS = {
  all: ['payment-admin'],
  analytics: () => [...PAYMENT_ADMIN_KEYS.all, 'analytics'],
  audit: () => [...PAYMENT_ADMIN_KEYS.all, 'audit']
};

export function usePaymentAnalytics() {
  return useQuery({
    queryKey: PAYMENT_ADMIN_KEYS.analytics(),
    queryFn: () => paymentAdminService.getPaymentAnalytics()
  });
}

export function useGlobalPaymentAudit() {
  return useQuery({
    queryKey: PAYMENT_ADMIN_KEYS.audit(),
    queryFn: () => paymentAdminService.getGlobalPaymentAudit()
  });
}
