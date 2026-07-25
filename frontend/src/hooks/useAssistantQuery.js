import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockAssistantService } from '../services/mockAssistantService';

export const ASSISTANT_KEYS = {
  allHistory: ['assistant', 'history'],
  conversation: (id) => ['assistant', 'conversation', id]
};

export function useConversationHistory() {
  return useQuery({
    queryKey: ASSISTANT_KEYS.allHistory,
    queryFn: () => mockAssistantService.getConversationHistory()
  });
}

export function useConversation(id = 'conv-1') {
  return useQuery({
    queryKey: ASSISTANT_KEYS.conversation(id),
    queryFn: () => mockAssistantService.getConversation(id)
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ conversationId, text }) =>
      mockAssistantService.sendMessage({ conversationId, text }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ASSISTANT_KEYS.allHistory });
      if (data?.conversation?.id) {
        queryClient.invalidateQueries({
          queryKey: ASSISTANT_KEYS.conversation(data.conversation.id)
        });
      }
    }
  });
}

export function useStartConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (initialPrompt) => mockAssistantService.startConversation(initialPrompt),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSISTANT_KEYS.allHistory });
    }
  });
}

export function useDeleteConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => mockAssistantService.deleteConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSISTANT_KEYS.allHistory });
    }
  });
}

export function usePinConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => mockAssistantService.pinConversation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSISTANT_KEYS.allHistory });
    }
  });
}

export function useRenameConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, newTitle }) => mockAssistantService.renameConversation(id, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSISTANT_KEYS.allHistory });
    }
  });
}
