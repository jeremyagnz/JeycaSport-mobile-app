import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Icon, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { theme } from '../theme';
import { StatCard } from '../components/StatCard';
import { mockPlayers, teamNames } from '../constants/mockData';
import type { RootStackParamList } from '../navigation/types';

type PlayerDetailRouteProp = RouteProp<RootStackParamList, 'PlayerDetail'>;

// Helper function to calculate age from date of birth
const calculateAge = (dateOfBirth: string): number => {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// Helper function to get batting side description
const getBatSideDescription = (batSide: string): string => {
  if (batSide === 'L') return 'Left';
  if (batSide === 'R') return 'Right';
  return 'Switch';
};

// Helper function to get throwing side description
const getThrowSideDescription = (throwSide: string): string => {
  return throwSide === 'L' ? 'Left' : 'Right';
};

export const PlayerDetailScreen: React.FC = () => {
  const route = useRoute<PlayerDetailRouteProp>();
  const paperTheme = useTheme<MD3Theme>();
  const { playerId } = route.params;

  // Find player by ID
  const player = mockPlayers.find((p) => p.id === playerId);

  // Handle player not found
  if (!player) {
    return (
      <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
        <View style={styles.notFoundContainer}>
          <Icon source="account-alert" size={64} color={paperTheme.colors.onSurfaceVariant} />
          <Text style={[styles.notFoundTitle, { color: paperTheme.colors.onSurface }]}>
            Player Not Found
          </Text>
          <Text style={[styles.notFoundSubtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
            The requested player could not be found.
          </Text>
        </View>
      </View>
    );
  }

  const age = calculateAge(player.dateOfBirth);
  const teamName = teamNames[player.teamId] || `Team #${player.teamId}`;
  const stats = player.statistics;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: paperTheme.colors.background }]}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Player Header */}
      <View style={[styles.header, { backgroundColor: paperTheme.colors.surface }]}>
        <View style={[styles.numberBadge, { backgroundColor: paperTheme.colors.primary }]}>
          <Text style={[styles.numberText, { color: paperTheme.colors.onPrimary }]}>
            #{player.number}
          </Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.playerName, { color: paperTheme.colors.onSurface }]}>
            {player.name}
          </Text>
          <View style={styles.headerDetails}>
            <View style={styles.detailItem}>
              <Icon source="shield-star" size={18} color={paperTheme.colors.onSurfaceVariant} />
              <Text style={[styles.detailText, { color: paperTheme.colors.onSurfaceVariant }]}>
                {player.position}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Icon source="account-group" size={18} color={paperTheme.colors.onSurfaceVariant} />
              <Text style={[styles.detailText, { color: paperTheme.colors.onSurfaceVariant }]}>
                {teamName}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Player Information Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: paperTheme.colors.onBackground }]}>
          Player Information
        </Text>
        <View style={styles.statsGrid}>
          <StatCard label="Age" value={age} subtitle="years" />
          <StatCard label="Height" value={player.height} />
          <StatCard label="Weight" value={`${player.weight} lbs`} />
          <StatCard
            label="Bats"
            value={player.bats}
            subtitle={getBatSideDescription(player.bats)}
          />
          <StatCard
            label="Throws"
            value={player.throws}
            subtitle={getThrowSideDescription(player.throws)}
          />
        </View>
      </View>

      {/* Baseball Statistics Section */}
      {stats && (
        <>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: paperTheme.colors.onBackground }]}>
              Batting Statistics
            </Text>
            <View style={styles.statsGrid}>
              <StatCard
                label="AVG"
                value={stats.battingAverage.toFixed(3)}
                subtitle="Batting Average"
              />
              <StatCard
                label="OBP"
                value={stats.onBasePercentage.toFixed(3)}
                subtitle="On-Base %"
              />
              <StatCard
                label="SLG"
                value={stats.sluggingPercentage.toFixed(3)}
                subtitle="Slugging %"
              />
              <StatCard label="OPS" value={stats.ops.toFixed(3)} subtitle="On-Base + Slugging" />
            </View>
            <View style={styles.statsGrid}>
              <StatCard label="GP" value={stats.gamesPlayed} subtitle="Games Played" />
              <StatCard label="AB" value={stats.atBats} subtitle="At Bats" />
              <StatCard label="R" value={stats.runs} subtitle="Runs" />
              <StatCard label="H" value={stats.hits} subtitle="Hits" />
            </View>
            <View style={styles.statsGrid}>
              <StatCard label="2B" value={stats.doubles} subtitle="Doubles" />
              <StatCard label="3B" value={stats.triples} subtitle="Triples" />
              <StatCard label="HR" value={stats.homeRuns} subtitle="Home Runs" />
              <StatCard label="RBI" value={stats.rbi} subtitle="Runs Batted In" />
            </View>
            <View style={styles.statsGrid}>
              <StatCard label="BB" value={stats.walks} subtitle="Walks" />
              <StatCard label="SO" value={stats.strikeouts} subtitle="Strikeouts" />
              <StatCard label="SB" value={stats.stolenBases} subtitle="Stolen Bases" />
              <StatCard label="CS" value={stats.caughtStealing} subtitle="Caught Stealing" />
            </View>
          </View>

          {/* Pitching Statistics (if available) */}
          {stats.wins !== undefined &&
            stats.losses !== undefined &&
            stats.inningsPitched !== undefined && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: paperTheme.colors.onBackground }]}>
                  Pitching Statistics
                </Text>
                <View style={styles.statsGrid}>
                  <StatCard
                    label="ERA"
                    value={stats.era?.toFixed(2) ?? 'N/A'}
                    subtitle="Earned Run Average"
                  />
                  <StatCard
                    label="WHIP"
                    value={stats.whip?.toFixed(2) ?? 'N/A'}
                    subtitle="Walks + Hits/IP"
                  />
                  <StatCard label="W" value={stats.wins} subtitle="Wins" />
                  <StatCard label="L" value={stats.losses} subtitle="Losses" />
                </View>
                <View style={styles.statsGrid}>
                  <StatCard
                    label="IP"
                    value={stats.inningsPitched.toFixed(1)}
                    subtitle="Innings Pitched"
                  />
                  <StatCard label="K" value={stats.strikeoutsRecorded ?? 0} subtitle="Strikeouts" />
                  <StatCard label="BB" value={stats.walksAllowed ?? 0} subtitle="Walks Allowed" />
                  <StatCard label="H" value={stats.hitsAllowed ?? 0} subtitle="Hits Allowed" />
                </View>
              </View>
            )}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: 12,
    marginBottom: theme.spacing.md,
    elevation: 3,
  },
  numberBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  numberText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
  },
  headerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  headerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.typography.fontSize.sm,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  notFoundTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  notFoundSubtitle: {
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
  },
});
