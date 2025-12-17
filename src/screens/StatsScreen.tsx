import React, { useState, useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { theme } from '../theme';
import { mockPlayers } from '../constants/mockData';
import type { Player } from '../models/Player';

type StatCategory = 'AVG' | 'OPS' | 'ERA';

interface StatLeader extends Player {
  statValue: number;
  rank: number;
}

export const StatsScreen: React.FC = () => {
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
  const renderCategoryButton = (category: StatCategory, label: string) => (
    <TouchableOpacity
      style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
      onPress={() => setSelectedCategory(category)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.categoryButtonText,
          selectedCategory === category && styles.categoryButtonTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  // Render stat leader row
  const renderStatLeader = ({ item }: { item: StatLeader }) => (
    <View style={styles.statRow}>
      <Text style={styles.rankText}>{item.rank}</Text>
      <View style={styles.playerInfo}>
        <Text style={styles.playerName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.playerPosition}>{item.position}</Text>
      </View>
      <View style={styles.statValueContainer}>
        <Text style={styles.statValue}>
          {selectedCategory === 'AVG'
            ? item.statValue.toFixed(3)
            : selectedCategory === 'OPS'
              ? item.statValue.toFixed(3)
              : item.statValue.toFixed(2)}
        </Text>
        {selectedCategory === 'AVG' && item.statistics && (
          <Text style={styles.statDetail}>
            {item.statistics.hits}/{item.statistics.atBats}
          </Text>
        )}
        {selectedCategory === 'OPS' && item.statistics && (
          <Text style={styles.statDetail}>OBP: {item.statistics.onBasePercentage.toFixed(3)}</Text>
        )}
        {selectedCategory === 'ERA' && item.statistics && (
          <Text style={styles.statDetail}>{item.statistics.inningsPitched?.toFixed(1)} IP</Text>
        )}
      </View>
    </View>
  );

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No {selectedCategory === 'ERA' ? 'pitching' : 'batting'} statistics available
      </Text>
    </View>
  );

  // Render header
  const renderHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={styles.headerRank}>Rank</Text>
      <Text style={styles.headerPlayer}>Player</Text>
      <Text style={styles.headerStat}>{selectedCategory}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>League Leaders</Text>
        <Text style={styles.subtitle}>Top performers by statistical category</Text>
      </View>

      {/* Category Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {renderCategoryButton('AVG', 'Batting Average')}
        {renderCategoryButton('OPS', 'On-Base + Slugging')}
        {renderCategoryButton('ERA', 'Earned Run Avg')}
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
    backgroundColor: theme.colors.background,
  },
  titleContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
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
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  categoryButtonText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
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
    backgroundColor: theme.colors.background,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
    marginBottom: theme.spacing.xs,
  },
  headerRank: {
    width: 50,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  headerPlayer: {
    flex: 1,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },
  headerStat: {
    width: 100,
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    textAlign: 'right',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rankText: {
    width: 50,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    textAlign: 'center',
  },
  playerInfo: {
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  playerName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: 2,
  },
  playerPosition: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
  },
  statValueContainer: {
    width: 100,
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
  },
  statDetail: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  emptyContainer: {
    paddingVertical: theme.spacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
