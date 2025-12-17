import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { useTheme } from 'react-native-paper';
import type { MD3Theme } from 'react-native-paper';
import { theme } from '../theme';
import {
  HomeScreen,
  TeamsScreen,
  PlayersScreen,
  PlayerDetailScreen,
  StatsScreen,
  AdminLoginScreen,
  AdminDashboardScreen,
  AdminPlayersScreen,
  AdminEditPlayerScreen,
  AdminTeamsScreen,
  AdminEditTeamScreen,
  AdminStatsScreen,
  AdminEditStatsScreen,
} from '../screens';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * AppNavigator - Main navigation component for the app
 * Stack navigator with 5 screens: Home, Teams, Players, PlayerDetail, Stats
 * Automatically adapts to system theme preference
 */
export const AppNavigator: React.FC = () => {
  const paperTheme = useTheme<MD3Theme>();

  const defaultScreenOptions: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor: paperTheme.colors.primary,
    },
    headerTintColor: paperTheme.colors.onPrimary,
    headerTitleStyle: {
      fontWeight: theme.typography.fontWeight.bold,
      fontSize: theme.typography.fontSize.lg,
    },
    animation: 'slide_from_right',
    contentStyle: {
      backgroundColor: paperTheme.colors.background,
    },
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={defaultScreenOptions}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'JeycaSports',
            headerShown: true,
          }}
        />
        <Stack.Screen
          name="Teams"
          component={TeamsScreen}
          options={{
            title: 'Teams',
          }}
        />
        <Stack.Screen
          name="Players"
          component={PlayersScreen}
          options={{
            title: 'Players',
          }}
        />
        <Stack.Screen
          name="PlayerDetail"
          component={PlayerDetailScreen}
          options={{
            title: 'Player Details',
          }}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            title: 'Statistics',
          }}
        />
        <Stack.Screen
          name="AdminLogin"
          component={AdminLoginScreen}
          options={{
            title: 'Admin Login',
          }}
        />
        <Stack.Screen
          name="AdminDashboard"
          component={AdminDashboardScreen}
          options={{
            title: 'Admin Dashboard',
          }}
        />
        <Stack.Screen
          name="AdminPlayers"
          component={AdminPlayersScreen}
          options={{
            title: 'Manage Players',
          }}
        />
        <Stack.Screen
          name="AdminEditPlayer"
          component={AdminEditPlayerScreen}
          options={{
            title: 'Edit Player',
          }}
        />
        <Stack.Screen
          name="AdminTeams"
          component={AdminTeamsScreen}
          options={{
            title: 'Manage Teams',
          }}
        />
        <Stack.Screen
          name="AdminEditTeam"
          component={AdminEditTeamScreen}
          options={{
            title: 'Edit Team',
          }}
        />
        <Stack.Screen
          name="AdminStats"
          component={AdminStatsScreen}
          options={{
            title: 'Manage Statistics',
          }}
        />
        <Stack.Screen
          name="AdminEditStats"
          component={AdminEditStatsScreen}
          options={{
            title: 'Edit Statistics',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
