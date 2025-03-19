
export interface Player {
  id?: string;
  name: string;
  faction: {
    name: string;
  } | string;
  points: number;
  objectivePoints: number;
  score?: number;
  list?: string;
}

export interface Mission {
  id: string;
  title: string;
  details: string;
  name?: string;
}

export interface GameState {
  currentPhase: 'setup' | 'deployment' | 'game' | 'scoring' | 'summary';
  players: Record<string, Player>;
  mission: Mission | null;
  round: number;
  notes: string;
  gameStartTime?: number;
  gameEndTime?: number;
  firstToDeployPlayerId?: string;
  initialInitiativePlayerId?: string;
}
