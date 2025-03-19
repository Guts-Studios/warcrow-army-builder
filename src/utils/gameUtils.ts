
import { Player, Turn, GameEvent, Unit, Mission } from '@/types/game';

export const getAllRoundNumbers = (turns: Turn[]): number[] => {
  // Always return rounds 1-3, since the game is designed to have exactly 3 rounds
  return [1, 2, 3];
};

export const sortPlayersByScore = (players: Player[]): Player[] => {
  return [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
};

export const getPlayerUnits = (units: Unit[], playerId: string): Unit[] => {
  return units.filter(unit => unit.player === playerId);
};

export const getActiveUnits = (units: Unit[]): Unit[] => {
  return units.filter(unit => unit.status !== 'destroyed');
};

export const getUnitById = (units: Unit[], unitId: string): Unit | undefined => {
  return units.find(unit => unit.id === unitId);
};

export const getGameEventsByType = (events: GameEvent[], type: string): GameEvent[] => {
  return events.filter(event => event.type === type);
};

export const getRoundEvents = (events: GameEvent[], roundNumber: number): GameEvent[] => {
  return events.filter(event => event.roundNumber === roundNumber);
};

export const getTurnEvents = (events: GameEvent[], turnNumber: number): GameEvent[] => {
  return events.filter(event => event.turnNumber === turnNumber);
};

export const calculateRoundScores = (players: Player[], events: GameEvent[]): Record<string, Record<number, number>> => {
  const roundScores: Record<string, Record<number, number>> = {};
  
  // Initialize scores for all players and rounds
  Object.keys(players).forEach(playerId => {
    roundScores[playerId] = { 1: 0, 2: 0, 3: 0 };
  });
  
  // Calculate scores from events
  events.forEach(event => {
    if ((event.type === 'objective' || event.type === 'mission') && 
        event.playerId && 
        event.roundNumber && 
        event.value) {
      
      if (!roundScores[event.playerId]) {
        roundScores[event.playerId] = {};
      }
      
      if (!roundScores[event.playerId][event.roundNumber]) {
        roundScores[event.playerId][event.roundNumber] = 0;
      }
      
      roundScores[event.playerId][event.roundNumber] += event.value;
    }
  });
  
  return roundScores;
};

export const getMissionById = (missions: Mission[], id: string): Mission | undefined => {
  return missions.find(mission => mission.id === id);
};
