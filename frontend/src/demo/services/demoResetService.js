/**
 * Safely resets demonstration data while preserving core preferences.
 */
import { storageRecoveryService } from '../../reliability/services/storageRecoveryService';

class DemoResetService {
  resetScenarioData() {
    // We wipe scenario-specific data but preserve language, theme, and accessibility.
    const preservedDomains = ['bsai_preferences', 'bsai_user'];
    
    // For demonstration, we simply clear local storage domains that match our demo patterns
    const allKeys = Object.keys(localStorage);
    
    let resetCount = 0;
    for (const key of allKeys) {
      if (key.startsWith('bsai_draft_') || key.startsWith('bsai_demo_') || key.startsWith('bsai_assistance_history')) {
        if (!preservedDomains.includes(key)) {
          localStorage.removeItem(key);
          resetCount++;
        }
      }
    }
    
    // Also validate overall storage health during reset
    storageRecoveryService.validateStorage();
    
    return { success: true, keysCleared: resetCount };
  }
}

export const demoResetService = new DemoResetService();
