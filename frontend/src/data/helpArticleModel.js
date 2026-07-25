// helpArticleModel.js
export const createHelpArticle = (props) => ({
  id: props.id || 'help_' + Date.now(),
  title: props.title,
  contentMarkdown: props.contentMarkdown || '',
  category: props.category || 'general',
  tags: props.tags || [],
  requiredRoles: props.requiredRoles || [],
  relatedArticleIds: props.relatedArticleIds || [],
  lastUpdated: new Date().toISOString()
});
