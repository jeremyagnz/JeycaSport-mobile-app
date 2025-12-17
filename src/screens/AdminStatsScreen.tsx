import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList } from 'react-native';
import {
  List,
  IconButton,
  useTheme,
  Searchbar,
  SegmentedButtons,
  ActivityIndicator,
} from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import type { Player } from '../models/Player';
import type { Team } from '../models/Team';
import type { RootStackParamList } from '../navigation/types';
import { loadData } from '../services/storage';
import { STORAGE_KEYS } from '../services/storage';
import { mockPlayers, teamNames } from '../constants/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AdminStatsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const paperTheme = useTheme<MD3Theme>();
  const [viewMode, setViewMode] = useState('players');
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadEntities = async () => {
    setIsLoading(true);
    try {
      const storedPlayers = await loadData<Player[]>(STORAGE_KEYS.PLAYERS);
      const storedTeams = await loadData<Team[]>(STORAGE_KEYS.TEAMS);

      setPlayers(storedPlayers || mockPlayers);
      setTeams(storedTeams || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setPlayers(mockPlayers);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntities();
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadEntities();
    }, [])
  );

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPlayer = ({ item }: { item: Player }) => (
    <List.Item
      title={item.name}
      description={`${item.position} - ${teamNames[item.teamId] || 'Unknown Team'} - ${item.statistics ? `AVG: ${item.statistics.battingAverage.toFixed(3)}` : 'No stats'}`}
      left={(props) => <List.Icon {...props} icon="account" />}
      right={() => (
        <IconButton
          icon="pencil"
          size={20}
          onPress={() =>
            navigation.navigate('AdminEditStats', { entityId: item.id, entityType: 'player' })
          }
        />
      )}
    />
  );

  const renderTeam = ({ item }: { item: Team }) => (
    <List.Item
      title={item.name}
      description={`${item.abbreviation} - ${item.statistics ? `${item.statistics.wins}-${item.statistics.losses}` : 'No stats'}`}
      left={(props) => <List.Icon {...props} icon="shield-star" />}
      right={() => (
        <IconButton
          icon="pencil"
          size={20}
          onPress={() =>
            navigation.navigate('AdminEditStats', { entityId: item.id, entityType: 'team' })
          }
        />
      )}
    />
  );

  if (isLoading) {
    return (
      <View
        style={[
          styles.container,
          styles.centered,
          { backgroundColor: paperTheme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <SegmentedButtons
        value={viewMode}
        onValueChange={setViewMode}
        buttons={[
          { value: 'players', label: 'Players' },
          { value: 'teams', label: 'Teams' },
        ]}
        style={styles.segmented}
      />
      <Searchbar
        placeholder={`Search ${viewMode}...`}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      {viewMode === 'players' ? (
        <FlatList
          data={filteredPlayers}
          keyExtractor={(item) => item.id}
          renderItem={renderPlayer}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={filteredTeams}
          keyExtractor={(item) => item.id}
          renderItem={renderTeam}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  segmented: {
    margin: theme.spacing.md,
  },
  searchbar: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
});
