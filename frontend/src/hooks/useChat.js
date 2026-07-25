import { useState, useCallback } from 'react';
import apiClient from '../services/apiClient';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendMessage = useCallback(async (text) => {
    if (!text || text.trim() === '') return;
    
    const userMessage = { id: Date.now().toString(), role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await apiClient.post('/chat/message', { message: text });
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      return response.data.reply;
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to connect to the assistant';
      setError(errorMessage);
      const systemErrorMessage = {
        id: (Date.now() + 2).toString(),
        role: 'system',
        content: `Error: ${errorMessage}`,
      };
      setMessages((prev) => [...prev, systemErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearChat,
  };
}

export default useChat;
