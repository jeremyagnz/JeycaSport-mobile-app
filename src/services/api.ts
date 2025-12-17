/**
 * API service for fetching data from remote servers
 * Provides functions to interact with baseball statistics API
 */

import type { Player, PlayerStatistics, Position, BatSide, ThrowSide } from '../models/Player';
import type { Team, TeamStatistics } from '../models/Team';

// Base API configuration
// Using MLB Stats API (free public API) - https://statsapi.mlb.com/
const API_BASE_URL = process.env.API_BASE_URL || 'https://statsapi.mlb.com/api/v1';
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

export interface FetchPlayersState {
  players: Player[];
  loading: boolean;
  error: string | null;
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
 * Map MLB API position to our Position type
 */
const mapPosition = (apiPosition: string): Position => {
  const positionMap: Record<string, Position> = {
    Pitcher: 'P',
    Catcher: 'C',
    'First Base': '1B',
    'Second Base': '2B',
    'Third Base': '3B',
    Shortstop: 'SS',
    'Left Field': 'LF',
    'Center Field': 'CF',
    'Right Field': 'RF',
    'Designated Hitter': 'DH',
  };
  return positionMap[apiPosition] || 'DH';
};

/**
 * Map MLB API player data to our Player model
 */
const mapApiPlayerToPlayer = (apiPlayer: any, teamId: string): Player => {
  return {
    id: String(apiPlayer.id),
    name: apiPlayer.fullName || `${apiPlayer.firstName} ${apiPlayer.lastName}`,
    number: apiPlayer.primaryNumber || 0,
    position: mapPosition(apiPlayer.primaryPosition?.name || 'Designated Hitter'),
    teamId: teamId,
    dateOfBirth: apiPlayer.birthDate || '1990-01-01',
    height: apiPlayer.height || '6\'0"',
    weight: apiPlayer.weight || 200,
    bats: (apiPlayer.batSide?.code || 'R') as BatSide,
    throws: (apiPlayer.pitchHand?.code || 'R') as ThrowSide,
    // Statistics would need separate API calls for each player
    statistics: undefined,
  };
};

/**
 * Fetch baseball players from MLB Stats API
 * @param teamId - Optional team ID to filter players
 * @returns Promise with players data, loading state, and error state
 */
export const fetchBaseballPlayers = async (teamId?: string): Promise<FetchPlayersState> => {
  const state: FetchPlayersState = {
    players: [],
    loading: true,
    error: null,
  };

  try {
    // If teamId is provided, fetch roster for that team
    // Otherwise, fetch popular teams' rosters
    const teamsToFetch = teamId ? [teamId] : ['147', '119', '117']; // Yankees, Dodgers, Astros
    const allPlayers: Player[] = [];

    for (const tid of teamsToFetch) {
      try {
        const url = `${API_BASE_URL}/teams/${tid}/roster`;
        const response = await fetchWithTimeout(url);
        const result = await response.json();

        if (result.roster && Array.isArray(result.roster)) {
          const mappedPlayers = result.roster.map((item: any) =>
            mapApiPlayerToPlayer(item.person, tid)
          );
          allPlayers.push(...mappedPlayers);
        }
      } catch (teamError) {
        console.warn(`Failed to fetch roster for team ${tid}:`, teamError);
        // Continue with other teams
      }
    }

    state.players = allPlayers;
    state.loading = false;
    return state;
  } catch (error) {
    console.error('Error fetching baseball players:', error);
    state.loading = false;
    state.error = error instanceof Error ? error.message : 'Failed to fetch baseball players';
    return state;
  }
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
    const url = teamId
      ? `${API_BASE_URL}/teams/${teamId}/roster`
      : `${API_BASE_URL}/sports/1/players`;
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
    const response = await fetchWithTimeout(`${API_BASE_URL}/people/${playerId}`);
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
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/people/${playerId}/stats?stats=season&season=2024`
    );
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
