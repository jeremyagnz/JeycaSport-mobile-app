/**
 * Player model
 * Represents a baseball player with their information and statistics
 */

export interface Player {
  id: string;
  name: string;
  number: number;
  position: Position;
  teamId: string;
  dateOfBirth: string;
  height: string; // e.g., "6'2\""
  weight: number; // in pounds
  bats: BatSide;
  throws: ThrowSide;
  statistics?: PlayerStatistics;
}

export type Position =
  | 'P' // Pitcher
  | 'C' // Catcher
  | '1B' // First Base
  | '2B' // Second Base
  | '3B' // Third Base
  | 'SS' // Shortstop
  | 'LF' // Left Field
  | 'CF' // Center Field
  | 'RF' // Right Field
  | 'DH'; // Designated Hitter

export type BatSide = 'L' | 'R' | 'S'; // Left, Right, Switch
export type ThrowSide = 'L' | 'R'; // Left, Right

export interface PlayerStatistics {
  // Batting statistics
  gamesPlayed: number;
  atBats: number;
  runs: number;
  hits: number;
  doubles: number;
  triples: number;
  homeRuns: number;
  rbi: number; // Runs Batted In
  walks: number;
  strikeouts: number;
  stolenBases: number;
  caughtStealing: number;
  hitByPitch: number; // Hit by Pitch
  sacrificeFlies: number; // Sacrifice Flies
  battingAverage: number;
  onBasePercentage: number;
  sluggingPercentage: number;
  ops: number; // On-base Plus Slugging

  // Pitching statistics (for pitchers)
  wins?: number;
  losses?: number;
  saves?: number;
  inningsPitched?: number;
  hitsAllowed?: number;
  runsAllowed?: number;
  earnedRuns?: number;
  walksAllowed?: number;
  strikeoutsRecorded?: number;
  era?: number; // Earned Run Average
  whip?: number; // Walks plus Hits per Inning Pitched
}

export interface PlayerCreate {
  name: string;
  number: number;
  position: Position;
  teamId: string;
  dateOfBirth: string;
  height: string;
  weight: number;
  bats: BatSide;
  throws: ThrowSide;
}

export interface PlayerUpdate extends Partial<PlayerCreate> {
  id: string;
}
