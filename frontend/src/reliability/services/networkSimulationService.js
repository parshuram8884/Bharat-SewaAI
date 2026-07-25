/**
 * Simulates network conditions purely for frontend mock API calls.
 */

const STORAGE_KEY = 'bsai_network_simulation';

class NetworkSimulationService {
  constructor() {
    this.mode = this.loadMode();
  }

  loadMode() {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'normal';
    } catch {
      return 'normal';
    }
  }

  setMode(mode) {
    this.mode = mode;
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch (e) {
      console.warn('Could not save network simulation mode');
    }
  }

  getMode() {
    return this.mode;
  }

  /**
   * Wraps a mock API promise to simulate network conditions.
   * @param {Promise} promise 
   * @param {number} defaultDelay 
   */
  async simulate(promise, defaultDelay = 500) {
    // We do NOT block normal fetch or interfere with Vite.
    // This is strictly for wrapping our demoDataService delays.
    
    if (this.mode === 'offline') {
      throw new Error('NetworkError: Simulated offline state');
    }
    
    if (this.mode === 'timeout') {
      await new Promise(resolve => setTimeout(resolve, 8000));
      throw new Error('Timeout: Simulated network timeout');
    }
    
    if (this.mode === 'slow') {
      await new Promise(resolve => setTimeout(resolve, defaultDelay + 3000));
    } else {
      await new Promise(resolve => setTimeout(resolve, defaultDelay));
    }
    
    if (this.mode === 'intermittent-failure') {
      if (Math.random() > 0.5) {
        throw new Error('NetworkError: Simulated intermittent failure');
      }
    }
    
    return promise;
  }
}

export const networkSimulationService = new NetworkSimulationService();
