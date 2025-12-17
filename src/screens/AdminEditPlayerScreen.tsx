import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, useTheme, ActivityIndicator } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { theme } from '../theme';
import type { Player, Position, BatSide, ThrowSide } from '../models/Player';
import type { RootStackParamList } from '../navigation/types';
import { loadData, saveData } from '../services/storage';
import { STORAGE_KEYS } from '../services/storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = NativeStackScreenProps<RootStackParamList, 'AdminEditPlayer'>['route'];

export const AdminEditPlayerScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const paperTheme = useTheme<MD3Theme>();
  const playerId = route.params?.playerId;
  const isEditing = !!playerId;

  const [name, setName] = useState('');
  const [number, setNumber] = useState('');
  const [position, setPosition] = useState<Position>('P');
  const [teamId, setTeamId] = useState('1');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bats, setBats] = useState<BatSide>('R');
  const [throws, setThrows] = useState<ThrowSide>('R');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (isEditing) {
      loadPlayer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId]);

  const loadPlayer = async () => {
    setIsLoadingData(true);
    try {
      const players = await loadData<Player[]>(STORAGE_KEYS.PLAYERS);
      const player = players?.find((p) => p.id === playerId);
      if (player) {
        setName(player.name);
        setNumber(player.number.toString());
        setPosition(player.position);
        setTeamId(player.teamId);
        setDateOfBirth(player.dateOfBirth);
        setHeight(player.height);
        setWeight(player.weight.toString());
        setBats(player.bats);
        setThrows(player.throws);
      }
    } catch (error) {
      console.error('Error loading player:', error);
      Alert.alert('Error', 'Failed to load player data');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !number.trim() || !teamId.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      const players = (await loadData<Player[]>(STORAGE_KEYS.PLAYERS)) || [];

      const playerData: Player = {
        id: isEditing ? playerId! : `player_${Date.now()}`,
        name: name.trim(),
        number: parseInt(number, 10),
        position,
        teamId,
        dateOfBirth,
        height,
        weight: parseInt(weight, 10) || 0,
        bats,
        throws,
      };

      let updatedPlayers: Player[];
      if (isEditing) {
        updatedPlayers = players.map((p) => (p.id === playerId ? playerData : p));
      } else {
        updatedPlayers = [...players, playerData];
      }

      await saveData(STORAGE_KEYS.PLAYERS, updatedPlayers);
      setIsLoading(false);
      Alert.alert('Success', `Player ${isEditing ? 'updated' : 'created'} successfully`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      setIsLoading(false);
      console.error('Error saving player:', error);
      Alert.alert('Error', 'Failed to save player. Please try again.');
    }
  };

  if (isLoadingData) {
    return (
      <View
        style={[
          styles.scrollView,
          styles.centered,
          { backgroundColor: paperTheme.colors.background },
        ]}
      >
        <ActivityIndicator size="large" color={paperTheme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: paperTheme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      <TextInput
        label="Player Name *"
        value={name}
        onChangeText={setName}
        mode="outlined"
        style={styles.input}
        disabled={isLoading}
      />
      <TextInput
        label="Jersey Number *"
        value={number}
        onChangeText={setNumber}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        disabled={isLoading}
      />
      <TextInput
        label="Position * (P, C, 1B, 2B, 3B, SS, LF, CF, RF, DH)"
        value={position}
        onChangeText={(text) => {
          const upperText = text.toUpperCase();
          const validPositions = ['P', 'C', '1B', '2B', '3B', 'SS', 'LF', 'CF', 'RF', 'DH'];
          if (validPositions.includes(upperText) || text === '') {
            setPosition(upperText as Position);
          }
        }}
        mode="outlined"
        style={styles.input}
        disabled={isLoading}
      />
      <TextInput
        label="Team ID *"
        value={teamId}
        onChangeText={setTeamId}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        disabled={isLoading}
      />
      <TextInput
        label="Date of Birth (YYYY-MM-DD)"
        value={dateOfBirth}
        onChangeText={setDateOfBirth}
        mode="outlined"
        style={styles.input}
        disabled={isLoading}
      />
      <TextInput
        label="Height (e.g., 6'2)"
        value={height}
        onChangeText={setHeight}
        mode="outlined"
        style={styles.input}
        disabled={isLoading}
      />
      <TextInput
        label="Weight (lbs)"
        value={weight}
        onChangeText={setWeight}
        mode="outlined"
        keyboardType="numeric"
        style={styles.input}
        disabled={isLoading}
      />
      <TextInput
        label="Bats (L/R/S)"
        value={bats}
        onChangeText={(text) => {
          const upperText = text.toUpperCase();
          if (['L', 'R', 'S'].includes(upperText) || text === '') {
            setBats(upperText as BatSide);
          }
        }}
        mode="outlined"
        maxLength={1}
        style={styles.input}
        disabled={isLoading}
      />
      <TextInput
        label="Throws (L/R)"
        value={throws}
        onChangeText={(text) => {
          const upperText = text.toUpperCase();
          if (['L', 'R'].includes(upperText) || text === '') {
            setThrows(upperText as ThrowSide);
          }
        }}
        mode="outlined"
        maxLength={1}
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
          {isEditing ? 'Update Player' : 'Create Player'}
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
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
