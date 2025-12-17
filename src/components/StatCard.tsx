import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { theme } from '../theme';

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, subtitle }) => {
  const paperTheme = useTheme<MD3Theme>();

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.surface }]}>
      <Text style={[styles.label, { color: paperTheme.colors.onSurfaceVariant }]}>{label}</Text>
      <Text style={[styles.value, { color: paperTheme.colors.onSurface }]}>{value}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    borderRadius: 8,
    minWidth: 100,
    elevation: 2,
  },
  label: {
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing.xs,
  },
  value: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.xs,
  },
});
