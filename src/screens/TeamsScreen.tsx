import React from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { theme } from '../theme';
import type { Team } from '../models/Team';
import { mockTeams } from '../constants/mockData';

interface TeamRowProps {
  team: Pick<Team, 'id' | 'name' | 'abbreviation' | 'statistics'>;
  onPress?: () => void;
}

const TeamRow: React.FC<TeamRowProps> = ({ team, onPress }) => {
  const paperTheme = useTheme<MD3Theme>();
  const record = team.statistics ? `${team.statistics.wins}-${team.statistics.losses}` : 'N/A';

  return (
    <TouchableOpacity
      style={[styles.teamRow, { backgroundColor: paperTheme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.logoContainer, { backgroundColor: paperTheme.colors.primary }]}>
        <Text style={[styles.logoText, { color: paperTheme.colors.onPrimary }]}>
          {team.abbreviation}
        </Text>
      </View>
      <View style={styles.teamInfo}>
        <Text style={[styles.teamName, { color: paperTheme.colors.onSurface }]}>{team.name}</Text>
        <Text style={[styles.teamRecord, { color: paperTheme.colors.onSurfaceVariant }]}>
          Record: {record}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export const TeamsScreen: React.FC = () => {
  const paperTheme = useTheme<MD3Theme>();

  const handleTeamPress = (teamId: string) => {
    console.log(`Team ${teamId} pressed`);
  };

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
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
  },
  listContent: {
    padding: theme.spacing.md,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: 8,
    marginBottom: theme.spacing.sm,
    elevation: 2,
  },
  logoContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  logoText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  teamRecord: {
    fontSize: theme.typography.fontSize.sm,
  },
});
