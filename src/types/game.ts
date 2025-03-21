export interface GameState {
  id: string;
  players: { [playerId: string]: Player };
  mission: Mission | null;
  currentPhase: GamePhase;
  rollOffWinner: string | null;
  firstToDeployPlayerId: string | null;
  initialInitiativePlayerId: string | null;
  currentTurn: number;
  units: Unit[];
  turns: Turn[];
  gameEvents: GameEvent[];
  gameStartTime: number | undefined;
  gameEndTime: number | undefined;
}

export type GamePhase = 'setup' | 'deployment' | 'game' | 'scoring' | 'summary';

export interface Player {
  id: string;
  name: string;
  faction?: {
    name: string;
    icon?: string;
  };
  units?: Unit[];
  list?: string;
  wab_id?: string;
  avatar_url?: string;
  verified?: boolean;
  user_profile_id?: string; // Added this field to store the profile ID
  score?: number;
  roundScores?: Record<string, number>;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  objective: string;
}

export interface Unit {
  id: string;
  name: string;
  player: string;
  status?: 'alive' | 'wounded' | 'destroyed';
  keywords?: string[];
  pointsCost?: number;
  quantity?: number;
  faction?: string;
  highCommand?: boolean;
  availability?: number;
  specialRules?: string[];
}

export interface Turn {
  number: number;
  roundNumber?: number;
  activePlayer: string | null;
  alternatingPlayer?: string;
  activationsCompleted: Record<string, number>;
  completed?: boolean;
  events?: GameEvent[];
  scores?: Record<string, number>;
}

export interface GameEvent {
  id: string;
  type: 'score' | 'kill' | 'objective';
  description: string;
  playerId: string;
  roundNumber?: number;
}
