
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Container } from '@/components/ui/custom';
import GameSummaryHeader from '@/components/play/GameSummaryHeader';
import GameSummary from '@/components/play/GameSummary';
import FinalScores from '@/components/play/FinalScores';
import PreviousRounds from '@/components/play/PreviousRounds';
import GameResults from '@/components/play/GameResults';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';

const Summary = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  
  useEffect(() => {
    // Only allow access to summary page if a game has been started
    if (!state.mission) {
      navigate('/play');
    }
  }, [state.mission, navigate]);
  
  const handleNewGame = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/play');
  };
  
  if (!state.mission) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen py-6 bg-warcrow-background">
      <Container>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <GameSummaryHeader mission={state.mission} />
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <GameSummary />
              <GameResults />
            </div>
            
            <div className="space-y-6">
              <FinalScores />
              <PreviousRounds />
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <button
              onClick={handleNewGame}
              className="px-6 py-3 bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90 rounded-lg transition-colors font-medium"
            >
              Start New Game
            </button>
          </div>
        </motion.div>
      </Container>
    </div>
  );
};

export default Summary;
