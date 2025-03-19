
import { Turn, Player } from '@/types/game';

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

export const sortPlayersByScore = (players: Player[]): Player[] => {
  return [...players].sort((a, b) => {
    const scoreA = a.score || 0;
    const scoreB = b.score || 0;
    return scoreB - scoreA; // Sort in descending order
  });
};
