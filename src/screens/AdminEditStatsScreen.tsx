import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { TextInput, Button, useTheme, Title } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { theme } from '../theme';
import type { Player, PlayerStatistics } from '../models/Player';
import type { Team, TeamStatistics } from '../models/Team';
import type { RootStackParamList } from '../navigation/types';
import { loadData, saveData } from '../services/storage';
import { STORAGE_KEYS } from '../services/storage';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type RouteProps = NativeStackScreenProps<RootStackParamList, 'AdminEditStats'>['route'];

export const AdminEditStatsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteProps>();
  const paperTheme = useTheme<MD3Theme>();
  const { entityId, entityType } = route.params;

  const [entityName, setEntityName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Player batting stats
  const [gamesPlayed, setGamesPlayed] = useState('0');
  const [atBats, setAtBats] = useState('0');
  const [hits, setHits] = useState('0');
  const [homeRuns, setHomeRuns] = useState('0');
  const [rbi, setRbi] = useState('0');
  const [battingAverage, setBattingAverage] = useState('0.000');

  // Team stats
  const [wins, setWins] = useState('0');
  const [losses, setLosses] = useState('0');
  const [runsScored, setRunsScored] = useState('0');
  const [runsAllowed, setRunsAllowed] = useState('0');

  useEffect(() => {
    loadEntity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entityId, entityType]);

  const loadEntity = async () => {
    try {
      if (entityType === 'player') {
        const players = await loadData<Player[]>(STORAGE_KEYS.PLAYERS);
        const player = players?.find((p) => p.id === entityId);
        if (player) {
          setEntityName(player.name);
          if (player.statistics) {
            setGamesPlayed(player.statistics.gamesPlayed.toString());
            setAtBats(player.statistics.atBats.toString());
            setHits(player.statistics.hits.toString());
            setHomeRuns(player.statistics.homeRuns.toString());
            setRbi(player.statistics.rbi.toString());
            setBattingAverage(player.statistics.battingAverage.toFixed(3));
          }
        }
      } else {
        const teams = await loadData<Team[]>(STORAGE_KEYS.TEAMS);
        const team = teams?.find((t) => t.id === entityId);
        if (team) {
          setEntityName(team.name);
          if (team.statistics) {
            setWins(team.statistics.wins.toString());
            setLosses(team.statistics.losses.toString());
            setRunsScored(team.statistics.runsScored.toString());
            setRunsAllowed(team.statistics.runsAllowed.toString());
          }
        }
      }
    } catch (error) {
      console.error('Error loading entity:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      if (entityType === 'player') {
        const players = (await loadData<Player[]>(STORAGE_KEYS.PLAYERS)) || [];
        const updatedPlayers = players.map((player) => {
          if (player.id === entityId) {
            const statistics: PlayerStatistics = {
              gamesPlayed: parseInt(gamesPlayed, 10) || 0,
              atBats: parseInt(atBats, 10) || 0,
              runs: 0,
              hits: parseInt(hits, 10) || 0,
              doubles: 0,
              triples: 0,
              homeRuns: parseInt(homeRuns, 10) || 0,
              rbi: parseInt(rbi, 10) || 0,
              walks: 0,
              strikeouts: 0,
              stolenBases: 0,
              caughtStealing: 0,
              hitByPitch: 0,
              sacrificeFlies: 0,
              battingAverage: parseFloat(battingAverage) || 0,
              onBasePercentage: 0,
              sluggingPercentage: 0,
              ops: 0,
            };
            return { ...player, statistics };
          }
          return player;
        });
        await saveData(STORAGE_KEYS.PLAYERS, updatedPlayers);
      } else {
        const teams = (await loadData<Team[]>(STORAGE_KEYS.TEAMS)) || [];
        const updatedTeams = teams.map((team) => {
          if (team.id === entityId) {
            const winsNum = parseInt(wins, 10) || 0;
            const lossesNum = parseInt(losses, 10) || 0;
            const totalGames = winsNum + lossesNum;
            const statistics: TeamStatistics = {
              season: 2024,
              wins: winsNum,
              losses: lossesNum,
              winPercentage: totalGames > 0 ? winsNum / totalGames : 0,
              gamesBack: 0,
              runsScored: parseInt(runsScored, 10) || 0,
              runsAllowed: parseInt(runsAllowed, 10) || 0,
              runDifferential: (parseInt(runsScored, 10) || 0) - (parseInt(runsAllowed, 10) || 0),
              teamBattingAverage: 0,
              teamOnBasePercentage: 0,
              teamSluggingPercentage: 0,
              teamHomeRuns: 0,
              teamStolenBases: 0,
              teamERA: 0,
              teamWHIP: 0,
              teamStrikeouts: 0,
              teamSaves: 0,
              fieldingPercentage: 0,
              errors: 0,
              doublePlays: 0,
            };
            return { ...team, statistics };
          }
          return team;
        });
        await saveData(STORAGE_KEYS.TEAMS, updatedTeams);
      }

      Alert.alert('Success', 'Statistics updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      Alert.alert('Error', 'Failed to update statistics');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: paperTheme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      <Title style={[styles.title, { color: paperTheme.colors.primary }]}>
        {entityName} - Statistics
      </Title>

      {entityType === 'player' ? (
        <>
          <TextInput
            label="Games Played"
            value={gamesPlayed}
            onChangeText={setGamesPlayed}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            disabled={isLoading}
          />
          <TextInput
            label="At Bats"
            value={atBats}
            onChangeText={setAtBats}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            disabled={isLoading}
          />
          <TextInput
            label="Hits"
            value={hits}
            onChangeText={setHits}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            disabled={isLoading}
          />
          <TextInput
            label="Home Runs"
            value={homeRuns}
            onChangeText={setHomeRuns}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            disabled={isLoading}
          />
          <TextInput
            label="RBI"
            value={rbi}
            onChangeText={setRbi}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            disabled={isLoading}
          />
          <TextInput
            label="Batting Average"
            value={battingAverage}
            onChangeText={setBattingAverage}
            mode="outlined"
            keyboardType="decimal-pad"
            style={styles.input}
            disabled={isLoading}
          />
        </>
      ) : (
        <>
          <TextInput
            label="Wins"
            value={wins}
            onChangeText={setWins}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            disabled={isLoading}
          />
          <TextInput
            label="Losses"
            value={losses}
            onChangeText={setLosses}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            disabled={isLoading}
          />
          <TextInput
            label="Runs Scored"
            value={runsScored}
            onChangeText={setRunsScored}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            disabled={isLoading}
          />
          <TextInput
            label="Runs Allowed"
            value={runsAllowed}
            onChangeText={setRunsAllowed}
            mode="outlined"
            keyboardType="numeric"
            style={styles.input}
            disabled={isLoading}
          />
        </>
      )}

      <View style={styles.actions}>
        <Button
          mode="contained"
          onPress={handleSave}
          loading={isLoading}
          disabled={isLoading}
          style={styles.button}
        >
          Update Statistics
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
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
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
