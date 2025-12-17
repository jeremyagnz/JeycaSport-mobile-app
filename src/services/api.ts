/**
 * API service for fetching data from remote servers
 * Provides functions to interact with baseball statistics API
 */

import type { Player, PlayerStatistics } from '../models/Player';
import type { Team, TeamStatistics } from '../models/Team';

// Base API configuration
const API_BASE_URL = process.env.API_BASE_URL || 'https://api.example.com';
const API_TIMEOUT = 10000; // 10 seconds

export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Generic fetch wrapper with error handling
 */
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
): Promise<Response> => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

/**
 * Handle API response
 */
const handleResponse = async <T>(response: Response): Promise<ApiResponse<T>> => {
  if (!response.ok) {
    const error: ApiError = {
      message: `API Error: ${response.statusText}`,
      status: response.status,
    };
    throw error;
  }

  const data = await response.json();
  return {
    data,
    status: response.status,
  };
};

/**
 * Fetch all teams
 */
export const fetchTeams = async (): Promise<ApiResponse<Team[]>> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/teams`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

/**
 * Fetch all players
 */
export const fetchPlayers = async (teamId?: string): Promise<ApiResponse<Player[]>> => {
  try {
    const url = teamId ? `${API_BASE_URL}/players?teamId=${teamId}` : `${API_BASE_URL}/players`;
    const response = await fetchWithTimeout(url);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

/**
 * Fetch player details by ID
 */
export const fetchPlayerById = async (playerId: string): Promise<ApiResponse<Player>> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/players/${playerId}`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching player details:', error);
    throw error;
  }
};

/**
 * Fetch player statistics
 */
export const fetchPlayerStats = async (
  playerId: string
): Promise<ApiResponse<PlayerStatistics>> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/players/${playerId}/stats`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching player stats:', error);
    throw error;
  }
};

/**
 * Fetch team statistics
 */
export const fetchTeamStats = async (teamId: string): Promise<ApiResponse<TeamStatistics>> => {
  try {
    const response = await fetchWithTimeout(`${API_BASE_URL}/teams/${teamId}/stats`);
    return handleResponse(response);
  } catch (error) {
    console.error('Error fetching team stats:', error);
    throw error;
  }
};
