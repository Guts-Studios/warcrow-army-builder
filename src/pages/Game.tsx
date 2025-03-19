
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { toast } from 'sonner';
import { ArrowRight, Camera } from 'lucide-react';

const Game = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  
  useEffect(() => {
    if (state.currentPhase !== 'game') {
      navigate('/setup');
    }
  }, [state.currentPhase, navigate]);
  
  const handleEndGame = () => {
    dispatch({ type: 'SET_PHASE', payload: 'scoring' });
    navigate('/summary');
  };

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container px-4">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Game In Progress</h1>
            <Button onClick={handleEndGame}>
              End Game & Score
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <div className="neo-card p-6">
            <h2 className="text-xl font-semibold mb-4">Game Details</h2>
            
            <div className="space-y-2 mb-6">
              {state.mission && (
                <p><strong>Mission:</strong> {state.mission.name}</p>
              )}
              <p><strong>Players:</strong> {Object.values(state.players).map(p => p.name).join(' vs ')}</p>
              <p><strong>Current Turn:</strong> {state.currentTurn}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.values(state.players).map(player => (
                <div key={player.id} className="p-4 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">{player.name}</h3>
                  <p><strong>Faction:</strong> {typeof player.faction === 'string' ? player.faction : player.faction?.name}</p>
                  <p><strong>Score:</strong> {player.score || 0}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Game;
