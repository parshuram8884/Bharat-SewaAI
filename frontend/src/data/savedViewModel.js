// savedViewModel.js
export const createSavedView = (userId, name, module, route, filters = {}, sort = null, visibleColumns = []) => ({
  id: 'view_' + Date.now(),
  userId,
  name,
  module,
  route,
  filters,
  sort,
  visibleColumns,
  pageSize: 10,
  layoutMode: 'table',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: false,
  sharedDemo: false
});
