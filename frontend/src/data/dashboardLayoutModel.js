// dashboardLayoutModel.js
export const createDashboardLayout = (userId, roleContext) => ({
  id: 'dash_layout_' + Date.now(),
  userId,
  roleContext,
  name: 'Default Dashboard',
  widgetOrder: [], // Populated by defaults based on role
  hiddenWidgetIds: [],
  pinnedWidgetIds: [],
  columnMode: 'responsive-auto',
  compact: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  active: true
});
