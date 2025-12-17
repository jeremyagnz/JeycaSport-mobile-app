import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, FlatList, TextInput, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IconButton, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { PlayerRow } from '../components/PlayerRow';
import { theme } from '../theme';
import type { Player } from '../models/Player';
import type { RootStackParamList } from '../navigation/types';
import { mockPlayers, teamNames } from '../constants/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Pre-compute lowercase values for efficient searching
const searchablePlayersData = mockPlayers.map((player) => ({
  player,
  searchText: `${player.name} ${player.position} ${teamNames[player.teamId] || ''}`.toLowerCase(),
}));

// Validate data consistency on component mount
const invalidPlayers = mockPlayers.filter((player) => !teamNames[player.teamId]);
if (invalidPlayers.length > 0) {
  console.warn(
    `Found ${invalidPlayers.length} player(s) with invalid team IDs:`,
    invalidPlayers.map((p) => ({ id: p.id, name: p.name, teamId: p.teamId }))
  );
}

export const PlayersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const paperTheme = useTheme<MD3Theme>();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter players based on search query
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockPlayers;
    }

    const query = searchQuery.toLowerCase();
    return searchablePlayersData
      .filter((item) => item.searchText.includes(query))
      .map((item) => item.player);
  }, [searchQuery]);

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
