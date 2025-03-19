
import React from 'react';
import { motion } from 'framer-motion';
import { Photo, Player, GameState } from '@/types/game';
import GameSummaryHeader from '@/components/play/GameSummaryHeader';
import FinalScores from '@/components/play/FinalScores';
import RoundDetails from '@/components/play/RoundDetails';
import { getAllRoundNumbers, sortPlayersByScore } from '@/utils/gameUtils';

interface GameSummaryProps {
  gameState: GameState;
  onViewPhoto: (photo: Photo) => void;
  onEditRoundScore: (roundNumber: number) => void;
}

const GameSummary: React.FC<GameSummaryProps> = ({ gameState, onViewPhoto, onEditRoundScore }) => {
  const players = Object.values(gameState.players) as Player[];
  const orderedPlayers = sortPlayersByScore(players);
  const winner = orderedPlayers[0];
  const rounds = getAllRoundNumbers(gameState.turns || []);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <GameSummaryHeader gameState={gameState} winner={winner} />
      
      <FinalScores players={players} />
      
      <RoundDetails 
        gameState={gameState}
        players={players}
        rounds={rounds}
        onViewPhoto={onViewPhoto}
        onEditRoundScore={onEditRoundScore}
      />
    </motion.div>
  );
};

export default GameSummary;
