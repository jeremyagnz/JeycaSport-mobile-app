import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { FAB, List, IconButton, useTheme, Searchbar, ActivityIndicator } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import type { Team } from '../models/Team';
import type { RootStackParamList } from '../navigation/types';
import { loadData, saveData } from '../services/storage';
import { STORAGE_KEYS } from '../services/storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Delay to ensure previous Alert is dismissed before showing the next one
const ALERT_DISMISS_DELAY = 100;

export const AdminTeamsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const paperTheme = useTheme<MD3Theme>();
  const [teams, setTeams] = useState<Team[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadTeams = async () => {
    setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadTeams();
    }, [])
  );

  const handleDeleteTeam = (teamId: string, teamName: string) => {
    Alert.alert('Delete Team', `Are you sure you want to delete ${teamName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          try {
            const updatedTeams = teams.filter((t) => t.id !== teamId);
            await saveData(STORAGE_KEYS.TEAMS, updatedTeams);
            setTeams(updatedTeams);
            setIsDeleting(false);
            // Use setTimeout to ensure the previous Alert is dismissed before showing the next one
            setTimeout(() => {
              Alert.alert('Success', `${teamName} has been deleted successfully`);
            }, ALERT_DISMISS_DELAY);
          } catch (error) {
            setIsDeleting(false);
            console.error('Error deleting team:', error);
            setTimeout(() => {
              Alert.alert('Error', 'Failed to delete team. Please try again.');
            }, ALERT_DISMISS_DELAY);
          }
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
            disabled={isDeleting}
          />
          <IconButton
            icon="delete"
            size={20}
            iconColor={paperTheme.colors.error}
            onPress={() => handleDeleteTeam(item.id, item.name)}
            disabled={isDeleting}
          />
        </View>
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
      <Searchbar
        placeholder="Search teams..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        editable={!isDeleting}
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
        disabled={isDeleting}
      />
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
