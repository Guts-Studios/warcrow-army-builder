import { GameState, GameEvent } from '@/types/game';

// Get all round numbers that have events or scores in the game state
export const getAllRoundNumbersFromState = (state: GameState): number[] => {
  const rounds = new Set<number>();
  
  // Collect rounds from game events
  state.gameEvents.forEach(event => {
    if (event.roundNumber !== undefined) {
      rounds.add(event.roundNumber);
    }
  });
  
  // Collect rounds from player scores
  Object.values(state.players).forEach(player => {
    if (player.roundScores) {
      Object.keys(player.roundScores).forEach(roundStr => {
        const roundNum = parseInt(roundStr, 10);
        if (!isNaN(roundNum)) {
          rounds.add(roundNum);
        }
      });
    }
  });
  
  // Return as a sorted array
  return Array.from(rounds).sort((a, b) => a - b);
};
