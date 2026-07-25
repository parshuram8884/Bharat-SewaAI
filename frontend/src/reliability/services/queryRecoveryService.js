/**
 * Configures safe retry policies for React Query.
 */
import { errorRecoveryService } from './errorRecoveryService';

export const queryRecoveryService = {
  shouldRetry: (failureCount, error) => {
    // Hard limit on all retries
    if (failureCount >= 3) return false;
    
    // Classify error
    const category = errorRecoveryService.classifyError(error);
    
    // Never automatically retry these classes
    if (['permission-denied', 'offline', 'validation-error', 'resource-missing', 'feature-disabled'].includes(category)) {
      return false;
    }
    
    return true;
  },
  
  getRetryDelay: (attemptIndex) => {
    return Math.min(1000 * 2 ** attemptIndex, 10000); // Exponential backoff max 10s
  },
  
  getDefaultOptions: () => ({
    queries: {
      retry: queryRecoveryService.shouldRetry,
      retryDelay: queryRecoveryService.getRetryDelay,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always', // Will only fetch if online state is actually restored
      staleTime: 1000 * 60 * 5, // 5 minutes cache default
      gcTime: 1000 * 60 * 15, // 15 mins GC
    },
    mutations: {
      // Mock mutations should NEVER automatically retry due to risk of duplicate destructive actions
      retry: false 
    }
  })
};
