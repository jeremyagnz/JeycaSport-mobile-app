import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { theme } from '../theme';
import type { Team } from '../models/Team';
import type { RootStackParamList } from '../navigation/types';
import { loadData, saveData } from '../services/storage';
import { STORAGE_KEYS } from '../services/storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = NativeStackScreenProps<RootStackParamList, 'AdminEditTeam'>['route'];

export const AdminEditTeamScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const paperTheme = useTheme<MD3Theme>();
  const teamId = route.params?.teamId;
  const isEditing = !!teamId;

  const [name, setName] = useState('');
  const [abbreviation, setAbbreviation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadTeam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId]);

  const loadTeam = async () => {
    try {
      const teams = await loadData<Team[]>(STORAGE_KEYS.TEAMS);
      const team = teams?.find((t) => t.id === teamId);
      if (team) {
        setName(team.name);
        setAbbreviation(team.abbreviation);
      }
    } catch (error) {
      console.error('Error loading team:', error);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !abbreviation.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const teams = (await loadData<Team[]>(STORAGE_KEYS.TEAMS)) || [];

      let updatedTeams: Team[];
      if (isEditing) {
        updatedTeams = teams.map((t) => {
          if (t.id === teamId) {
            return {
              ...t,
              name: name.trim(),
              abbreviation: abbreviation.trim().toUpperCase(),
            };
          }
          return t;
        });
      } else {
        // Create a new team with all required fields
        const newTeam: Team = {
          id: `team_${Date.now()}`,
          name: name.trim(),
          abbreviation: abbreviation.trim().toUpperCase(),
          city: 'Unknown',
          state: 'Unknown',
          league: 'AL',
          division: 'East',
          founded: new Date().getFullYear(),
          stadium: {
            name: 'Stadium',
            capacity: 0,
            surface: 'Grass',
            yearOpened: new Date().getFullYear(),
          },
          colors: {
            primary: '#000000',
            secondary: '#FFFFFF',
          },
        };
        updatedTeams = [...teams, newTeam];
      }

      await saveData(STORAGE_KEYS.TEAMS, updatedTeams);
      Alert.alert('Success', `Team ${isEditing ? 'updated' : 'created'} successfully`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to save team');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: paperTheme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      <TextInput
        label="Team Name *"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        disabled={isLoading}
      />
      <TextInput
        label="Abbreviation *"
        value={abbreviation}
        onChangeText={setAbbreviation}
        mode="outlined"
        maxLength={3}
        autoCapitalize="characters"
        style={styles.input}
        disabled={isLoading}
      />

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          {isEditing ? 'Update Team' : 'Create Team'}
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          disabled={isLoading}
          style={styles.button}
        >
          Cancel
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    padding: theme.spacing.lg,
  },
  input: {
    marginBottom: theme.spacing.md,
  },
  actions: {
    gap: theme.spacing.md,
    marginTop: theme.spacing.lg,
  },
  button: {
    paddingVertical: theme.spacing.xs,
  },
});
