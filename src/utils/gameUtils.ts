
import { Turn, Player, GameState, GameEvent } from '@/types/game';

export const getAllRoundNumbers = (turns: Turn[]): number[] => {
  const roundSet = new Set<number>();
  
  turns.forEach(turn => {
    // In this game, two turns make a round
    const roundNumber = Math.ceil(turn.number / 2);
    if (roundNumber > 0) {
      roundSet.add(roundNumber);
    }
  });
  
  return Array.from(roundSet).sort((a, b) => a - b);
};

export const getAllRoundNumbersFromState = (gameState: GameState): number[] => {
  const roundSet = new Set<number>();
  
  // Add rounds from turns
  if (gameState.turns && gameState.turns.length > 0) {
    gameState.turns.forEach(turn => {
      const roundNumber = Math.ceil(turn.number / 2);
      if (roundNumber > 0) {
        roundSet.add(roundNumber);
      }
    });
  }
  
  // Add rounds from game events
  if (gameState.gameEvents && gameState.gameEvents.length > 0) {
    gameState.gameEvents.forEach(event => {
      if (event.roundNumber && event.roundNumber > 0) {
        roundSet.add(event.roundNumber);
      }
    });
  }
  
  // Add rounds from player roundScores
  Object.values(gameState.players).forEach(player => {
    if (player.roundScores) {
      Object.keys(player.roundScores).forEach(roundStr => {
        const round = parseInt(roundStr);
        if (!isNaN(round) && round > 0) {
          roundSet.add(round);
        }
      });
    }
  });
  
  // Always include rounds 1, 2, and 3
  roundSet.add(1);
  roundSet.add(2);
  roundSet.add(3);
  
  return Array.from(roundSet).sort((a, b) => a - b);
};

export const sortPlayersByScore = (players: Player[]): Player[] => {
  return [...players].sort((a, b) => {
    const scoreA = a.score || 0;
    const scoreB = b.score || 0;
    return scoreB - scoreA; // Sort in descending order
  });
};
