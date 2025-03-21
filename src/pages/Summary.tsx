
import React, { useEffect, useState } from 'react';
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
import { getAllRoundNumbersFromState } from '@/utils/gameUtils';

const Summary = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [currentRound, setCurrentRound] = useState(3); // Default to 3 rounds
  
  useEffect(() => {
    // Only allow access to summary page if a game has been started
    if (!state.mission) {
      navigate('/play');
    }
    
    // Determine the current round based on game state
    const rounds = getAllRoundNumbersFromState(state);
    if (rounds.length > 0) {
      setCurrentRound(Math.max(...rounds));
    }
  }, [state, navigate]);
  
  const handleNewGame = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/play');
  };
  
  const handleEditRound = (roundNumber: number) => {
    // Navigate to the scoring page for the selected round
    navigate(`/scoring?round=${roundNumber}`);
  };
  
  if (!state.mission) {
    return null; // Will redirect in useEffect
  }
  
  // Find the winner
  const winner = Object.values(state.players)
    .sort((a, b) => (b.score || 0) - (a.score || 0))[0];
  
  return (
    <div className="min-h-screen py-6 bg-warcrow-background">
      <Container>
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <GameSummaryHeader 
            gameState={state}
            winner={winner}
          />
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <GameSummary 
                gameState={state}
                onEditRoundScore={handleEditRound}
              />
              <GameResults />
            </div>
            
            <div className="space-y-6">
              <FinalScores 
                players={Object.values(state.players)}
                gameState={state}
              />
              <PreviousRounds 
                currentRound={currentRound}
                onEditRound={handleEditRound}
              />
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
