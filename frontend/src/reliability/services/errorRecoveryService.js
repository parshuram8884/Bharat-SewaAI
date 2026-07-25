/**
 * Classifies errors and provides safe recovery routes.
 */

class ErrorRecoveryService {
  classifyError(error) {
    const message = error.message || '';
    if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
      return 'temporary-network';
    }
    if (!navigator.onLine) {
      return 'offline';
    }
    if (message.includes('timeout') || message.includes('Timeout')) {
      return 'timeout';
    }
    if (message.includes('permission') || message.includes('Unauthorized')) {
      return 'permission-denied';
    }
    if (message.includes('ChunkLoadError') || message.includes('dynamically imported module')) {
      return 'chunk-load-error';
    }
    return 'unknown';
  }

  createSafeErrorReference(error, contextId = 'global') {
    return {
      id: `err_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      category: this.classifyError(error),
      routeId: window.location.pathname,
      featureId: contextId,
      occurredAt: new Date().toISOString(),
      message: error.message,
      recoverable: this.canRetry(error)
    };
  }

  canRetry(error) {
    const category = this.classifyError(error);
    return ['temporary-network', 'timeout', 'chunk-load-error', 'unknown'].includes(category);
  }

  getRecoveryActions(errorCategory) {
    switch (errorCategory) {
      case 'temporary-network':
      case 'timeout':
        return [{ id: 'retry', label: 'Try again', primary: true }];
      case 'offline':
        return [{ id: 'retry', label: 'Check connection and try again', primary: true }];
      case 'chunk-load-error':
        return [
          { id: 'reload', label: 'Reload page', primary: true },
          { id: 'home', label: 'Return Home', primary: false }
        ];
      case 'permission-denied':
        return [{ id: 'home', label: 'Return Home', primary: true }];
      default:
        return [
          { id: 'retry', label: 'Try again', primary: true },
          { id: 'home', label: 'Return Home', primary: false }
        ];
    }
  }
}

export const errorRecoveryService = new ErrorRecoveryService();
