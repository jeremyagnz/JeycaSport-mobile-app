import React, { useMemo } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';
import { theme } from '../theme';

interface PerformanceChartProps {
  data: { game: number; average: number }[];
  title?: string;
  height?: number;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  title = 'Batting Average Progression',
  height = 250,
}) => {
  const chartWidth = useMemo(() => {
    const screenWidth = Dimensions.get('window').width;
    return screenWidth - theme.spacing.md * 2;
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartWrapper}>
        <VictoryChart
          width={chartWidth}
          height={height}
          theme={VictoryTheme.material}
          padding={{
            top: theme.spacing.md,
            bottom: theme.spacing.xl,
            left: 50,
            right: theme.spacing.md,
          }}
        >
          <VictoryAxis
            label="Game"
            style={{
              axisLabel: {
                fontSize: theme.typography.fontSize.xs,
                padding: theme.spacing.lg,
                fill: theme.colors.textSecondary,
              },
              tickLabels: { fontSize: 10, fill: theme.colors.textSecondary },
              grid: { stroke: theme.colors.border, strokeWidth: 0.5 },
            }}
          />
          <VictoryAxis
            dependentAxis
            label="Batting Average"
            style={{
              axisLabel: {
                fontSize: theme.typography.fontSize.xs,
                padding: theme.spacing.xl,
                fill: theme.colors.textSecondary,
              },
              tickLabels: { fontSize: 10, fill: theme.colors.textSecondary },
              grid: { stroke: theme.colors.border, strokeWidth: 0.5 },
            }}
          />
          <VictoryLine
            data={data}
            x="game"
            y="average"
            style={{
              data: {
                stroke: theme.colors.primary,
                strokeWidth: 3,
              },
            }}
            interpolation="monotoneX"
          />
        </VictoryChart>
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
    marginBottom: theme.spacing.sm,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
