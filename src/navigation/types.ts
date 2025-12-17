/**
 * Navigation type definitions for the app
 */

export type RootStackParamList = {
  Home: undefined;
  Teams: undefined;
  Players: undefined;
  PlayerDetail: { playerId: string };
  Stats: undefined;
};

// Type helpers for navigation props
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
