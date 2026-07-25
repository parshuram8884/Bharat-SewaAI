export const safeDisplay = {
  maskSensitiveValue(value, showLast = 4) {
    if (!value) return '';
    const val = String(value);
    if (val.length <= showLast) return val;
    return '*'.repeat(val.length - showLast) + val.slice(-showLast);
  },

  safeFilename(filename) {
    if (!filename) return 'unnamed_file';
    return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
  }
};
