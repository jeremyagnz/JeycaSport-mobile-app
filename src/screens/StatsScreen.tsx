import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { theme } from '../theme';
import { mockPlayers } from '../constants/mockData';
import type { Player } from '../models/Player';

type StatCategory = 'AVG' | 'OPS' | 'ERA';

interface StatLeader extends Player {
  statValue: number;
  rank: number;
}

export const StatsScreen: React.FC = () => {
  const paperTheme = useTheme<MD3Theme>();
  const [selectedCategory, setSelectedCategory] = useState<StatCategory>('AVG');

  // Calculate stat leaders based on selected category
  const statLeaders = useMemo((): StatLeader[] => {
    const playersWithStats = mockPlayers.filter((p) => p.statistics);

    let sorted: StatLeader[];

    switch (selectedCategory) {
      case 'AVG':
        // Batting Average - higher is better
        sorted = playersWithStats
          .filter((p) => p.statistics && p.statistics.battingAverage > 0)
          .map((p) => ({
            ...p,
            statValue: p.statistics!.battingAverage,
            rank: 0,
          }))
          .sort((a, b) => b.statValue - a.statValue);
        break;

      case 'OPS':
        // On-base Plus Slugging - higher is better
        sorted = playersWithStats
          .filter((p) => p.statistics && p.statistics.ops > 0)
          .map((p) => ({
            ...p,
            statValue: p.statistics!.ops,
            rank: 0,
          }))
          .sort((a, b) => b.statValue - a.statValue);
        break;

      case 'ERA':
        // Earned Run Average - lower is better (for pitchers only)
        sorted = playersWithStats
          .filter((p) => p.statistics && p.statistics.era && p.statistics.era > 0)
          .map((p) => ({
            ...p,
            statValue: p.statistics!.era!,
            rank: 0,
          }))
          .sort((a, b) => a.statValue - b.statValue);
        break;

      default:
        sorted = [];
    }

    // Add rank numbers
    return sorted.map((player, index) => ({
      ...player,
      rank: index + 1,
    }));
  }, [selectedCategory]);

  // Render category selector button
  const renderCategoryButton = (category: StatCategory, label: string) => {
    const isActive = selectedCategory === category;
    return (
      <TouchableOpacity
        style={[
          styles.categoryButton,
          { backgroundColor: isActive ? paperTheme.colors.primary : paperTheme.colors.surface },
        ]}
        onPress={() => setSelectedCategory(category)}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.categoryButtonText,
            { color: isActive ? paperTheme.colors.onPrimary : paperTheme.colors.onSurface },
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  // Render stat leader row
  const renderStatLeader = ({ item }: { item: StatLeader }) => (
    <View style={[styles.statRow, { backgroundColor: paperTheme.colors.surface }]}>
      <Text style={[styles.rankText, { color: paperTheme.colors.onSurface }]}>{item.rank}</Text>
      <View style={styles.playerInfo}>
        <Text style={[styles.playerName, { color: paperTheme.colors.onSurface }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.playerPosition, { color: paperTheme.colors.onSurfaceVariant }]}>
          {item.position}
        </Text>
      </View>
      <View style={styles.statValueContainer}>
        <Text style={[styles.statValue, { color: paperTheme.colors.primary }]}>
          {selectedCategory === 'AVG'
            ? item.statValue.toFixed(3)
            : selectedCategory === 'OPS'
              ? item.statValue.toFixed(3)
              : item.statValue.toFixed(2)}
        </Text>
        {selectedCategory === 'AVG' && item.statistics && (
          <Text style={[styles.statDetail, { color: paperTheme.colors.onSurfaceVariant }]}>
            {item.statistics.hits}/{item.statistics.atBats}
          </Text>
        )}
        {selectedCategory === 'OPS' && item.statistics && (
          <Text style={[styles.statDetail, { color: paperTheme.colors.onSurfaceVariant }]}>
            OBP: {item.statistics.onBasePercentage.toFixed(3)}
          </Text>
        )}
        {selectedCategory === 'ERA' && item.statistics && (
          <Text style={[styles.statDetail, { color: paperTheme.colors.onSurfaceVariant }]}>
            {item.statistics.inningsPitched?.toFixed(1)} IP
          </Text>
        )}
      </View>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: paperTheme.colors.onSurfaceVariant }]}>
        No {selectedCategory === 'ERA' ? 'pitching' : 'batting'} statistics available
      </Text>
    </View>
  );

  // Render header
  const renderHeader = () => (
    <View style={[styles.tableHeader, { backgroundColor: paperTheme.colors.background }]}>
      <Text style={[styles.headerRank, { color: paperTheme.colors.onSurfaceVariant }]}>Rank</Text>
      <Text style={[styles.headerPlayer, { color: paperTheme.colors.onSurfaceVariant }]}>Player</Text>
      <Text style={[styles.headerStat, { color: paperTheme.colors.onSurfaceVariant }]}>
        {selectedCategory}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: paperTheme.colors.onBackground }]}>League Leaders</Text>
        <Text style={[styles.subtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
          Top performers by statistical category
        </Text>
      </View>

      {/* Category Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {renderCategoryButton('AVG', 'Batting Average')}
        {renderCategoryButton('OPS', 'On-Base + Slugging')}
        {renderCategoryButton('ERA', 'ERA (Pitchers)')}
      </ScrollView>

      {/* Stats Table */}
      <FlatList
        data={statLeaders}
        renderItem={renderStatLeader}
        keyExtractor={(item) => `${item.id}-${selectedCategory}`}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        stickyHeaderIndices={[0]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
  },
  categoryContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: 20,
    marginRight: theme.spacing.sm,
    elevation: 2,
  },
  categoryButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    borderBottomWidth: 2,
    marginBottom: theme.spacing.xs,
  },
  headerRank: {
    width: 50,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  headerPlayer: {
    flex: 1,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    textTransform: 'uppercase',
  },
  headerStat: {
    width: 100,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    elevation: 2,
  },
  rankText: {
    width: 50,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
  },
  playerInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  playerName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: 2,
  },
  playerPosition: {
    fontSize: theme.typography.fontSize.xs,
  },
  statValueContainer: {
    width: 100,
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
  },
  statDetail: {
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
  },
});
