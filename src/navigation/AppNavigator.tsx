import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { theme } from '../theme';
import {
  HomeScreen,
  TeamsScreen,
  PlayersScreen,
  PlayerDetailScreen,
  StatsScreen,
} from '../screens';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Default header styles using the global theme
 * Mobile optimized with consistent styling across all screens
 */
const defaultScreenOptions: NativeStackNavigationOptions = {
  headerStyle: {
    backgroundColor: theme.colors.primary,
  },
  headerTintColor: theme.colors.background,
  headerTitleStyle: {
    fontWeight: theme.typography.fontWeight.bold,
    fontSize: theme.typography.fontSize.lg,
  },
  animation: 'slide_from_right',
  contentStyle: {
    backgroundColor: theme.colors.background,
  },
};

/**
 * AppNavigator - Main navigation component for the app
 * Stack navigator with 5 screens: Home, Teams, Players, PlayerDetail, Stats
 */
export const AppNavigator: React.FC = () => {
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};
