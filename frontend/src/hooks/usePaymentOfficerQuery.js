import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentOfficerService } from '../services/paymentOfficerService';
import { BENEFIT_KEYS } from './useBenefitQuery';

export const PAYMENT_OFFICER_KEYS = {
  all: ['payment-officer'],
  dashboard: () => [...PAYMENT_OFFICER_KEYS.all, 'dashboard'],
  queue: () => [...PAYMENT_OFFICER_KEYS.all, 'queue'],
  failed: () => [...PAYMENT_OFFICER_KEYS.all, 'failed'],
  manual: () => [...PAYMENT_OFFICER_KEYS.all, 'manual'],
  batches: () => [...PAYMENT_OFFICER_KEYS.all, 'batches'],
  batch: (id) => [...PAYMENT_OFFICER_KEYS.all, 'batch', id],
  record: (id) => [...PAYMENT_OFFICER_KEYS.all, 'record', id]
};

export function usePaymentDashboard() {
  return useQuery({
    queryKey: PAYMENT_OFFICER_KEYS.dashboard(),
    queryFn: () => paymentOfficerService.getPaymentDashboard()
  });
}

export function usePaymentQueue() {
  return useQuery({
    queryKey: PAYMENT_OFFICER_KEYS.queue(),
    queryFn: () => paymentOfficerService.getPaymentQueue()
  });
}

export function useFailedPayments() {
  return useQuery({
    queryKey: PAYMENT_OFFICER_KEYS.failed(),
    queryFn: () => paymentOfficerService.getFailedPayments()
  });
}

export function useManualReviewPayments() {
  return useQuery({
    queryKey: PAYMENT_OFFICER_KEYS.manual(),
    queryFn: () => paymentOfficerService.getManualReviewPayments()
  });
}

export function usePaymentBatches() {
  return useQuery({
    queryKey: PAYMENT_OFFICER_KEYS.batches(),
    queryFn: () => paymentOfficerService.getPaymentBatches()
  });
}

export function usePaymentBatch(batchId) {
  return useQuery({
    queryKey: PAYMENT_OFFICER_KEYS.batch(batchId),
    queryFn: () => paymentOfficerService.getPaymentBatch(batchId),
    enabled: Boolean(batchId)
  });
}

export function usePaymentRecord(benefitId) {
  return useQuery({
    queryKey: PAYMENT_OFFICER_KEYS.record(benefitId),
    queryFn: () => paymentOfficerService.getPaymentRecord(benefitId),
    enabled: Boolean(benefitId)
  });
}

export function useApproveSanction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (benefitId) => paymentOfficerService.approveSanction(benefitId),
    onSuccess: (data, benefitId) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_OFFICER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BENEFIT_KEYS.detail(benefitId) });
    }
  });
}

export function useCreatePaymentBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ departmentId, benefitIds }) => paymentOfficerService.createPaymentBatch(departmentId, benefitIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_OFFICER_KEYS.all });
    }
  });
}

export function useSubmitPaymentBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (batchId) => paymentOfficerService.submitPaymentBatch(batchId),
    onSuccess: (data, batchId) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_OFFICER_KEYS.all });
    }
  });
}

export function useApprovePaymentBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (batchId) => paymentOfficerService.approvePaymentBatch(batchId),
    onSuccess: (data, batchId) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_OFFICER_KEYS.all });
    }
  });
}

export function useReleasePaymentBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (batchId) => paymentOfficerService.releasePaymentBatch(batchId),
    onSuccess: (data, batchId) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_OFFICER_KEYS.all });
    }
  });
}

export function useSimulatePaymentProcessing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (batchId) => paymentOfficerService.simulatePaymentProcessing(batchId),
    onSuccess: (data, batchId) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_OFFICER_KEYS.all });
    }
  });
}

export function useSimulatePaymentSuccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (benefitId) => paymentOfficerService.simulatePaymentSuccess(benefitId),
    onSuccess: (data, benefitId) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_OFFICER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BENEFIT_KEYS.detail(benefitId) });
    }
  });
}

export function useSimulatePaymentFailure() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ benefitId, failureReason }) => paymentOfficerService.simulatePaymentFailure(benefitId, failureReason),
    onSuccess: (data, { benefitId }) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_OFFICER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BENEFIT_KEYS.detail(benefitId) });
    }
  });
}

export function useSchedulePaymentRetry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (benefitId) => paymentOfficerService.schedulePaymentRetry(benefitId),
    onSuccess: (data, benefitId) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_OFFICER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BENEFIT_KEYS.detail(benefitId) });
    }
  });
}

export function useMoveToManualReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (benefitId) => paymentOfficerService.moveToManualReview(benefitId),
    onSuccess: (data, benefitId) => {
      queryClient.invalidateQueries({ queryKey: PAYMENT_OFFICER_KEYS.all });
      queryClient.invalidateQueries({ queryKey: BENEFIT_KEYS.detail(benefitId) });
    }
  });
}
