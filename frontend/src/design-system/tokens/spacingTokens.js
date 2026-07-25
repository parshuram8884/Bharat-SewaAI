/**
 * spacingTokens.js
 * Central scale for paddings, margins, gaps.
 * Aligns with standard Tailwind 0.25rem intervals.
 */

export const spacingTokens = {
  0: '0px',
  1: '0.25rem',  // 4px
  2: '0.5rem',   // 8px
  3: '0.75rem',  // 12px
  4: '1rem',     // 16px
  5: '1.25rem',  // 20px
  6: '1.5rem',   // 24px
  8: '2rem',     // 32px
  10: '2.5rem',  // 40px
  12: '3rem',    // 48px
  16: '4rem',    // 64px
  20: '5rem',    // 80px
  24: '6rem'     // 96px
};

export const radiusTokens = {
  none: '0px',
  sm: '0.125rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  pill: '9999px'
};

export const shadowTokens = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  dialog: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
};

export const zIndexTokens = {
  base: '0',
  sticky: '10',
  dropdown: '40',
  popover: '50',
  drawer: '60',
  modal: '70',
  toast: '80',
  critical: '90' // Overlays that must supersede everything (e.g., demo warnings)
};

export const motionTokens = {
  instant: '0ms',
  fast: '150ms',
  normal: '300ms',
  slow: '500ms'
};
