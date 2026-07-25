/**
 * colorTokens.js
 * Raw Palette -> Semantic Tokens -> Component Tokens
 */

// 1. Raw Palette (Internal use only, do not consume directly in components)
export const rawPalette = {
  blue: {
    50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa', 
    500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a', 950: '#172554'
  },
  slate: {
    50: '#f8fafc', 100: '#f1f5f9', 200: '#e2e8f0', 300: '#cbd5e1', 400: '#94a3b8', 
    500: '#64748b', 600: '#475569', 700: '#334155', 800: '#1e293b', 900: '#0f172a', 950: '#020617'
  },
  emerald: {
    50: '#ecfdf5', 500: '#10b981', 600: '#059669', 700: '#047857'
  },
  amber: {
    50: '#fffbeb', 500: '#f59e0b', 600: '#d97706', 700: '#b45309'
  },
  red: {
    50: '#fef2f2', 500: '#ef4444', 600: '#dc2626', 700: '#b91c1c'
  },
  white: '#ffffff',
  transparent: 'transparent'
};

// 2. Semantic Tokens (Exposed as CSS Variables: --ds-color-*)
export const semanticColors = {
  background: rawPalette.slate[50],
  'surface-default': rawPalette.white,
  'surface-muted': rawPalette.slate[50],
  'surface-overlay': rawPalette.white,
  
  'text-primary': rawPalette.slate[900],
  'text-secondary': rawPalette.slate[600],
  'text-muted': rawPalette.slate[400],
  'text-inverse': rawPalette.white,
  
  'border-default': rawPalette.slate[200],
  'border-strong': rawPalette.slate[300],
  'border-muted': rawPalette.slate[100],

  'primary-default': rawPalette.blue[600],
  'primary-hover': rawPalette.blue[700],
  'primary-active': rawPalette.blue[800],
  'primary-subtle': rawPalette.blue[50],
  
  'success-default': rawPalette.emerald[600],
  'success-subtle': rawPalette.emerald[50],
  
  'warning-default': rawPalette.amber[600],
  'warning-subtle': rawPalette.amber[50],
  
  'error-default': rawPalette.red[600],
  'error-subtle': rawPalette.red[50],
  
  'focus-ring': rawPalette.blue[400],
  'overlay-backdrop': 'rgba(15, 23, 42, 0.5)' // slate-900 / 50%
};

// 3. Status Colors (Derived Semantic Tokens)
export const statusColors = {
  info: semanticColors['primary-default'],
  infoSubtle: semanticColors['primary-subtle'],
  success: semanticColors['success-default'],
  successSubtle: semanticColors['success-subtle'],
  warning: semanticColors['warning-default'],
  warningSubtle: semanticColors['warning-subtle'],
  error: semanticColors['error-default'],
  errorSubtle: semanticColors['error-subtle']
};
