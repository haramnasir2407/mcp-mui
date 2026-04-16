import type { SpaceScale } from './theme';

declare module '@mui/material/styles' {
  interface Theme {
    space: SpaceScale;
  }
  interface ThemeOptions {
    space?: SpaceScale;
  }
}

export {};
