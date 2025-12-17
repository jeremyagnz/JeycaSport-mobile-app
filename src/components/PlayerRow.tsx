import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { IconButton } from 'react-native-paper';
import { theme } from '../theme';

interface PlayerRowProps {
  name: string;
  position: string;
  team: string;
  number: number;
  onPress?: () => void;
}

export const PlayerRow: React.FC<PlayerRowProps> = ({ name, position, team, number, onPress }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.numberContainer}>
        <Text style={styles.number}>#{number}</Text>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{name}</Text>
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <IconButton
              icon="shield-star"
              size={16}
              iconColor={theme.colors.textSecondary}
              style={styles.icon}
            />
            <Text style={styles.position}>{position}</Text>
          </View>
          <View style={styles.detailItem}>
            <IconButton
              icon="account-group"
              size={16}
              iconColor={theme.colors.textSecondary}
              style={styles.icon}
            />
            <Text style={styles.team}>{team}</Text>
          </View>
        </View>
      </View>
      <IconButton
        icon="chevron-right"
        size={24}
        iconColor={theme.colors.textSecondary}
        style={styles.chevron}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    padding: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
  },
  numberContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  number: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.background,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text,
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
  },
  icon: {
    margin: 0,
    padding: 0,
  },
  position: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: -8,
  },
  team: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
    marginLeft: -8,
  },
  chevron: {
    margin: 0,
  },
});
