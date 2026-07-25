/**
 * keyboardShortcutService.js
 * Registry for application-wide shortcuts.
 */
export const keyboardShortcutService = {
  getShortcuts() {
    return [
      { id: 'k1', keyCombo: 'Ctrl+K', descriptionKey: 'Open Command Palette', group: 'Navigation' },
      { id: 'k2', keyCombo: 'Ctrl+/', descriptionKey: 'Show Keyboard Shortcuts', group: 'Help' },
      { id: 'k3', keyCombo: 'Alt+1', descriptionKey: 'Role Dashboard', group: 'Navigation' },
      { id: 'k4', keyCombo: 'Alt+2', descriptionKey: 'Main Work Queue', group: 'Navigation' },
      { id: 'k5', keyCombo: 'Alt+3', descriptionKey: 'Notifications', group: 'Navigation' },
      { id: 'k6', keyCombo: 'Alt+4', descriptionKey: 'Universal Search', group: 'Navigation' },
      { id: 'k7', keyCombo: 'Escape', descriptionKey: 'Close Dialogs/Menus', group: 'System' }
    ];
  }
};
