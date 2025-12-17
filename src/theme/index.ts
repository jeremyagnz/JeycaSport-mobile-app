import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export * from './colors';
export * from './spacing';
export * from './typography';
export * from './paperTheme';

export const theme = {
  colors,
  spacing,
  typography,
} as const;

export type Theme = typeof theme;
