import React from 'react';
import { StyleSheet, View, ScrollView, Alert } from 'react-native';
import { Card, Title, Paragraph, IconButton, Button, useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAuth } from '../contexts';
import { theme } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface AdminCardProps {
  title: string;
  description: string;
  icon: string;
  onPress: () => void;
}

const AdminCard: React.FC<AdminCardProps> = ({ title, description, icon, onPress }) => {
  const paperTheme = useTheme<MD3Theme>();

  return (
    <Card style={[styles.card, { backgroundColor: paperTheme.colors.surface }]} onPress={onPress}>
      <Card.Content style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <IconButton icon={icon} size={40} iconColor={paperTheme.colors.primary} />
          <View style={styles.cardTextContainer}>
            <Title style={[styles.cardTitle, { color: paperTheme.colors.onSurface }]}>
              {title}
            </Title>
            <Paragraph
              style={[styles.cardDescription, { color: paperTheme.colors.onSurfaceVariant }]}
            >
              {description}
            </Paragraph>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

export const AdminDashboardScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const paperTheme = useTheme<MD3Theme>();
  const { admin, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          navigation.navigate('Home');
        },
      },
    ]);
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: paperTheme.colors.background }]}
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Title style={[styles.title, { color: paperTheme.colors.primary }]}>Admin Dashboard</Title>
        <Paragraph style={[styles.subtitle, { color: paperTheme.colors.onSurfaceVariant }]}>
          Welcome, {admin?.username || 'Admin'}
        </Paragraph>
      </View>

      <View style={styles.cardsContainer}>
        <AdminCard
          title="Manage Players"
          description="Create, edit, and delete player profiles"
          icon="account-group"
          onPress={() => navigation.navigate('AdminPlayers')}
        />
        <AdminCard
          title="Manage Teams"
          description="Create, edit, and delete team information"
          icon="shield-star"
          onPress={() => navigation.navigate('AdminTeams')}
        />
        <AdminCard
          title="Manage Statistics"
          description="Update player and team statistics"
          icon="chart-bar"
          onPress={() => navigation.navigate('AdminStats')}
        />
      </View>

      <View style={styles.actions}>
        <Button mode="outlined" onPress={() => navigation.navigate('Home')} style={styles.button}>
          Back to Home
        </Button>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.button}
          buttonColor={paperTheme.colors.error}
        >
          Logout
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
    marginBottom: theme.spacing.xl,
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
  actions: {
    gap: theme.spacing.md,
  },
  button: {
    paddingVertical: theme.spacing.xs,
  },
});
