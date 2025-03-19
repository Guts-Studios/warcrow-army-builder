
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { GameState, GamePhase, Player, Mission, Unit, Turn, GameEvent } from '@/types/game';
import { toast } from 'sonner';

type GameAction =
  | { type: 'SET_PHASE'; payload: GamePhase }
  | { type: 'ADD_PLAYER'; payload: Player }
  | { type: 'UPDATE_PLAYER'; payload: { id: string; updates: Partial<Player> } }
  | { type: 'SET_MISSION'; payload: Mission }
  | { type: 'SET_ROLL_OFF_WINNER'; payload: string }
  | { type: 'SET_FIRST_TO_DEPLOY'; payload: string }
  | { type: 'SET_INITIAL_INITIATIVE'; payload: string }
  | { type: 'ADD_UNIT'; payload: Unit }
  | { type: 'ADD_PLAYER_UNITS'; payload: { playerId: string; units: Unit[] } }
  | { type: 'UPDATE_UNIT'; payload: { id: string; updates: Partial<Unit> } }
  | { type: 'START_TURN'; payload: { turnNumber: number; activePlayer: string | null } }
  | { type: 'END_TURN' }
  | { type: 'COMPLETE_TURN'; payload: { turnNumber: number; scores: Record<string, number> } }
  | { type: 'COMPLETE_ACTIVATION'; payload: { playerId: string; turnNumber: number } }
  | { type: 'UPDATE_TURNS'; payload: Turn[] }
  | { type: 'ADD_GAME_EVENT'; payload: GameEvent }
  | { type: 'UPDATE_SCORE'; payload: { playerId: string; score: number; roundNumber?: number } }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  id: `game-${Date.now()}`,
  players: {},
  mission: null,
  currentPhase: 'setup',
  rollOffWinner: null,
  firstToDeployPlayerId: null,
  initialInitiativePlayerId: null,
  currentTurn: 0,
  units: [],
  turns: [],
  gameEvents: [],
  gameStartTime: undefined,
  gameEndTime: undefined,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PHASE':
      if (action.payload === 'game' && state.currentPhase === 'deployment') {
        return { ...state, currentPhase: action.payload, gameStartTime: Date.now() };
      }
      if (action.payload === 'summary' && state.currentPhase === 'scoring') {
        return { ...state, currentPhase: action.payload, gameEndTime: Date.now() };
      }
      return { ...state, currentPhase: action.payload };

    case 'ADD_PLAYER':
      return {
        ...state,
        players: {
          ...state.players,
          [action.payload.id]: {
            ...action.payload,
            roundScores: {}, // Initialize empty round scores object
            units: action.payload.units || [] // Ensure units array exists
          },
        },
      };

    case 'UPDATE_PLAYER':
      return {
        ...state,
        players: {
          ...state.players,
          [action.payload.id]: {
            ...state.players[action.payload.id],
            ...action.payload.updates,
          },
        },
      };

    case 'ADD_PLAYER_UNITS':
      const playerWithUnits = {
        ...state.players[action.payload.playerId],
        units: action.payload.units,
      };
      
      return {
        ...state,
        players: {
          ...state.players,
          [action.payload.playerId]: playerWithUnits,
        },
        units: [
          ...state.units.filter(unit => unit.player !== action.payload.playerId),
          ...action.payload.units
        ]
      };

    case 'SET_MISSION':
      return { ...state, mission: action.payload };

    case 'SET_ROLL_OFF_WINNER':
      return { ...state, rollOffWinner: action.payload };

    case 'SET_FIRST_TO_DEPLOY':
      return { ...state, firstToDeployPlayerId: action.payload };

    case 'SET_INITIAL_INITIATIVE':
      return { ...state, initialInitiativePlayerId: action.payload };

    case 'ADD_UNIT':
      return {
        ...state,
        units: [...state.units, action.payload],
      };

    case 'UPDATE_UNIT':
      return {
        ...state,
        units: state.units.map((unit) =>
          unit.id === action.payload.id
            ? { ...unit, ...action.payload.updates }
            : unit
        ),
      };

    case 'START_TURN': {
      console.log('START_TURN action:', action.payload);
      const newTurn: Turn = {
        number: action.payload.turnNumber,
        activePlayer: action.payload.activePlayer,
        activationsCompleted: Object.keys(state.players).reduce(
          (acc, playerId) => ({ ...acc, [playerId]: 0 }),
          {}
        ),
        events: [],
      };

      const existingTurnIndex = state.turns.findIndex(
        turn => turn.number === action.payload.turnNumber
      );

      let updatedTurns;
      if (existingTurnIndex >= 0) {
        updatedTurns = [...state.turns];
        updatedTurns[existingTurnIndex] = {
          ...updatedTurns[existingTurnIndex],
          activePlayer: action.payload.activePlayer,
        };
      } else {
        updatedTurns = [...state.turns, newTurn];
      }

      return {
        ...state,
        currentTurn: action.payload.turnNumber,
        turns: updatedTurns,
      };
    }

    case 'END_TURN': {
      const endTurnIndex = state.turns.findIndex(turn => turn.number === state.currentTurn);
      if (endTurnIndex === -1) {
        return state;
      }
      
      const endTurnUpdatedTurns = [...state.turns];
      endTurnUpdatedTurns[endTurnIndex] = {
        ...endTurnUpdatedTurns[endTurnIndex],
        completed: true
      };
      
      return {
        ...state,
        turns: endTurnUpdatedTurns
      };
    }

    case 'COMPLETE_TURN': {
      const { turnNumber, scores } = action.payload;
      const completeTurnIndex = state.turns.findIndex(turn => turn.number === turnNumber);
      
      if (completeTurnIndex === -1) {
        return state;
      }
      
      const completeTurnUpdatedTurns = [...state.turns];
      completeTurnUpdatedTurns[completeTurnIndex] = {
        ...completeTurnUpdatedTurns[completeTurnIndex],
        completed: true,
        scores
      };
      
      return {
        ...state,
        turns: completeTurnUpdatedTurns
      };
    }

    case 'COMPLETE_ACTIVATION': {
      console.log('COMPLETE_ACTIVATION action:', action.payload);
      const activationTurnIndex = state.turns.findIndex(
        (turn) => turn.number === action.payload.turnNumber
      );

      if (activationTurnIndex === -1) {
        console.log('Turn not found:', action.payload.turnNumber);
        return state;
      }

      const updatedTurnsForActivation = [...state.turns];
      const currentTurn = { ...updatedTurnsForActivation[activationTurnIndex] };

      const currentActivations = currentTurn.activationsCompleted[action.payload.playerId] || 0;
      const newActivationCount = currentActivations + 1;
      
      currentTurn.activationsCompleted = {
        ...currentTurn.activationsCompleted,
        [action.payload.playerId]: newActivationCount
      };

      console.log(`Updated activations for player ${action.payload.playerId} to ${newActivationCount}`);

      const players = Object.keys(state.players);
      const currentPlayerIndex = players.indexOf(action.payload.playerId);
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      
      if (newActivationCount >= 5) {
        const lowestActivationPlayer = players.reduce((lowest, playerId) => {
          const playerActivations = currentTurn.activationsCompleted[playerId] || 0;
          const lowestActivations = currentTurn.activationsCompleted[lowest] || 0;
          
          return playerActivations < lowestActivations ? playerId : lowest;
        }, players[0]);
        
        if ((currentTurn.activationsCompleted[lowestActivationPlayer] || 0) < 5) {
          currentTurn.alternatingPlayer = lowestActivationPlayer;
          console.log(`Player ${action.payload.playerId} completed all activations. Next player with lowest activations: ${lowestActivationPlayer}`);
        }
      }

      updatedTurnsForActivation[activationTurnIndex] = currentTurn;

      return {
        ...state,
        turns: updatedTurnsForActivation,
      };
    }

    case 'UPDATE_TURNS': {
      return {
        ...state,
        turns: action.payload,
      };
    }

    case 'ADD_GAME_EVENT': {
      return {
        ...state,
        gameEvents: [...state.gameEvents, action.payload],
      };
    }

    case 'UPDATE_SCORE': {
      const player = state.players[action.payload.playerId];
      if (!player) return state;
      
      const updatedPlayerScore = {
        ...player,
        score: action.payload.score,
      };
      
      if (action.payload.roundNumber !== undefined) {
        updatedPlayerScore.roundScores = {
          ...(player.roundScores || {}),
          [action.payload.roundNumber]: action.payload.score - (player.score || 0)
        };
      }
      
      return {
        ...state,
        players: {
          ...state.players,
          [action.payload.playerId]: updatedPlayerScore,
        },
      };
    }

    case 'RESET_GAME':
      return {
        ...initialState,
        id: `game-${Date.now()}`,
      };

    default:
      return state;
  }
}

type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  useEffect(() => {
    const savedGame = localStorage.getItem('warcrowGame');
    if (savedGame) {
      try {
        const parsedGame = JSON.parse(savedGame);
        if (parsedGame.currentPhase !== 'summary') {
          Object.entries(parsedGame.players).forEach(([_, player]) => {
            dispatch({ type: 'ADD_PLAYER', payload: player as Player });
          });
          if (parsedGame.mission) {
            dispatch({ type: 'SET_MISSION', payload: parsedGame.mission as Mission });
          }
          dispatch({ type: 'SET_PHASE', payload: parsedGame.currentPhase as GamePhase });
          toast.info('Restored previous game session');
        }
      } catch (error) {
        console.error('Failed to parse saved game:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('warcrowGame', JSON.stringify(state));
  }, [state]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
