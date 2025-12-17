/**
 * Team model
 * Represents a baseball team with their information and statistics
 */

export interface Team {
  id: string;
  name: string;
  abbreviation: string;
  city: string;
  state: string;
  league: League;
  division: Division;
  founded: number;
  stadium: Stadium;
  colors: TeamColors;
  logoUrl?: string;
  statistics?: TeamStatistics;
}

export type League = 'AL' | 'NL'; // American League, National League

export type Division = 'East' | 'Central' | 'West';

export interface Stadium {
  name: string;
  capacity: number;
  surface: 'Grass' | 'Turf';
  yearOpened: number;
}

export interface TeamColors {
  primary: string;
  secondary: string;
  accent?: string;
}

export interface TeamStatistics {
  season: number;
  wins: number;
  losses: number;
  winPercentage: number;
  gamesBack: number;
  runsScored: number;
  runsAllowed: number;
  runDifferential: number;

  // Team batting statistics
  teamBattingAverage: number;
  teamOnBasePercentage: number;
  teamSluggingPercentage: number;
  teamHomeRuns: number;
  teamStolenBases: number;

  // Team pitching statistics
  teamERA: number;
  teamWHIP: number;
  teamStrikeouts: number;
  teamSaves: number;

  // Fielding statistics
  fieldingPercentage: number;
  errors: number;
  doublePlays: number;
}

export interface TeamCreate {
  name: string;
  abbreviation: string;
  city: string;
  state: string;
  league: League;
  division: Division;
  founded: number;
  stadium: Stadium;
  colors: TeamColors;
  logoUrl?: string;
}

export interface TeamUpdate extends Partial<TeamCreate> {
  id: string;
}

export interface TeamRoster {
  teamId: string;
  season: number;
  players: string[]; // Array of player IDs
  coaching: {
    manager: string;
    pitchingCoach?: string;
    battingCoach?: string;
    benchCoach?: string;
  };
}
