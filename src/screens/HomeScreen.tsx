import React from 'react';
import { StyleSheet, View, ScrollView, useColorScheme } from 'react-native';
import { Card, Title, Paragraph, IconButton, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { theme } from '../theme';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface NavigationCardProps {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}

const NavigationCard: React.FC<NavigationCardProps> = ({ title, description, icon, onPress }) => {
  const paperTheme = useTheme<MD3Theme>();

  return (
    <Card style={[styles.card, { backgroundColor: paperTheme.colors.surface }]} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <IconButton icon={icon} size={40} iconColor={paperTheme.colors.primary} />
          <View style={styles.cardTextContainer}>
            <Title style={[styles.cardTitle, { color: paperTheme.colors.onSurface }]}>{title}</Title>
            <Paragraph style={[styles.cardDescription, { color: paperTheme.colors.onSurfaceVariant }]}>
              {description}
            </Paragraph>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const paperTheme = useTheme<MD3Theme>();
  const colorScheme = useColorScheme();

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: paperTheme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Title style={[styles.title, { color: paperTheme.colors.primary }]}>
          Welcome to JeycaSports
        </Title>
        <Paragraph style={[styles.subtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
          Your complete baseball statistics tracking application
        </Paragraph>
      </View>

      <View style={styles.cardsContainer}>
        <NavigationCard
          title="Teams"
          description="View and manage baseball teams"
          icon="shield-star"
          onPress={() => navigation.navigate('Teams')}
        />
        <NavigationCard
          title="Players"
          description="Browse player profiles and stats"
          icon="account-group"
          onPress={() => navigation.navigate('Players')}
        />
        <NavigationCard
          title="Statistics"
          description="Analyze team and player performance"
          icon="chart-bar"
          onPress={() => navigation.navigate('Stats')}
        />
      </View>

      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
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
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  cardsContainer: {
    gap: theme.spacing.md,
  },
  card: {
    elevation: 2,
  },
  cardContent: {
    paddingVertical: theme.spacing.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.fontSize.sm,
  },
});
