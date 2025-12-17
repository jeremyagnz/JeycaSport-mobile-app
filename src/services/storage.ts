/**
 * Local storage service for persisting data
 * Uses AsyncStorage for React Native
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Player } from '../models/Player';

export interface StorageService {
  setItem: (key: string, value: string) => Promise<void>;
  getItem: (key: string) => Promise<string | null>;
  removeItem: (key: string) => Promise<void>;
  clear: () => Promise<void>;
}

// Storage keys constants
export const STORAGE_KEYS = {
  PLAYERS: '@players',
  TEAMS: '@teams',
  STATS: '@stats',
  USER_PREFERENCES: '@user_preferences',
} as const;

/**
 * Save players to local storage
 * @param players - Array of Player objects to save
 * @throws {Error} If saving fails or JSON serialization fails
 */
export const savePlayers = async (players: Player[]): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(players);
    await AsyncStorage.setItem(STORAGE_KEYS.PLAYERS, jsonValue);
    console.log(`Successfully saved ${players.length} players to storage`);
  } catch (error) {
    console.error('Error saving players:', error);
    if (error instanceof Error) {
      throw new Error(`Failed to save players: ${error.message}`);
    }
    throw new Error('Failed to save players: Unknown error');
  }
};

/**
 * Get players from local storage
 * @returns Array of Player objects or null if not found
 * @throws {Error} If loading fails or JSON parsing fails
 */
export const getPlayers = async (): Promise<Player[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEYS.PLAYERS);

    if (jsonValue === null) {
      console.log('No players found in storage');
      return null;
    }

    const players: Player[] = JSON.parse(jsonValue);
    console.log(`Successfully loaded ${players.length} players from storage`);
    return players;
  } catch (error) {
    console.error('Error loading players:', error);
    if (error instanceof SyntaxError) {
      throw new Error('Failed to parse players data: Invalid JSON format');
    }
    if (error instanceof Error) {
      throw new Error(`Failed to load players: ${error.message}`);
    }
    throw new Error('Failed to load players: Unknown error');
  }
};

/**
 * Save data to local storage
 */
export const saveData = async <T>(key: string, data: T): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(key, jsonValue);
    console.log(`Data saved for key: ${key}`);
  } catch (error) {
    console.error('Error saving data:', error);
    throw error;
  }
};

/**
 * Load data from local storage
 */
export const loadData = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error loading data:', error);
    throw error;
  }
};

/**
 * Remove data from local storage
 */
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
    console.log(`Data removed for key: ${key}`);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

/**
 * Clear all data from local storage
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
    console.log('All data cleared');
  } catch (error) {
    console.error('Error clearing data:', error);
    throw error;
  }
};
