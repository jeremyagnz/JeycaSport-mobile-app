import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { IconButton, Icon, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { theme } from '../theme';

// Icon constants for consistent usage
const ICONS = {
  POSITION: 'shield-star',
  TEAM: 'account-group',
  CHEVRON: 'chevron-right',
} as const;

interface PlayerRowProps {
  name: string;
  position: string;
  team: string;
  number: number;
  onPress?: () => void;
}

export const PlayerRow: React.FC<PlayerRowProps> = ({ name, position, team, number, onPress }) => {
  const paperTheme = useTheme<MD3Theme>();

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: paperTheme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.numberContainer, { backgroundColor: paperTheme.colors.primary }]}>
        <Text style={[styles.number, { color: paperTheme.colors.onPrimary }]}>#{number}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={[styles.name, { color: paperTheme.colors.onSurface }]}>{name}</Text>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Icon source={ICONS.POSITION} size={16} color={paperTheme.colors.onSurfaceVariant} />
            <Text style={[styles.position, { color: paperTheme.colors.onSurfaceVariant }]}>
              {position}
            </Text>
          </View>
          <View style={styles.detailItem}>
            <Icon source={ICONS.TEAM} size={16} color={paperTheme.colors.onSurfaceVariant} />
            <Text style={[styles.team, { color: paperTheme.colors.onSurfaceVariant }]}>{team}</Text>
          </View>
        </View>
      </View>
      <IconButton
        icon={ICONS.CHEVRON}
        size={24}
        iconColor={paperTheme.colors.onSurfaceVariant}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderRadius: 8,
    marginBottom: theme.spacing.sm,
    elevation: 2,
  },
  numberContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  number: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    marginBottom: theme.spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  position: {
    fontSize: theme.typography.fontSize.sm,
  },
  team: {
    fontSize: theme.typography.fontSize.sm,
  },
  chevron: {
    margin: 0,
  },
});
