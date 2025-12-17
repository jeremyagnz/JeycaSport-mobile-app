import React, { useState, useMemo, useCallback } from 'react';
import { StyleSheet, View, FlatList, TextInput, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { IconButton } from 'react-native-paper';
import { PlayerRow } from '../components/PlayerRow';
import { theme } from '../theme';
import type { Player } from '../models/Player';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Mock player data for display
const mockPlayers: Player[] = [
  {
    id: '1',
    name: 'Aaron Judge',
    number: 99,
    position: 'RF',
    teamId: '1',
    dateOfBirth: '1992-04-26',
    height: '6\'7"',
    weight: 282,
    bats: 'R',
    throws: 'R',
  },
  {
    id: '2',
    name: 'Shohei Ohtani',
    number: 17,
    position: 'P',
    teamId: '2',
    dateOfBirth: '1994-07-05',
    height: '6\'4"',
    weight: 210,
    bats: 'L',
    throws: 'R',
  },
  {
    id: '3',
    name: 'Mookie Betts',
    number: 50,
    position: 'RF',
    teamId: '2',
    dateOfBirth: '1992-10-07',
    height: '5\'9"',
    weight: 180,
    bats: 'R',
    throws: 'R',
  },
  {
    id: '4',
    name: 'Jose Altuve',
    number: 27,
    position: '2B',
    teamId: '3',
    dateOfBirth: '1990-05-06',
    height: '5\'6"',
    weight: 166,
    bats: 'R',
    throws: 'R',
  },
  {
    id: '5',
    name: 'Ronald Acuña Jr.',
    number: 13,
    position: 'RF',
    teamId: '4',
    dateOfBirth: '1997-12-18',
    height: '6\'0"',
    weight: 205,
    bats: 'R',
    throws: 'R',
  },
  {
    id: '6',
    name: 'Freddie Freeman',
    number: 5,
    position: '1B',
    teamId: '2',
    dateOfBirth: '1989-09-12',
    height: '6\'5"',
    weight: 220,
    bats: 'L',
    throws: 'R',
  },
  {
    id: '7',
    name: 'Randy Arozarena',
    number: 56,
    position: 'LF',
    teamId: '5',
    dateOfBirth: '1995-02-28',
    height: '5\'11"',
    weight: 185,
    bats: 'R',
    throws: 'R',
  },
  {
    id: '8',
    name: 'Brandon Crawford',
    number: 35,
    position: 'SS',
    teamId: '6',
    dateOfBirth: '1987-01-21',
    height: '6\'2"',
    weight: 223,
    bats: 'L',
    throws: 'R',
  },
  {
    id: '9',
    name: 'Vladimir Guerrero Jr.',
    number: 27,
    position: '1B',
    teamId: '7',
    dateOfBirth: '1999-03-16',
    height: '6\'2"',
    weight: 250,
    bats: 'R',
    throws: 'R',
  },
  {
    id: '10',
    name: 'Tim Anderson',
    number: 7,
    position: 'SS',
    teamId: '8',
    dateOfBirth: '1993-06-23',
    height: '6\'1"',
    weight: 185,
    bats: 'R',
    throws: 'R',
  },
];

// Team name mapping
const teamNames: Record<string, string> = {
  '1': 'New York Yankees',
  '2': 'Los Angeles Dodgers',
  '3': 'Houston Astros',
  '4': 'Atlanta Braves',
  '5': 'Tampa Bay Rays',
  '6': 'San Francisco Giants',
  '7': 'Toronto Blue Jays',
  '8': 'Chicago White Sox',
};

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
    ({ item }: { item: Player }) => (
      <PlayerRow
        name={item.name}
        position={item.position}
        team={teamNames[item.teamId] || 'Unknown Team'}
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
