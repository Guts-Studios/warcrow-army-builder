
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import GameSetup from '@/components/play/GameSetup';
import { Player, Mission } from '@/types/game';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { toast } from 'sonner';

interface GamePlayer {
  id: string;
  name: string;
  faction: {
    id: string;
    name: string;
    icon?: string;
  } | null;
  list: string | null;
}

const Setup = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();

  const handleSetupComplete = (players: GamePlayer[], mission: Mission) => {
    console.log('Setting up game with mission:', mission);
    
    // Reset the game state first
    dispatch({ type: 'RESET_GAME' });
    
    // Add players to the game state with correct type
    players.forEach(player => {
      dispatch({
        type: 'ADD_PLAYER',
        payload: {
          ...player,
          score: 0, // Initialize score to 0
          points: 0, // Add required field
          objectivePoints: 0 // Add required field
        } as Player
      });
    });

    // Set the mission
    dispatch({ type: 'SET_MISSION', payload: mission });

    // Transition to deployment phase
    dispatch({ type: 'SET_PHASE', payload: 'deployment' });

    // Navigate to deployment page
    toast.success(`Game setup complete! Starting mission: ${mission.name}`);
    navigate('/deployment');
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen py-8 bg-warcrow-background"
    >
      <GameSetup onComplete={handleSetupComplete} />
    </motion.div>
  );
};

export default Setup;
