import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Card, Title, Paragraph, IconButton } from 'react-native-paper';
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
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <IconButton icon={icon} size={40} iconColor={theme.colors.primary} />
          <View style={styles.cardTextContainer}>
            <Title style={styles.cardTitle}>{title}</Title>
            <Paragraph style={styles.cardDescription}>{description}</Paragraph>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Title style={styles.title}>Welcome to JeycaSports</Title>
        <Paragraph style={styles.subtitle}>
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

      <StatusBar style="light" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background,
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
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.md,
  },
  cardsContainer: {
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
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
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  cardDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textSecondary,
  },
});
