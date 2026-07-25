/**
 * typographyTokens.js
 * Responsive typography scale
 */

export const typographyTokens = {
  family: {
    sans: 'Inter, system-ui, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    devanagari: '"Tiro Devanagari Hindi", "Yatra One", sans-serif'
  },
  size: {
    // scale in rem (assuming 16px base)
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem'  // 36px
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  },
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em'
  }
};
