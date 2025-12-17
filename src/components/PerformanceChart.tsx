import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryAxis } from 'victory-native';
import { theme } from '../theme';

interface PerformanceChartProps {
  data: { game: number; average: number }[];
  title?: string;
}

export const PerformanceChart: React.FC<PerformanceChartProps> = ({
  data,
  title = 'Batting Average Progression',
}) => {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - theme.spacing.md * 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.chartWrapper}>
        <VictoryChart
          width={chartWidth}
          height={250}
          theme={VictoryTheme.material}
          padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
        >
          <VictoryAxis
            label="Game"
            style={{
              axisLabel: { fontSize: 12, padding: 30, fill: theme.colors.textSecondary },
              tickLabels: { fontSize: 10, fill: theme.colors.textSecondary },
              grid: { stroke: theme.colors.border, strokeWidth: 0.5 },
            }}
          />
          <VictoryAxis
            dependentAxis
            label="Batting Average"
            style={{
              axisLabel: { fontSize: 12, padding: 40, fill: theme.colors.textSecondary },
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
