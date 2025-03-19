
import { Player, Turn } from '@/types/game';

export const getAllRoundNumbers = (turns: Turn[]): number[] => {
  // Always return rounds 1-3, since the game is designed to have exactly 3 rounds
  return [1, 2, 3];
};

export const sortPlayersByScore = (players: Player[]): Player[] => {
  return [...players].sort((a, b) => (b.score || 0) - (a.score || 0));
};
