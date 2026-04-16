import { createTheme } from '@mui/material/styles';

/**
 * Curbside Design System — MUI v6 theme.
 * Derived from design-system.md §10.1. Call sites reference semantic theme
 * tokens only; no raw hex in components.
 *
 * With `cssVariables: true`, MUI injects `--mui-*` variables on `:root` and
 * ThemeProvider uses the CSS-variables pipeline. You can:
 * - Keep using `sx` with theme paths (`bgcolor: 'background.default'`).
 * - Use plain CSS, e.g. `color: var(--mui-palette-primary-main)`.
 * - Read tokens in JS via `useTheme()` — `theme.palette.*`, `theme.spacing(n)`.
 * - Spacing scale: import `space` or use `theme.space` (design-system §4.1); values are
 *   multipliers for `theme.spacing()` / numeric `sx` props (base `spacing: 8`).
 */

/* Neutral + brand scales — exported for call-sites that need tokens outside
   the core MUI palette (info/callout tints, border-strong, focus-ring, etc.). */
export const palette = {
  purple: {
    100: '#171320',
    200: '#2C263E',
    300: '#3E3063',
    400: '#4A4F9E', // primary.dark — hover / pressed
    500: '#5B5FBF', // primary.main — brand
    600: '#8A8FD9', // primary.light
    700: '#AEA0D1',
    800: '#D5D0E0', // focus ring fill
    900: '#F0F1FA', // subtle bg / outlined hover
  },
  neutral: {
    100: '#0F172A', // text.primary / bg inverse
    200: '#334155', // text.secondary
    300: '#64748B', // text.muted
    400: '#94A3B8', // text.disabled
    500: '#CBD5E1', // border.strong
    600: '#E2E8F0', // border.default
    700: '#F1F5F9', // border.subtle / bg.tertiary
    800: '#F8FAFC', // bg.secondary
    900: '#FFFFFF', // bg.primary
  },
  status: {
    successMain: '#386A20',
    successDark: '#2F591B',
    successTint: '#F6FAF4',
    infoMain: '#0061A4',
    infoDark: '#005088',
    infoTint: '#F1F9FE',
    warningMain: '#7D5700',
    warningDark: '#6B4A00',
    warningTint: '#FEFAF1',
    errorMain: '#B3261E',
    errorDark: '#911F18',
    errorTint: '#FCF4F3',
  },
  focusRing: '#D5D0E0',
  scrim: 'rgba(15, 23, 42, 0.5)',
} as const;

/* Icon size scale — design-system §9. Use via `sx={{ fontSize: icons.sm }}`. */
export const icons = {
  xs: 14, // inline in dense text
  sm: 16, // default in-button / web UI
  md: 20, // mobile default, header leading, nav
  lg: 24, // screen headers
  xl: 32, // empty states
} as const;

/* Layout constants expressed on the 8pt rhythm (design-system §4.1).
   Use `theme.spacing(layout.drawerWidthUnits)` to resolve to pixels. */
export const layout = {
  drawerWidthUnits: 35, // 280px sidebar
  avatarLgUnits: 10, // 80px avatar
  touchTargetUnits: 5.5, // 44pt WCAG 2.5.8 mobile touch target
} as const;

/**
 * Unified spacing scale — design-system §4.1. Values are **MUI spacing multipliers**
 * with `spacing: 8` (each unit = 8px). Use in `sx` as numbers, e.g.
 * `p: space[2]`, `gap: space['1.5']`, or `theme.spacing(space[2])`.
 */
export const space = {
  0: 0,
  '0.5': 0.5,
  1: 1,
  '1.5': 1.5,
  2: 2,
  '2.5': 2.5,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  10: 10,
} as const;

export type SpaceScale = typeof space;

export const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: 'light',
    primary: {
      main: palette.purple[500],
      dark: palette.purple[400],
      light: palette.purple[600],
      contrastText: palette.neutral[900],
    },
    secondary: {
      main: '#625B71',
      dark: '#504A5C',
      light: '#867E97',
      contrastText: palette.neutral[900],
    },
    success: {
      main: palette.status.successMain,
      dark: palette.status.successDark,
      light: '#5CAE35',
      contrastText: palette.neutral[900],
    },
    info: {
      main: palette.status.infoMain,
      dark: palette.status.infoDark,
      light: '#0092F7',
      contrastText: palette.neutral[900],
    },
    warning: {
      main: palette.status.warningMain,
      dark: palette.status.warningDark,
      light: '#D99700',
      contrastText: palette.neutral[900],
    },
    error: {
      main: palette.status.errorMain,
      dark: palette.status.errorDark,
      light: '#DE433A',
      contrastText: palette.neutral[900],
    },
    text: {
      primary: palette.neutral[100],
      secondary: palette.neutral[200],
      disabled: palette.neutral[400],
    },
    background: {
      default: palette.neutral[900],
      paper: palette.neutral[800],
    },
    divider: palette.neutral[600],
    action: {
      disabled: palette.neutral[400],
      disabledBackground: palette.neutral[600],
    },
  },
  shape: { borderRadius: 6 },
  spacing: 8,
  space,
  typography: {
    fontFamily: 'Lato, system-ui, -apple-system, "SF Pro Text", Roboto, sans-serif',
    htmlFontSize: 14,
    h1: { fontSize: 34, fontWeight: 400, lineHeight: 1.2 },
    h2: { fontSize: 28, fontWeight: 400, lineHeight: 1.25 },
    h3: { fontSize: 22, fontWeight: 400, lineHeight: 1.3 },
    h4: { fontSize: 18, fontWeight: 600, lineHeight: 1.35 },
    h5: { fontSize: 16, fontWeight: 600, lineHeight: 1.4 },
    h6: { fontSize: 14, fontWeight: 600, lineHeight: 1.4 },
    body1: { fontSize: 14, fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: 12, fontWeight: 400, lineHeight: 1.5 },
    subtitle1: { fontSize: 14, fontWeight: 600 },
    subtitle2: {
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      color: palette.neutral[300],
    },
    button: { fontSize: 13, fontWeight: 500, textTransform: 'none' },
    caption: { fontSize: 10, fontWeight: 400 },
    overline: {
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        // WCAG 2.3.3 / design-system.md §13
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            transitionDuration: '0.01ms !important',
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 6,
          minHeight: 32,
          padding: '0 12px',
          fontSize: 13,
          fontWeight: 500,
          borderWidth: 1,
          borderStyle: 'solid',
        },
        sizeSmall: { minHeight: 26, fontSize: 12 },
        sizeLarge: { minHeight: 40, fontSize: 14 },
        containedPrimary: {
          backgroundColor: palette.purple[500],
          borderColor: palette.purple[500],
          color: palette.neutral[900],
          '&:hover': {
            backgroundColor: palette.purple[400],
            borderColor: palette.purple[400],
          },
          '&.Mui-disabled': {
            backgroundColor: palette.neutral[600],
            borderColor: palette.neutral[600],
            color: palette.neutral[400],
          },
        },
        outlinedPrimary: {
          backgroundColor: 'transparent',
          borderColor: palette.purple[500],
          color: palette.purple[500],
          '&:hover': { backgroundColor: palette.purple[900] },
          '&.Mui-disabled': {
            borderColor: palette.neutral[600],
            color: palette.neutral[400],
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 6, width: 32, height: 32 },
        sizeSmall: { width: 26, height: 26 },
        sizeLarge: { width: 40, height: 40 },
      },
    },
    MuiTextField: {
      defaultProps: { fullWidth: true, size: 'small' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontSize: 13,
          backgroundColor: palette.neutral[900],
        },
        notchedOutline: { borderColor: palette.neutral[600] },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: { fontSize: 12, fontWeight: 500, color: palette.neutral[200] },
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: {
          borderRadius: 8,
          border: `1px solid ${palette.neutral[600]}`,
          boxShadow: 'none',
          backgroundColor: palette.neutral[900],
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: palette.neutral[500],
          '&.Mui-checked': { color: palette.purple[500] },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: palette.neutral[500],
          '&.Mui-checked': { color: palette.purple[500] },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': {
            color: palette.purple[500],
            '+ .MuiSwitch-track': { backgroundColor: palette.purple[500] },
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: { root: { minHeight: 40 } },
    },
    MuiTooltip: {
      defaultProps: { enterDelay: 300, arrow: true },
    },
  },
});
