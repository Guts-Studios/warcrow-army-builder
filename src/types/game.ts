
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
  roundScores?: Record<number, number>;
}

export interface Mission {
  id: string;
  title: string;
  details: string;
  name?: string;
}

export interface Photo {
  id: string;
  url: string;
  timestamp: number;
  phase: string;
  turnNumber?: number;
  roundNumber?: number;
}

export interface Turn {
  number: number;
  initiativePlayerId?: string;
  photos?: Photo[];
}

export interface GameEvent {
  id?: string;
  type: 'objective' | 'mission' | 'initiative';
  playerId: string;
  roundNumber: number;
  turnNumber?: number;
  objectiveType?: string;
  description?: string;
  value?: number;
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
  turns?: Turn[];
  gameEvents?: GameEvent[];
}
