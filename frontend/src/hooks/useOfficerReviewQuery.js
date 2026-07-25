import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { officerReviewService } from '../services/officerReviewService';
import { adminService } from '../services/adminService';

export const officerKeys = {
  all: ['officer'],
  dashboard: () => [...officerKeys.all, 'dashboard'],
  queue: (filters) => [...officerKeys.all, 'queue', filters],
  application: (id) => [...officerKeys.all, 'application', id],
  checklist: (id) => [...officerKeys.all, 'checklist', id],
  notes: (id) => [...officerKeys.all, 'notes', id],
  audit: (id) => [...officerKeys.all, 'audit', id]
};

export const adminKeys = {
  all: ['admin'],
  departments: () => [...adminKeys.all, 'departments'],
  officers: () => [...adminKeys.all, 'officers'],
  analytics: () => [...adminKeys.all, 'analytics'],
  auditLog: () => [...adminKeys.all, 'auditLog']
};

// --- OFFICER HOOKS ---

export function useOfficerDashboard() {
  return useQuery({
    queryKey: officerKeys.dashboard(),
    queryFn: () => officerReviewService.getOfficerDashboard()
  });
}

export function useApplicationQueue(filters) {
  return useQuery({
    queryKey: officerKeys.queue(filters),
    queryFn: () => officerReviewService.getApplicationQueue(filters)
  });
}

export function useOfficerApplication(id) {
  return useQuery({
    queryKey: officerKeys.application(id),
    queryFn: () => officerReviewService.getOfficerApplication(id),
    enabled: !!id
  });
}

export function useReviewChecklist(id, schemeId) {
  return useQuery({
    queryKey: officerKeys.checklist(id),
    queryFn: () => officerReviewService.getReviewChecklist(id, schemeId),
    enabled: !!id && !!schemeId
  });
}

export function useSaveReviewChecklist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, completedChecks, notes }) => officerReviewService.saveReviewChecklist(id, completedChecks, notes),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: officerKeys.checklist(variables.id) });
      queryClient.invalidateQueries({ queryKey: officerKeys.application(variables.id) });
    }
  });
}

export function useInternalNotes(id) {
  return useQuery({
    queryKey: officerKeys.notes(id),
    queryFn: () => officerReviewService.getInternalNotes(id),
    enabled: !!id
  });
}

export function useAddInternalNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content, category, visibility }) => officerReviewService.addInternalNote(id, content, category, visibility),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: officerKeys.notes(variables.id) });
      queryClient.invalidateQueries({ queryKey: officerKeys.audit(variables.id) });
    }
  });
}

export function useAssignApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ applicationId, officerId }) => officerReviewService.assignApplication(applicationId, officerId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: officerKeys.application(variables.applicationId) });
      queryClient.invalidateQueries({ queryKey: officerKeys.queue() });
      queryClient.invalidateQueries({ queryKey: officerKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: officerKeys.audit(variables.applicationId) });
    }
  });
}

export function useCreateClarificationRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, question, reason, citizenNote }) => officerReviewService.createClarificationRequest(id, question, reason, citizenNote),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: officerKeys.application(variables.id) });
      queryClient.invalidateQueries({ queryKey: officerKeys.audit(variables.id) });
    }
  });
}

export function useApproveApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, benefitSummary, citizenMessage, internalNote }) => officerReviewService.approveApplication(id, benefitSummary, citizenMessage, internalNote),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: officerKeys.application(variables.id) });
      queryClient.invalidateQueries({ queryKey: officerKeys.queue() });
      queryClient.invalidateQueries({ queryKey: officerKeys.dashboard() });
      queryClient.invalidateQueries({ queryKey: adminKeys.analytics() });
    }
  });
}

// --- ADMIN HOOKS ---

export function useAdminAnalytics() {
  return useQuery({
    queryKey: adminKeys.analytics(),
    queryFn: () => adminService.getAdminAnalytics()
  });
}

export function useOfficers() {
  return useQuery({
    queryKey: adminKeys.officers(),
    queryFn: () => adminService.getOfficers()
  });
}

export function useDepartments() {
  return useQuery({
    queryKey: adminKeys.departments(),
    queryFn: () => adminService.getDepartments()
  });
}

export function useGlobalAuditLog() {
  return useQuery({
    queryKey: adminKeys.auditLog(),
    queryFn: () => adminService.getGlobalAuditLog()
  });
}

export function useApplicationAuditLog(id) {
  return useQuery({
    queryKey: officerKeys.audit(id),
    queryFn: () => officerReviewService.getApplicationAuditLog(id),
    enabled: !!id
  });
}
