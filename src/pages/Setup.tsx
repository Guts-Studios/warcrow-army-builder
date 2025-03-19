
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import GameSetup from '@/components/play/GameSetup';
import { Player, Mission } from '@/types/game';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { toast } from 'sonner';

const Setup = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();

  const handleSetupComplete = (players: Player[], mission: Mission) => {
    console.log('Setting up game with mission:', mission);
    
    // Reset the game state first
    dispatch({ type: 'RESET_GAME' });
    
    // Add players to the game state
    players.forEach(player => {
      dispatch({
        type: 'ADD_PLAYER',
        payload: {
          ...player,
          score: 0 // Initialize score to 0
        }
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
      className="min-h-screen py-8 bg-background"
    >
      <GameSetup onComplete={handleSetupComplete} />
    </motion.div>
  );
};

export default Setup;
