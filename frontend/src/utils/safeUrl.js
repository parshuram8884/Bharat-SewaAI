export const safeUrl = {
  validateInternalRoute(path) {
    if (!path) return '/';
    // Reject absolute URLs, javascript:, etc.
    if (path.match(/^(http|https|javascript|data|vbs):/i) || path.startsWith('//')) {
      return '/';
    }
    return path;
  }
};
