import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

interface ChartProps {
  title: string;
  data?: number[];
  labels?: string[];
}

export const Chart: React.FC<ChartProps> = ({ title, data = [], labels = [] }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartArea}>
        <Text style={styles.placeholder}>Chart visualization</Text>
        <Text style={styles.info}>
          Data points: {data.length} | Labels: {labels.length}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  chartArea: {
    height: 200,
    backgroundColor: theme.colors.background,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  placeholder: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  info: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
