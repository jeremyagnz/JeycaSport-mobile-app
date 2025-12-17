import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../theme';
import type { Team } from '../models/Team';

// Mock team data for display
const mockTeams: Pick<Team, 'id' | 'name' | 'abbreviation' | 'statistics'>[] = [
  {
    id: '1',
    name: 'New York Yankees',
    abbreviation: 'NYY',
    statistics: { season: 2024, wins: 95, losses: 67, winPercentage: 0.586 } as Team['statistics'],
  },
  {
    id: '2',
    name: 'Los Angeles Dodgers',
    abbreviation: 'LAD',
    statistics: { season: 2024, wins: 98, losses: 64, winPercentage: 0.605 } as Team['statistics'],
  },
  {
    id: '3',
    name: 'Houston Astros',
    abbreviation: 'HOU',
    statistics: { season: 2024, wins: 90, losses: 72, winPercentage: 0.556 } as Team['statistics'],
  },
  {
    id: '4',
    name: 'Atlanta Braves',
    abbreviation: 'ATL',
    statistics: { season: 2024, wins: 92, losses: 70, winPercentage: 0.568 } as Team['statistics'],
  },
  {
    id: '5',
    name: 'Tampa Bay Rays',
    abbreviation: 'TB',
    statistics: { season: 2024, wins: 88, losses: 74, winPercentage: 0.543 } as Team['statistics'],
  },
  {
    id: '6',
    name: 'San Francisco Giants',
    abbreviation: 'SF',
    statistics: { season: 2024, wins: 85, losses: 77, winPercentage: 0.525 } as Team['statistics'],
  },
  {
    id: '7',
    name: 'Toronto Blue Jays',
    abbreviation: 'TOR',
    statistics: { season: 2024, wins: 87, losses: 75, winPercentage: 0.537 } as Team['statistics'],
  },
  {
    id: '8',
    name: 'Chicago White Sox',
    abbreviation: 'CWS',
    statistics: { season: 2024, wins: 72, losses: 90, winPercentage: 0.444 } as Team['statistics'],
  },
];

interface TeamRowProps {
  team: Pick<Team, 'id' | 'name' | 'abbreviation' | 'statistics'>;
  onPress?: () => void;
}

const TeamRow: React.FC<TeamRowProps> = ({ team, onPress }) => {
  const record = team.statistics ? `${team.statistics.wins}-${team.statistics.losses}` : 'N/A';

  return (
    <TouchableOpacity style={styles.teamRow} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>{team.abbreviation}</Text>
      </View>
      <View style={styles.teamInfo}>
        <Text style={styles.teamName}>{team.name}</Text>
        <Text style={styles.teamRecord}>Record: {record}</Text>
      </View>
    </TouchableOpacity>
  );
};

export const TeamsScreen: React.FC = () => {
  const handleTeamPress = (teamId: string) => {
    // TODO: Navigate to team detail screen
    console.log(`Team ${teamId} pressed`);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={mockTeams}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TeamRow team={item} onPress={() => handleTeamPress(item.id)} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  logoText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  teamRecord: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
