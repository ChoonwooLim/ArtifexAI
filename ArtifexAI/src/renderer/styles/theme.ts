/**
 * Artifex.AI - Professional Theme System
 * World-class design system inspired by industry leaders
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';

// Color Palette - Inspired by high-end creative tools
export const colors = {
  // Primary - Deep Purple with gradient capabilities
  primary: {
    main: '#7C3AED',
    light: '#A78BFA',
    dark: '#5B21B6',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    glow: '0 0 40px rgba(124, 58, 237, 0.4)',
  },
  
  // Accent Colors - For different AI modes
  ai: {
    video: '#00D9FF',     // Cyan
    image: '#00FF88',     // Green
    audio: '#FF6B6B',     // Coral
    text: '#FFD93D',      // Gold
    enhance: '#FF00FF',   // Magenta
    avatar: '#00FFF0',    // Turquoise
  },
  
  // Workspace Colors
  workspace: {
    bg: '#0A0A0F',        // Deep space black
    surface: '#151521',   // Elevated surface
    panel: '#1A1A2E',     // Panel background
    border: '#2A2A3E',    // Subtle borders
    hover: '#2E2E4A',     // Hover state
    glass: 'rgba(26, 26, 46, 0.7)', // Glassmorphism
  },
  
  // Semantic Colors
  semantic: {
    success: '#10B981',   // Emerald
    warning: '#F59E0B',   // Amber
    error: '#EF4444',     // Red
    info: '#3B82F6',      // Blue
  },
  
  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#A0A0B8',
    tertiary: '#6B6B80',
    disabled: '#4A4A5C',
  },
};

// Typography System - Clean and professional
export const typography = {
  fontFamily: {
    display: '"SF Pro Display", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    mono: '"JetBrains Mono", "SF Mono", Consolas, monospace',
    creative: '"Poppins", "DM Sans", sans-serif',
  },
  sizes: {
    xs: '0.625rem',    // 10px
    sm: '0.75rem',     // 12px
    base: '0.875rem',  // 14px
    md: '1rem',        // 16px
    lg: '1.125rem',    // 18px
    xl: '1.5rem',      // 24px
    '2xl': '2rem',     // 32px
    '3xl': '3rem',     // 48px
  },
};

// Spacing System
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Animation Presets
export const animations = {
  // Transitions
  transition: {
    fast: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    base: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: 'all 0.6s cubic-bezier(0.23, 1, 0.32, 1)',
  },
  
  // Keyframes
  glow: `
    @keyframes glow {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.6; }
    }
  `,
  
  pulse: `
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  `,
  
  float: `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }
  `,
  
  shimmer: `
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
  `,
};

// Effects and Overlays
export const effects = {
  // Glassmorphism
  glass: {
    background: 'rgba(26, 26, 46, 0.6)',
    backdropFilter: 'blur(20px) saturate(180%)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  
  // Neumorphism (subtle)
  neumorph: {
    boxShadow: `
      inset 2px 2px 5px rgba(0, 0, 0, 0.3),
      inset -2px -2px 5px rgba(255, 255, 255, 0.05)
    `,
  },
  
  // Elevation
  elevation: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.4)',
    md: '0 4px 20px rgba(0, 0, 0, 0.5)',
    lg: '0 8px 40px rgba(0, 0, 0, 0.6)',
    xl: '0 16px 60px rgba(0, 0, 0, 0.7)',
  },
  
  // Glow Effects
  glow: {
    sm: '0 0 20px rgba(124, 58, 237, 0.3)',
    md: '0 0 40px rgba(124, 58, 237, 0.4)',
    lg: '0 0 60px rgba(124, 58, 237, 0.5)',
  },
};

// Professional Dark Theme
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: colors.primary.main,
      light: colors.primary.light,
      dark: colors.primary.dark,
    },
    secondary: {
      main: colors.ai.video,
    },
    background: {
      default: colors.workspace.bg,
      paper: colors.workspace.surface,
    },
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
    divider: colors.workspace.border,
    success: {
      main: colors.semantic.success,
    },
    warning: {
      main: colors.semantic.warning,
    },
    error: {
      main: colors.semantic.error,
    },
    info: {
      main: colors.semantic.info,
    },
  },
  
  typography: {
    fontFamily: typography.fontFamily.display,
    h1: {
      fontSize: typography.sizes['3xl'],
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: typography.sizes['2xl'],
      fontWeight: 600,
      letterSpacing: '-0.01em',
    },
    h3: {
      fontSize: typography.sizes.xl,
      fontWeight: 600,
    },
    h4: {
      fontSize: typography.sizes.lg,
      fontWeight: 500,
    },
    h5: {
      fontSize: typography.sizes.md,
      fontWeight: 500,
    },
    h6: {
      fontSize: typography.sizes.base,
      fontWeight: 500,
    },
    body1: {
      fontSize: typography.sizes.base,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: typography.sizes.sm,
      lineHeight: 1.5,
    },
    button: {
      fontSize: typography.sizes.base,
      fontWeight: 500,
      textTransform: 'none',
    },
    caption: {
      fontSize: typography.sizes.xs,
      opacity: 0.8,
    },
  },
  
  shape: {
    borderRadius: 12,
  },
  
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          transition: animations.transition.base,
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: effects.elevation.md,
          },
        },
        contained: {
          background: colors.primary.gradient,
          '&:hover': {
            background: colors.primary.gradient,
            filter: 'brightness(1.1)',
          },
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: colors.workspace.panel,
          border: `1px solid ${colors.workspace.border}`,
          ...effects.glass,
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          ...effects.glass,
          transition: animations.transition.base,
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: effects.glow.md,
          },
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              '& fieldset': {
                borderColor: colors.primary.main,
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
          transition: animations.transition.fast,
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          ...effects.glass,
          fontSize: typography.sizes.sm,
          padding: '8px 12px',
        },
      },
    },
  },
} as ThemeOptions);

// Export a light theme option for future use
export const lightTheme = createTheme({
  ...darkTheme,
  palette: {
    mode: 'light',
    // Light theme overrides would go here
  },
});

export default darkTheme;