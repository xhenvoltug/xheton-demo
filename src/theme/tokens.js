// Design Tokens for XHETON System v0.0.006

// Color Gradients
export const gradients = {
  primary: {
    emerald: 'from-emerald-500 to-teal-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-pink-500',
    teal: 'from-teal-500 to-cyan-500'
  },
  
  subtle: {
    emerald: 'from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950',
    blue: 'from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950',
    purple: 'from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950',
    amber: 'from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-950'
  }
};

// Neutral Palette
export const colors = {
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a'
  },
  
  emerald: {
    50: '#ecfdf5',
    100: '#d1fae5',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    900: '#064e3b'
  }
};

// Shadows
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
};

// Border Radii
export const borderRadius = {
  sm: '0.5rem',   // 8px
  md: '0.75rem',  // 12px
  lg: '1rem',     // 16px
  xl: '1.5rem',   // 24px
  '2xl': '2rem',  // 32px
  '3xl': '3rem',  // 48px
  full: '9999px'
};

// Spacing
export const spacing = {
  xs: '0.5rem',   // 8px
  sm: '1rem',     // 16px
  md: '1.5rem',   // 24px
  lg: '2rem',     // 32px
  xl: '3rem',     // 48px
  '2xl': '4rem',  // 64px
  '3xl': '6rem'   // 96px
};

// Animation Speeds
export const animation = {
  fast: '200ms',
  normal: '300ms',
  slow: '500ms',
  slower: '700ms'
};

// Typography
export const typography = {
  fontFamily: {
    sans: 'ui-sans-serif, system-ui, sans-serif',
    mono: 'ui-monospace, monospace'
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem'  // 36px
  }
};

// Layout
export const layout = {
  sidebar: {
    width: '280px',
    collapsedWidth: '80px'
  },
  
  header: {
    height: '80px'
  },
  
  container: {
    maxWidth: '1280px'
  }
};

// Z-Index
export const zIndex = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070
};

export default {
  gradients,
  colors,
  shadows,
  borderRadius,
  spacing,
  animation,
  typography,
  layout,
  zIndex
};
