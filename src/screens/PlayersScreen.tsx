import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { StyleSheet, View, FlatList, TextInput, Text } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IconButton, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { PlayerRow } from '../components/PlayerRow';
import { theme } from '../theme';
import type { Player } from '../models/Player';
import type { RootStackParamList } from '../navigation/types';
import { mockPlayers, teamNames } from '../constants/mockData';
import { loadData } from '../services/storage';
import { STORAGE_KEYS } from '../services/storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PlayersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const paperTheme = useTheme<MD3Theme>();
  const [searchQuery, setSearchQuery] = useState('');
  const [players, setPlayers] = useState<Player[]>(mockPlayers);

  const loadPlayers = async () => {
    try {
      const storedPlayers = await loadData<Player[]>(STORAGE_KEYS.PLAYERS);
      if (storedPlayers && storedPlayers.length > 0) {
        setPlayers(storedPlayers);
      } else {
        // Use mock players if no stored players
        setPlayers(mockPlayers);
      }
    } catch (error) {
      console.error('Error loading players:', error);
      setPlayers(mockPlayers);
    }
  };

  useEffect(() => {
    loadPlayers();
  }, []);

  // Reload players when screen comes into focus (after returning from admin panel)
  useFocusEffect(
    React.useCallback(() => {
      loadPlayers();
    }, [])
  );

  // Filter players based on search query
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) {
      return players;
    }

    const query = searchQuery.toLowerCase();
    return players.filter((player) => {
      const searchText =
        `${player.name} ${player.position} ${teamNames[player.teamId] || ''}`.toLowerCase();
      return searchText.includes(query);
    });
  }, [searchQuery, players]);

  // Handle player press
  const handlePlayerPress = useCallback(
    (playerId: string) => {
      navigation.navigate('PlayerDetail', { playerId });
    },
    [navigation]
  );

  // Render player item
  const renderPlayer = useCallback(
    ({ item }: { item: Player }) => (
      <PlayerRow
        name={item.name}
        position={item.position}
        team={teamNames[item.teamId] || `Team #${item.teamId}`}
        number={item.number}
        onPress={() => handlePlayerPress(item.id)}
      />
    ),
    [handlePlayerPress]
  );

  // Key extractor
  const keyExtractor = useCallback((item: Player) => item.id, []);

  // Empty list component
  const renderEmptyList = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <IconButton
          icon="account-search"
          size={64}
          iconColor={paperTheme.colors.onSurfaceVariant}
        />
        <Text style={[styles.emptyTitle, { color: paperTheme.colors.onSurface }]}>
          No players found
        </Text>
        <Text style={[styles.emptySubtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
          Try adjusting your search to find what you're looking for
        </Text>
      </View>
    ),
    [paperTheme]
  );

  return (
    <View style={[styles.container, { backgroundColor: paperTheme.colors.background }]}>
      <View style={[styles.searchContainer, { backgroundColor: paperTheme.colors.surface }]}>
        <IconButton
          icon="magnify"
          size={24}
          iconColor={paperTheme.colors.onSurfaceVariant}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: paperTheme.colors.onSurface }]}
          placeholder="Search by name, position, or team..."
          placeholderTextColor={paperTheme.colors.onSurfaceVariant}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <IconButton
            icon="close"
            size={20}
            iconColor={paperTheme.colors.onSurfaceVariant}
            onPress={() => setSearchQuery('')}
            style={styles.clearIcon}
          />
        )}
      </View>
      <FlatList
        data={filteredPlayers}
        keyExtractor={keyExtractor}
        renderItem={renderPlayer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
    elevation: 2,
  },
  searchIcon: {
    margin: 0,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: theme.typography.fontSize.md,
    paddingHorizontal: theme.spacing.xs,
  },
  clearIcon: {
    margin: 0,
  },
  listContent: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.sm,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
