
import { useGame } from '@/context/GameContext';
import { Unit } from '@/types/game';

export const useGameUnits = () => {
  const { state } = useGame();
  
  // Get all units for the game
  const getAllUnits = (): Unit[] => {
    if (state.units.length > 0) {
      return state.units;
    }
    
    // If no units are defined, create default ones based on players
    return Object.entries(state.players).flatMap(([playerId, player]) => [
      { id: `${playerId}-1`, name: `${player.name}'s Unit 1`, player: playerId },
      { id: `${playerId}-2`, name: `${player.name}'s Unit 2`, player: playerId },
      { id: `${playerId}-3`, name: `${player.name}'s Unit 3`, player: playerId }
    ]);
  };
  
  return { getAllUnits };
};
