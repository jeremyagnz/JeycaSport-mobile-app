import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, FlatList, TextInput, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IconButton } from 'react-native-paper';
import { PlayerRow } from '../components/PlayerRow';
import { theme } from '../theme';
import type { Player } from '../models/Player';
import type { RootStackParamList } from '../navigation/types';
import { mockPlayers, teamNames } from '../constants/mockData';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

export const PlayersScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter players based on search query
  const filteredPlayers = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockPlayers;
    }

    const query = searchQuery.toLowerCase();
    return mockPlayers.filter(
      (player) =>
        player.name.toLowerCase().includes(query) ||
        player.position.toLowerCase().includes(query) ||
        teamNames[player.teamId]?.toLowerCase().includes(query)
    );
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
    ({ item }: { item: Player }) => {
      const teamName = teamNames[item.teamId];
      if (!teamName) {
        console.warn(`Player ${item.name} (${item.id}) has invalid teamId: ${item.teamId}`);
      }
      return (
        <PlayerRow
          name={item.name}
          position={item.position}
          team={teamName || `Team #${item.teamId}`}
          number={item.number}
          onPress={() => handlePlayerPress(item.id)}
        />
      );
    },
    [handlePlayerPress]
  );

  // Key extractor
  const keyExtractor = useCallback((item: Player) => item.id, []);

  // Empty list component
  const renderEmptyList = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <IconButton icon="account-search" size={64} iconColor={theme.colors.textSecondary} />
        <Text style={styles.emptyTitle}>No players found</Text>
        <Text style={styles.emptySubtitle}>
          Try adjusting your search to find what you're looking for
        </Text>
      </View>
    ),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <IconButton
          icon="magnify"
          size={24}
          iconColor={theme.colors.textSecondary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, position, or team..."
          placeholderTextColor={theme.colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <IconButton
            icon="close"
            size={20}
            iconColor={theme.colors.textSecondary}
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
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    margin: theme.spacing.md,
    paddingHorizontal: theme.spacing.xs,
  },
  searchIcon: {
    margin: 0,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
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
    color: theme.colors.text,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.xs,
  },
  emptySubtitle: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
});
