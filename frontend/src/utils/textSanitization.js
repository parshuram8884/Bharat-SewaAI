export const textSanitization = {
  sanitizePlainText(text) {
    if (!text) return '';
    return text.replace(/[<>]/g, ''); // Very basic strip tags for mock
  },
  
  stripControlCharacters(text) {
    if (!text) return '';
    // eslint-disable-next-line no-control-regex
    return text.replace(/[\x00-\x1F\x7F]/g, ''); 
  },
  
  escapeCsvCell(cellValue) {
    if (cellValue === null || cellValue === undefined) return '';
    let val = String(cellValue).trim();
    if (val.startsWith('=') || val.startsWith('+') || val.startsWith('-') || val.startsWith('@')) {
      return `'${val}`;
    }
    return val;
  }
};
