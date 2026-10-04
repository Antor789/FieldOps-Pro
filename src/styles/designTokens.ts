/**
 * FieldOps Pro - Enterprise Design System Tokens
 * Standardized Design Tokens for Bangladesh Enterprise Field Service Management Platform
 */

export const DESIGN_TOKENS = {
  // 1. Color Palette
  colors: {
    // Brand Primary (Enterprise Indigo)
    primary: {
      50: '#EEF2FF',
      100: '#E0E7FF',
      200: '#C7D2FE',
      300: '#A5B4FC',
      400: '#818CF8',
      500: '#6366F1',
      600: '#4F46E5', // Main Primary
      700: '#4338CA',
      800: '#3730A3',
      900: '#312E81',
      950: '#1E1B4B',
    },
    // Secondary / Slate Canvas & Neutrals
    slate: {
      50: '#F8FAFC',  // Light Mode Canvas
      100: '#F1F5F9', // Light Mode Sub-canvas / Inactive Tabs
      200: '#E2E8F0', // Light Mode Border
      300: '#CBD5E1', // Light Mode Divider
      400: '#94A3B8', // Muted Icons
      500: '#64748B', // Secondary Text
      600: '#475569', // Body Text
      700: '#334155', // Dark Mode Border
      800: '#1E293B', // Dark Mode Elevated Surface
      900: '#0F172A', // Dark Mode Card Surface
      950: '#090D16', // Dark Mode Deep Canvas
    },
    // Semantic Status Colors
    semantic: {
      // Success (Online, Completed, Paid)
      success: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        500: '#10B981',
        600: '#059669',
        700: '#047857',
      },
      // Warning / En Route / In Progress
      warning: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        200: '#FDE68A',
        500: '#F59E0B',
        600: '#D97706',
        700: '#B45309',
      },
      // Danger / Emergency / SLA Breach
      danger: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        200: '#FECACA',
        500: '#EF4444',
        600: '#DC2626',
        700: '#B91C1C',
      },
      // Info / GPS / Telemetry
      info: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
      },
      // Cyan / Field Techs
      tech: {
        50: '#ECFEFF',
        100: '#CFFAFE',
        500: '#06B6D4',
        600: '#0891B2',
      },
      // Purple / Multi-Tenant RLS
      tenant: {
        50: '#FAF5FF',
        100: '#F3E8FF',
        500: '#A855F7',
        600: '#9333EA',
      },
      // Localized MFS Brands (bKash & Nagad)
      mfs: {
        bkash: '#E2136E',
        nagad: '#F7941D',
        upay: '#005CA9',
        sslCommerz: '#204066',
      }
    }
  },

  // 2. Typography Scale
  typography: {
    fontFamily: {
      sans: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
      mono: "'JetBrains Mono', monospace",
    },
    scale: {
      display: { size: '2rem', lineHeight: '2.5rem', weight: '800' },     // 32px
      h1: { size: '1.5rem', lineHeight: '2rem', weight: '700' },           // 24px
      h2: { size: '1.25rem', lineHeight: '1.75rem', weight: '700' },       // 20px
      h3: { size: '1rem', lineHeight: '1.5rem', weight: '600' },           // 16px
      body: { size: '0.875rem', lineHeight: '1.25rem', weight: '400' },    // 14px
      small: { size: '0.75rem', lineHeight: '1rem', weight: '500' },       // 12px
      caption: { size: '0.6875rem', lineHeight: '0.875rem', weight: '600' },// 11px
      micro: { size: '0.625rem', lineHeight: '0.75rem', weight: '700' },   // 10px
    }
  },

  // 3. Spacing System (4px base grid)
  spacing: {
    0.5: '2px',
    1: '4px',
    1.5: '6px',
    2: '8px',
    2.5: '10px',
    3: '12px',
    3.5: '14px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
  },

  // 4. Border Radius Standards
  radius: {
    xs: '4px',
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
  },

  // 5. Elevation / Shadow System
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
    glowPrimary: '0 0 20px -5px rgba(79, 70, 229, 0.35)',
    glowEmerald: '0 0 20px -5px rgba(16, 185, 129, 0.35)',
    glowCrimson: '0 0 20px -5px rgba(239, 68, 68, 0.35)',
  },

  // 6. Responsive Breakpoints
  breakpoints: {
    mobile: '320px - 767px',
    tablet: '768px - 1023px',
    desktop: '1024px - 1439px',
    large: '1440px+',
  },
};
