
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
  units?: Unit[];
}

export interface Faction {
  id: string;
  name: string;
}

export interface Mission {
  id: string;
  title: string;
  details: string;
  name?: string;
  description?: string;
  objectiveDescription?: string;
  turnCount?: number;
  roundCount?: number;
  specialRules?: string[];
  mapImage?: string;
  objectiveMarkers?: ObjectiveMarker[];
}

export interface ObjectiveMarker {
  id: string;
  name: string;
  color: string;
  controlledBy: string | null;
}

export interface Annotation {
  id: string;
  x: number;
  y: number;
  label: string;
  unitId?: string;
}

export interface Photo {
  id: string;
  url: string;
  timestamp: number;
  phase: string;
  turnNumber?: number;
  roundNumber?: number;
  annotations?: Annotation[];
}

export interface Turn {
  number: number;
  activePlayer?: string | null;
  activationsCompleted?: Record<string, number>;
  alternatingPlayer?: string;
  completed?: boolean;
  scores?: Record<string, number>;
  photos?: Photo[];
  events?: any[];
}

export interface GameEvent {
  id?: string;
  type: 'objective' | 'mission' | 'initiative' | 'casualty' | 'note';
  playerId?: string;
  roundNumber?: number;
  turnNumber?: number;
  objectiveType?: string;
  description?: string;
  value?: number;
  timestamp?: number;
  unitId?: string;
  objectiveId?: string;
}

export interface Unit {
  id: string;
  name: string;
  player: string;
  status?: 'active' | 'wounded' | 'destroyed';
}

export type GamePhase = 'setup' | 'deployment' | 'game' | 'scoring' | 'summary';

export interface GameState {
  id: string;
  players: Record<string, Player>;
  mission: Mission | null;
  currentPhase: GamePhase;
  rollOffWinner: string | null;
  firstToDeployPlayerId: string | null;
  initialInitiativePlayerId: string | null;
  currentTurn: number;
  photos: Photo[];
  units: Unit[];
  turns: Turn[];
  gameEvents: GameEvent[];
  gameStartTime?: number;
  gameEndTime?: number;
}
