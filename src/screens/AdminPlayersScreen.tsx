import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Alert } from 'react-native';
import { FAB, List, IconButton, useTheme, Searchbar, ActivityIndicator } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { theme } from '../theme';
import type { Player } from '../models/Player';
import type { RootStackParamList } from '../navigation/types';
import { loadData, saveData } from '../services/storage';
import { STORAGE_KEYS } from '../services/storage';
import { mockPlayers, teamNames } from '../constants/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const AdminPlayersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const paperTheme = useTheme<MD3Theme>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPlayers = async () => {
    setIsLoading(true);
    try {
      const storedPlayers = await loadData<Player[]>(STORAGE_KEYS.PLAYERS);
      if (storedPlayers && storedPlayers.length > 0) {
        setPlayers(storedPlayers);
      } else {
        // Initialize with mock data
        await saveData(STORAGE_KEYS.PLAYERS, mockPlayers);
        setPlayers(mockPlayers);
      }
    } catch (error) {
      console.error('Error loading players:', error);
      setPlayers(mockPlayers);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  // Reload data when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      loadPlayers();
    }, [])
  );

  const handleDeletePlayer = (playerId: string, playerName: string) => {
    Alert.alert('Delete Player', `Are you sure you want to delete ${playerName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);
          try {
            const updatedPlayers = players.filter((p) => p.id !== playerId);
            await saveData(STORAGE_KEYS.PLAYERS, updatedPlayers);
            setPlayers(updatedPlayers);
            Alert.alert('Success', `${playerName} has been deleted successfully`);
          } catch (error) {
            Alert.alert('Error', 'Failed to delete player. Please try again.');
            console.error('Error deleting player:', error);
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (teamNames[player.teamId] || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderPlayer = ({ item }: { item: Player }) => (
    <List.Item
      title={item.name}
      description={`#${item.number} - ${item.position} - ${teamNames[item.teamId] || 'Unknown Team'}`}
      left={(props) => <List.Icon {...props} icon="account" />}
      right={() => (
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={() => navigation.navigate('AdminEditPlayer', { playerId: item.id })}
            disabled={isDeleting}
          />
          <IconButton
            icon="delete"
            size={20}
            iconColor={paperTheme.colors.error}
            onPress={() => handleDeletePlayer(item.id, item.name)}
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
        placeholder="Search players..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchbar}
        editable={!isDeleting}
      />
      <FlatList
        data={filteredPlayers}
        keyExtractor={(item) => item.id}
        renderItem={renderPlayer}
        contentContainerStyle={styles.listContent}
      />
      <FAB
        icon="plus"
        style={[styles.fab, { backgroundColor: paperTheme.colors.primary }]}
        onPress={() => navigation.navigate('AdminEditPlayer', { playerId: undefined })}
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
