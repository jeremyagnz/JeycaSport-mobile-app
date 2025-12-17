/**
 * Navigation type definitions for the app
 */

export type RootStackParamList = {
  Home: undefined;
  Teams: undefined;
  Players: undefined;
  PlayerDetail: { playerId: string };
  Stats: undefined;
  AdminLogin: undefined;
  AdminDashboard: undefined;
  AdminPlayers: undefined;
  AdminEditPlayer: { playerId: string | undefined };
  AdminTeams: undefined;
  AdminEditTeam: { teamId: string | undefined };
  AdminStats: undefined;
  AdminEditStats: { entityId: string; entityType: 'player' | 'team' };
};

// Type helpers for navigation props
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
