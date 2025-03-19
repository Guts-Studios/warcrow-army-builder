
import React, { createContext, useContext, useReducer } from 'react';
import { Player, Mission, GameState, GameEvent, Unit } from '@/types/game';

// Define game state types
type GamePhase = 'setup' | 'deployment' | 'game' | 'scoring' | 'summary';

// Define action types
type GameAction = 
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'SET_PLAYER_1'; payload: Partial<Player> }
  | { type: 'SET_PLAYER_2'; payload: Partial<Player> }
  | { type: 'SET_MISSION'; payload: string | Mission }
  | { type: 'INCREMENT_ROUND' }
  | { type: 'SET_NOTES'; payload: string }
  | { type: 'SET_GAME_START_TIME'; payload: number }
  | { type: 'SET_GAME_END_TIME'; payload: number }
  | { type: 'SET_FIRST_TO_DEPLOY'; payload: string }
  | { type: 'SET_INITIAL_INITIATIVE'; payload: string }
  | { type: 'ADD_GAME_EVENT'; payload: GameEvent }
  | { type: 'UPDATE_SCORE'; payload: { playerId: string; score: number } }
  | { type: 'UPDATE_UNIT'; payload: { id: string; updates: Partial<Unit> } }
  | { type: 'ADD_UNIT'; payload: Unit }
  | { type: 'UPDATE_PLAYER'; payload: { id: string; updates: Partial<Player> } }
  | { type: 'RESET_GAME' };

// Initial state
const initialState: GameState = {
  currentPhase: 'setup',
  players: {
    player1: {
      id: 'player1',
      name: '',
      faction: '',
      points: 0,
      objectivePoints: 0,
    },
    player2: {
      id: 'player2',
      name: '',
      faction: '',
      points: 0,
      objectivePoints: 0,
    }
  },
  mission: null,
  round: 1,
  notes: '',
  gameEvents: [],
  units: [],
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
        players: {
          ...state.players,
          player1: {
            ...state.players.player1,
            ...action.payload,
          }
        }
      };
    case 'SET_PLAYER_2':
      return {
        ...state,
        players: {
          ...state.players,
          player2: {
            ...state.players.player2,
            ...action.payload,
          }
        }
      };
    case 'SET_MISSION':
      if (typeof action.payload === 'string') {
        return {
          ...state,
          mission: action.payload ? { id: action.payload, title: action.payload, details: '' } : null,
        };
      } else {
        return {
          ...state,
          mission: action.payload,
        };
      }
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
    case 'SET_GAME_START_TIME':
      return {
        ...state,
        gameStartTime: action.payload,
      };
    case 'SET_GAME_END_TIME':
      return {
        ...state,
        gameEndTime: action.payload,
      };
    case 'SET_FIRST_TO_DEPLOY':
      return {
        ...state,
        firstToDeployPlayerId: action.payload,
      };
    case 'SET_INITIAL_INITIATIVE':
      return {
        ...state,
        initialInitiativePlayerId: action.payload,
      };
    case 'ADD_GAME_EVENT':
      return {
        ...state,
        gameEvents: [...(state.gameEvents || []), action.payload],
      };
    case 'UPDATE_SCORE':
      const { playerId, score } = action.payload;
      return {
        ...state,
        players: {
          ...state.players,
          [playerId]: {
            ...state.players[playerId],
            score,
          }
        }
      };
    case 'UPDATE_UNIT':
      return {
        ...state,
        units: (state.units || []).map(unit => 
          unit.id === action.payload.id 
            ? { ...unit, ...action.payload.updates } 
            : unit
        ),
      };
    case 'ADD_UNIT':
      return {
        ...state,
        units: [...(state.units || []), action.payload],
      };
    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: {
          ...state.players,
          [action.payload.id]: {
            ...state.players[action.payload.id],
            ...action.payload.updates,
          }
        }
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
