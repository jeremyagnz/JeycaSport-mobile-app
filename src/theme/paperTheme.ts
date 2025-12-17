import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';

/**
 * React Native Paper theme configurations
 * Includes both light and dark mode themes that adapt to system preference
 */

export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#002D62', // MLB navy blue
    secondary: '#BA0C2F', // Baseball red
    tertiary: '#2D7F3E', // Baseball field green
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceVariant: '#E5E7EB',
    onPrimary: '#FFFFFF',
    onSecondary: '#FFFFFF',
    onBackground: '#1A1A1A',
    onSurface: '#1A1A1A',
    onSurfaceVariant: '#6B7280',
    error: '#BA0C2F',
    onError: '#FFFFFF',
    outline: '#E5E7EB',
    elevation: {
      level0: 'transparent',
      level1: '#F9FAFB',
      level2: '#F3F4F6',
      level3: '#E5E7EB',
      level4: '#D1D5DB',
      level5: '#9CA3AF',
    },
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#60A5FA', // Lighter blue for dark mode
    secondary: '#F87171', // Lighter red for dark mode
    tertiary: '#4ADE80', // Lighter green for dark mode
    background: '#0F172A', // Dark slate
    surface: '#1E293B',
    surfaceVariant: '#334155',
    onPrimary: '#000000',
    onSecondary: '#000000',
    onBackground: '#F1F5F9',
    onSurface: '#F1F5F9',
    onSurfaceVariant: '#94A3B8',
    error: '#F87171',
    onError: '#000000',
    outline: '#475569',
    elevation: {
      level0: 'transparent',
      level1: '#1E293B',
      level2: '#334155',
      level3: '#475569',
      level4: '#64748B',
      level5: '#94A3B8',
    },
  },
};
