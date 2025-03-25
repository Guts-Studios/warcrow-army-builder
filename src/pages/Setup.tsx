
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
  wab_id?: string;
  verified?: boolean;
  avatar_url?: string;
}

const Setup = () => {
  const navigate = useNavigate();
  const { dispatch } = useGame();

  const handleSetupComplete = async (players: GamePlayer[], mission: Mission) => {
    console.log('Setting up game with mission:', mission);
    
    // Reset the game state first
    dispatch({ type: 'RESET_GAME' });
    
    // Record the verified players' WAB IDs to track game stats later
    const verifiedWabIds = players
      .filter(p => p.verified && p.wab_id)
      .map(p => ({ wab_id: p.wab_id, name: p.name }));
    
    if (verifiedWabIds.length > 0) {
      // Store the verified WAB IDs in localStorage for later use when the game ends
      localStorage.setItem('warcrow_verified_players', JSON.stringify(verifiedWabIds));
    }
    
    // Add players to the game state with correct type
    players.forEach(player => {
      dispatch({
        type: 'ADD_PLAYER',
        payload: {
          ...player,
          score: 0, // Initialize score to 0
          roundScores: {}, // Initialize roundScores as empty object
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
