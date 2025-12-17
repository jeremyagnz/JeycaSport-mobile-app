/**
 * Baseball statistics calculator
 * Provides functions to calculate various baseball statistics
 */

/**
 * Calculate batting average (BA)
 * Formula: Hits / At Bats
 */
export const calculateBattingAverage = (hits: number, atBats: number): number => {
  if (atBats === 0) return 0;
  return Number((hits / atBats).toFixed(3));
};

/**
 * Calculate on-base percentage (OBP)
 * Formula: (Hits + Walks + Hit By Pitch) / (At Bats + Walks + Hit By Pitch + Sacrifice Flies)
 */
export const calculateOnBasePercentage = (
  hits: number,
  walks: number,
  hitByPitch: number,
  atBats: number,
  sacrificeFlies: number
): number => {
  const denominator = atBats + walks + hitByPitch + sacrificeFlies;
  if (denominator === 0) return 0;
  return Number(((hits + walks + hitByPitch) / denominator).toFixed(3));
};

/**
 * Calculate slugging percentage (SLG)
 * Formula: Total Bases / At Bats
 */
export const calculateSluggingPercentage = (
  singles: number,
  doubles: number,
  triples: number,
  homeRuns: number,
  atBats: number
): number => {
  if (atBats === 0) return 0;
  const totalBases = singles + doubles * 2 + triples * 3 + homeRuns * 4;
  return Number((totalBases / atBats).toFixed(3));
};

/**
 * Calculate earned run average (ERA) for pitchers
 * Formula: (Earned Runs * 9) / Innings Pitched
 */
export const calculateERA = (earnedRuns: number, inningsPitched: number): number => {
  if (inningsPitched === 0) return 0;
  return Number(((earnedRuns * 9) / inningsPitched).toFixed(2));
};

/**
 * Calculate wins above replacement (WAR) - simplified version
 * This is a simplified calculation; actual WAR is much more complex
 */
export const calculateSimplifiedWAR = (
  battingRuns: number,
  baserunningRuns: number,
  fieldingRuns: number,
  positionalAdjustment: number,
  replacement: number = 20
): number => {
  const totalRuns = battingRuns + baserunningRuns + fieldingRuns + positionalAdjustment;
  return Number(((totalRuns - replacement) / 10).toFixed(1));
};
