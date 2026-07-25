import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentVaultService } from '../services/documentVaultService';
import { mockDigilockerService } from '../services/mockDigilockerService';
import { mockEsignService } from '../services/mockEsignService';
import { useAuth } from './useAuth';

export const useCitizenDocuments = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['citizenDocuments', user?.id],
    queryFn: () => documentVaultService.getCitizenDocuments(user),
    enabled: !!user && user.role === 'citizen'
  });
};

export const useDocumentDetail = (documentId) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['document', documentId],
    queryFn: () => documentVaultService.getDocumentDetails(user, documentId),
    enabled: !!user && !!documentId
  });
};

export const useDocumentVersions = (documentId) => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['documentVersions', documentId],
    queryFn: () => documentVaultService.getDocumentVersions(user, documentId),
    enabled: !!user && !!documentId
  });
};

export const useUploadDocument = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (metadata) => documentVaultService.uploadDocumentDraft(user, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizenDocuments'] });
    }
  });
};

export const useSubmitDocument = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId) => documentVaultService.submitDocument(user, documentId),
    onSuccess: (data, documentId) => {
      queryClient.invalidateQueries({ queryKey: ['citizenDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
    }
  });
};

export const useRequestVerification = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId) => documentVaultService.requestVerification(user, documentId),
    onSuccess: (data, documentId) => {
      queryClient.invalidateQueries({ queryKey: ['citizenDocuments'] });
      queryClient.invalidateQueries({ queryKey: ['document', documentId] });
    }
  });
};

export const useCreateShareLink = () => {
  const { user } = useAuth();
  return useMutation({
    mutationFn: ({ documentId, options }) => documentVaultService.createShareLink(user, documentId, options)
  });
};

export const useDigilockerConnection = () => {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['digilockerConnection', user?.id],
    queryFn: () => mockDigilockerService.getConnectionState(user),
    enabled: !!user && user.role === 'citizen'
  });
};

export const useDigilockerConnect = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => mockDigilockerService.connect(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digilockerConnection'] });
    }
  });
};

export const useDigilockerImport = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (sourceDocumentId) => mockDigilockerService.importDocument(user, sourceDocumentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['citizenDocuments'] });
    }
  });
};

export const useApplyEsign = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId) => mockEsignService.applyEsign(user, documentId),
    onSuccess: (data, documentId) => {
      queryClient.invalidateQueries({ queryKey: ['documentEsign', documentId] });
    }
  });
};

export const useDocumentEsign = (documentId, versionId) => {
  return useQuery({
    queryKey: ['documentEsign', documentId, versionId],
    queryFn: () => mockEsignService.getSignatureForVersion(versionId),
    enabled: !!versionId
  });
};

export const useSharedDocument = (token) => {
  return useQuery({
    queryKey: ['sharedDocument', token],
    queryFn: () => documentVaultService.getSharedDocument(token),
    enabled: !!token,
    retry: false
  });
};
