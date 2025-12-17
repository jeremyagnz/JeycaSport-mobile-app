import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { FAB, List, IconButton, useTheme, Searchbar } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import type { Team } from '../models/Team';
import type { RootStackParamList } from '../navigation/types';
import { loadData, saveData } from '../services/storage';
import { STORAGE_KEYS } from '../services/storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AdminTeamsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const paperTheme = useTheme<MD3Theme>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      const storedTeams = await loadData<Team[]>(STORAGE_KEYS.TEAMS);
      if (storedTeams && storedTeams.length > 0) {
        setTeams(storedTeams);
      } else {
        // Don't initialize with incomplete mock data - start with empty array
        setTeams([]);
      }
    } catch (error) {
      console.error('Error loading teams:', error);
      setTeams([]);
    }
  };

  const handleDeleteTeam = (teamId: string) => {
    Alert.alert('Delete Team', 'Are you sure you want to delete this team?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedTeams = teams.filter((t) => t.id !== teamId);
          setTeams(updatedTeams);
          await saveData(STORAGE_KEYS.TEAMS, updatedTeams);
        },
      },
    ]);
  };

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.abbreviation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTeam = ({ item }: { item: Team }) => (
    <List.Item
      title={item.name}
      description={`${item.abbreviation} - ${item.statistics ? `${item.statistics.wins}-${item.statistics.losses}` : 'No stats'}`}
      left={(props) => <List.Icon {...props} icon="shield-star" />}
      right={() => (
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => navigation.navigate('AdminEditTeam', { teamId: item.id })}
          />
          <IconButton
            icon="delete"
            size={20}
            iconColor={paperTheme.colors.error}
            onPress={() => handleDeleteTeam(item.id)}
          />
        </View>
      )}
    />
  );

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <Searchbar
        placeholder="Search teams..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
      />
      <FlatList
        data={filteredTeams}
        keyExtractor={(item) => item.id}
        renderItem={renderTeam}
        contentContainerStyle={styles.listContent}
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: paperTheme.colors.primary }]}
        onPress={() => navigation.navigate('AdminEditTeam', { teamId: undefined })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchbar: {
    margin: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.md,
    right: 0,
    bottom: 0,
  },
});
