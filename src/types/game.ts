
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
  initiativePlayerId?: string;
  photos?: Photo[];
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
  units?: Unit[];
}
