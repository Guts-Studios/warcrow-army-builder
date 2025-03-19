
import React, { createContext, useContext, useReducer } from 'react';

// Define game state types
type GamePhase = 'setup' | 'deployment' | 'game' | 'scoring' | 'summary';

interface GameState {
  currentPhase: GamePhase;
  player1: {
    name: string;
    faction: string;
    points: number;
    objectivePoints: number;
  };
  player2: {
    name: string;
    faction: string;
    points: number;
    objectivePoints: number;
  };
  mission: string | null;
  round: number;
  notes: string;
}

// Define action types
type GameAction = 
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'SET_PLAYER_1'; payload: Partial<GameState['player1']> }
  | { type: 'SET_PLAYER_2'; payload: Partial<GameState['player2']> }
  | { type: 'SET_MISSION'; payload: string }
  | { type: 'INCREMENT_ROUND' }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'RESET_GAME' };

// Initial state
const initialState: GameState = {
  currentPhase: 'setup',
  player1: {
    name: '',
    faction: '',
    points: 0,
    objectivePoints: 0,
  },
  player2: {
    name: '',
    faction: '',
    points: 0,
    objectivePoints: 0,
  },
  mission: null,
  round: 1,
  notes: '',
};

// Create context
const GameContext = createContext<{
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// Reducer function
const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'SET_PHASE':
      return {
        ...state,
        currentPhase: action.payload,
      };
    case 'SET_PLAYER_1':
      return {
        ...state,
        player1: {
          ...state.player1,
          ...action.payload,
        },
      };
    case 'SET_PLAYER_2':
      return {
        ...state,
        player2: {
          ...state.player2,
          ...action.payload,
        },
      };
    case 'SET_MISSION':
      return {
        ...state,
        mission: action.payload,
      };
    case 'INCREMENT_ROUND':
      return {
        ...state,
        round: state.round + 1,
      };
    case 'SET_NOTES':
      return {
        ...state,
        notes: action.payload,
      };
    case 'RESET_GAME':
      return initialState;
    default:
      return state;
  }
};

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook for using the game context
export const useGame = () => useContext(GameContext);
