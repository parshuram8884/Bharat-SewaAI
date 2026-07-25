// keyboardShortcutModel.js
export const createKeyboardShortcut = (props) => ({
  id: props.id || 'ks_' + Date.now(),
  keyCombo: props.keyCombo, // e.g., 'ctrl+k'
  descriptionKey: props.descriptionKey,
  group: props.group || 'navigation',
  actionKey: props.actionKey
});
