
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, RotateCw, Save, Flag, ArrowDown, ArrowUp } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import GameSummary from '@/components/play/GameSummary';
import RoundSummary from '@/components/play/RoundSummary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { fadeIn } from '@/lib/animations';
import { toast } from 'sonner';
import { Unit } from '@/types/game';

type SummaryStep = 'scoring' | 'summary';

const Summary = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [currentStep, setCurrentStep] = useState<SummaryStep>('scoring');
  const [editingRound, setEditingRound] = useState<number | null>(null);
  
  const players = Object.values(state.players);
  const playerIds = Object.keys(state.players);
  
  const [scores, setScores] = useState<Record<string, number>>(
    playerIds.reduce((acc, id) => ({ ...acc, [id]: state.players[id].score }), {})
  );
  
  const getAllUnits = (): Unit[] => {
    if (state.units.length > 0) {
      return state.units;
    }
    
    return players.flatMap(player => [
      { id: `${player.id}-1`, name: `${player.name}'s Unit 1`, player: player.id },
      { id: `${player.id}-2`, name: `${player.name}'s Unit 2`, player: player.id },
      { id: `${player.id}-3`, name: `${player.name}'s Unit 3`, player: player.id }
    ]);
  };
  
  useEffect(() => {
    if (state.currentPhase !== 'scoring' && state.currentPhase !== 'summary') {
      navigate('/');
    }
  }, [state.currentPhase, navigate]);
  
  const handleScoreChange = (playerId: string, scoreValue: string) => {
    const numValue = parseInt(scoreValue) || 0;
    setScores({ ...scores, [playerId]: numValue });
  };

  const incrementScore = (playerId: string) => {
    setScores({ ...scores, [playerId]: (scores[playerId] || 0) + 1 });
  };

  const decrementScore = (playerId: string) => {
    setScores({ ...scores, [playerId]: Math.max(0, (scores[playerId] || 0) - 1) });
  };
  
  const handleSaveScores = () => {
    playerIds.forEach(playerId => {
      dispatch({
        type: 'UPDATE_SCORE', 
        payload: { playerId, score: scores[playerId] }
      });
    });
    
    dispatch({ type: 'SET_PHASE', payload: 'summary' });
    setCurrentStep('summary');
    toast.success('Scores saved successfully!');
  };
  
  const handleNewGame = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/setup');
  };

  const handleEditRound = (roundNumber: number) => {
    setEditingRound(roundNumber);
  };

  const handleRoundEditComplete = (roundScores: Record<string, number>) => {
    const playerUpdates: Record<string, { oldScore: number; newScore: number }> = {};
    
    Object.entries(state.players).forEach(([playerId, player]) => {
      const oldRoundScore = player.roundScores?.[editingRound!] || 0;
      const newRoundScore = roundScores[playerId] || 0;
      const totalScoreDiff = newRoundScore - oldRoundScore;
      
      playerUpdates[playerId] = {
        oldScore: player.score,
        newScore: player.score + totalScoreDiff
      };
      
      dispatch({
        type: 'UPDATE_SCORE',
        payload: {
          playerId,
          score: player.score + totalScoreDiff,
          roundNumber: editingRound!
        }
      });
    });
    
    setEditingRound(null);
    
    toast.success(`Round ${editingRound} scores updated!`);
  };

  const handleSkipToSummary = () => {
    playerIds.forEach(playerId => {
      dispatch({
        type: 'UPDATE_SCORE', 
        payload: { playerId, score: scores[playerId] }
      });
    });
    
    dispatch({ type: 'SET_PHASE', payload: 'summary' });
    setCurrentStep('summary');
    toast.success('Saved final scores and skipped to summary');
  };
  
  const getRounds = () => {
    const rounds: number[] = [];
    
    // Add rounds from player scores
    players.forEach(player => {
      if (player.roundScores) {
        Object.keys(player.roundScores).forEach(round => {
          const roundNum = parseInt(round);
          if (!isNaN(roundNum) && !rounds.includes(roundNum)) {
            rounds.push(roundNum);
          }
        });
      }
    });
    
    // Add rounds from game events
    state.gameEvents.forEach(event => {
      if (event.roundNumber && !rounds.includes(event.roundNumber)) {
        rounds.push(event.roundNumber);
      }
    });
    
    return rounds.sort((a, b) => a - b);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'scoring':
        return (
          <motion.div
            key="scoring"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-2xl mx-auto space-y-6"
          >
            <h2 className="phase-title">Final Scoring</h2>
            
            <div className="space-y-4">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="neo-card p-5 bg-gradient-to-br from-muted/50 to-background border border-border/50"
                >
                  <Label htmlFor={`score-${player.id}`} className="text-lg font-medium mb-2 block text-primary">
                    {player.name}'s Victory Points
                  </Label>
                  <div className="flex items-center">
                    <Button 
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => decrementScore(player.id)}
                      className="bg-red-500/20 hover:bg-red-500/30 border-red-500/50"
                    >
                      <ArrowDown className="h-4 w-4 text-white" />
                    </Button>
                    <Input
                      id={`score-${player.id}`}
                      type="number"
                      min="0"
                      className="text-lg h-12 mx-2"
                      value={scores[player.id] || 0}
                      onChange={(e) => handleScoreChange(player.id, e.target.value)}
                    />
                    <Button 
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => incrementScore(player.id)}
                      className="bg-green-500/20 hover:bg-green-500/30 border-green-500/50"
                    >
                      <ArrowUp className="h-4 w-4 text-white" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col gap-3 pt-4">
              <Button
                onClick={handleSaveScores}
                size="lg"
                className="px-8"
              >
                <Save className="mr-2 w-5 h-5" />
                Save Scores & Continue
              </Button>
              
              <Button
                onClick={handleSkipToSummary}
                size="lg"
                variant="outline"
                className="px-8"
              >
                <Flag className="mr-2 w-5 h-5" />
                Skip to Final Summary
              </Button>
            </div>
          </motion.div>
        );
        
      case 'summary':
        return (
          <motion.div
            key="summary"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="max-w-4xl mx-auto">
              <h2 className="phase-title mb-6">Game Summary</h2>
              
              <GameSummary 
                gameState={state}
                onEditRoundScore={handleEditRound}
              />
              
              <div className="flex justify-center gap-4 mt-8">
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  size="lg"
                  className="px-6"
                >
                  <Home className="mr-2 w-5 h-5" />
                  Return Home
                </Button>
                <Button
                  onClick={handleNewGame}
                  size="lg"
                  className="px-6"
                >
                  <RotateCw className="mr-2 w-5 h-5" />
                  New Game
                </Button>
              </div>
            </div>
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container px-4">
        {renderStepContent()}
        
        {editingRound !== null && (
          <RoundSummary
            roundNumber={editingRound}
            players={state.players}
            units={getAllUnits()}
            mission={state.mission}
            onComplete={handleRoundEditComplete}
            onCancel={() => setEditingRound(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Summary;
