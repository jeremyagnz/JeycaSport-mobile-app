import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { Icon } from 'react-native-paper';
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

export const PlayerDetailScreen: React.FC = () => {
  const route = useRoute<PlayerDetailRouteProp>();
  const { playerId } = route.params;

  // Find player by ID
  const player = mockPlayers.find((p) => p.id === playerId);

  // Handle player not found
  if (!player) {
    return (
      <View style={styles.container}>
        <View style={styles.notFoundContainer}>
          <Icon source="account-alert" size={64} color={theme.colors.textSecondary} />
          <Text style={styles.notFoundTitle}>Player Not Found</Text>
          <Text style={styles.notFoundSubtitle}>The requested player could not be found.</Text>
        </View>
      </View>
    );
  }

  const age = calculateAge(player.dateOfBirth);
  const teamName = teamNames[player.teamId] || `Team #${player.teamId}`;
  const stats = player.statistics;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Player Header */}
      <View style={styles.header}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>#{player.number}</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.playerName}>{player.name}</Text>
          <View style={styles.headerDetails}>
            <View style={styles.detailItem}>
              <Icon source="shield-star" size={18} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>{player.position}</Text>
            </View>
            <View style={styles.detailItem}>
              <Icon source="account-group" size={18} color={theme.colors.textSecondary} />
              <Text style={styles.detailText}>{teamName}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Player Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Player Information</Text>
        <View style={styles.statsGrid}>
          <StatCard label="Age" value={age} subtitle="years" />
          <StatCard label="Height" value={player.height} />
          <StatCard label="Weight" value={`${player.weight} lbs`} />
          <StatCard
            label="Bats"
            value={player.bats}
            subtitle={player.bats === 'L' ? 'Left' : player.bats === 'R' ? 'Right' : 'Switch'}
          />
          <StatCard
            label="Throws"
            value={player.throws}
            subtitle={player.throws === 'L' ? 'Left' : 'Right'}
          />
        </View>
      </View>

      {/* Baseball Statistics Section */}
      {stats && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Batting Statistics</Text>
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
          {stats.wins !== undefined && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pitching Statistics</Text>
              <View style={styles.statsGrid}>
                <StatCard
                  label="ERA"
                  value={stats.era?.toFixed(2) || 'N/A'}
                  subtitle="Earned Run Average"
                />
                <StatCard
                  label="WHIP"
                  value={stats.whip?.toFixed(2) || 'N/A'}
                  subtitle="Walks + Hits/IP"
                />
                <StatCard label="W" value={stats.wins ?? 0} subtitle="Wins" />
                <StatCard label="L" value={stats.losses ?? 0} subtitle="Losses" />
              </View>
              <View style={styles.statsGrid}>
                <StatCard
                  label="IP"
                  value={stats.inningsPitched?.toFixed(1) || 'N/A'}
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
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  numberBadge: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  numberText: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background,
  },
  headerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
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
    color: theme.colors.textSecondary,
  },
  section: {
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
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
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  notFoundSubtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
