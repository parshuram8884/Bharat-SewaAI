/**
 * helpCenterService.js
 * Exposes static frontend help content.
 */

const articles = [
  { id: 'h1', title: 'Citizen Workflows Overview', category: 'citizen' },
  { id: 'h2', title: 'Officer Queue Management', category: 'officer' },
  { id: 'h3', title: 'Platform Health Diagnostics', category: 'admin', requiredRoles: ['platform-operator', 'super-admin'] },
  { id: 'h4', title: 'Personalisation and Privacy (Demo)', category: 'general' }
];

export const helpCenterService = {
  getArticles(userContext) {
    return articles.filter(a => {
      if (a.requiredRoles && !a.requiredRoles.some(r => userContext.role.includes(r))) return false;
      return true;
    });
  },
  searchHelp(query, userContext) {
    const all = this.getArticles(userContext);
    const q = query.toLowerCase();
    return all.filter(a => a.title.toLowerCase().includes(q));
  }
};
