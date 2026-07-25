// commandPaletteModel.js
export const createCommand = (props) => ({
  id: props.id || 'cmd_' + Date.now(),
  labelKey: props.labelKey,
  descriptionKey: props.descriptionKey || '',
  group: props.group || 'general',
  keywords: props.keywords || [],
  shortcut: props.shortcut || null,
  route: props.route || null,
  actionKey: props.actionKey || null,
  requiredRoles: props.requiredRoles || [],
  requiredPermissions: props.requiredPermissions || [],
  featureFlag: props.featureFlag || null,
  onlineRequired: props.onlineRequired || false,
  destructive: props.destructive || false,
  enabled: props.enabled !== undefined ? props.enabled : true
});
