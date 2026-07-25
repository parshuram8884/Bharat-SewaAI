/**
 * commandPaletteService.js
 * Registry and matching for the Cmd+K palette.
 */
import { featureFlags } from '../config/featureFlags';

export const commandPaletteService = {
  getCommands(userContext) {
    const registry = [
      { id: 'c1', labelKey: 'Navigate Home', route: '/', group: 'Navigation' },
      { id: 'c2', labelKey: 'Open Universal Search', actionKey: 'OPEN_SEARCH', group: 'Navigation' },
      { id: 'c3', labelKey: 'Toggle High Contrast', actionKey: 'TOGGLE_HIGH_CONTRAST', group: 'Preferences' },
      { id: 'c4', labelKey: 'Full Demo Reset', actionKey: 'OPEN_DEMO_RESET', group: 'System', requiredRoles: ['super-admin'], destructive: true, featureFlag: 'enable-demo-reset' },
      { id: 'c5', labelKey: 'View Officer Dashboard', route: '/officer/dashboard', group: 'Navigation', requiredRoles: ['officer', 'department-admin'] }
    ];

    return registry.filter(cmd => {
      if (cmd.requiredRoles && !cmd.requiredRoles.some(r => userContext.role.includes(r))) return false;
      if (cmd.featureFlag && !featureFlags[cmd.featureFlag]?.enabledByDefault) return false;
      return cmd.enabled !== false;
    });
  }
};
