// searchIndexModel.js
export const createSearchIndexEntry = (props) => ({
  id: props.id || 'idx_' + Date.now(),
  resourceType: props.resourceType,
  resourceId: props.resourceId,
  title: props.title,
  subtitle: props.subtitle || '',
  keywords: props.keywords || [],
  route: props.route,
  module: props.module,
  requiredRoles: props.requiredRoles || [],
  requiredPermissions: props.requiredPermissions || [],
  featureFlag: props.featureFlag || null,
  public: props.public || false,
  searchableText: props.searchableText || '',
  updatedAt: new Date().toISOString()
});
