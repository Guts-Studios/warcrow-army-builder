import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { toast } from 'sonner';
import { ArrowRight, Star } from 'lucide-react';
import { Card } from '@/components/ui/card';
import MissionScoring from '@/components/play/MissionScoring';
import { useGameScoring } from '@/hooks/useGameScoring';
import InitiativeDialog from '@/components/play/InitiativeDialog';

const Game = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [currentRound, setCurrentRound] = useState(1);
  const [showInitiativeDialog, setShowInitiativeDialog] = useState(false);
  const [initiativePlayerId, setInitiativePlayerId] = useState<string>('');
  
  const {
    missionScoring,
    scoredFogMarkers,
    toggleScoringCondition,
    calculateVP,
    updateScores
  } = useGameScoring(currentRound);
  
  useEffect(() => {
    if (state.currentPhase !== 'game') {
      navigate('/setup');
    }
  }, [state.currentPhase, navigate]);
  
  const handleEndGame = () => {
    dispatch({ type: 'SET_PHASE', payload: 'scoring' });
    navigate('/summary');
  };

  const handleScoreRound = () => {
    updateScores();
    
    // Show initiative dialog for next round or end game after round 3
    if (currentRound < 3) {
      setShowInitiativeDialog(true);
    } else {
      toast.success(`Final round ${currentRound} scored! The game is complete.`);
      handleEndGame();
    }
  };
  
  const handleConfirmInitiative = () => {
    if (initiativePlayerId) {
      // First increment round counter
      setCurrentRound(prev => prev + 1);
      
      // Log the round info in game events
      dispatch({
        type: 'ADD_GAME_EVENT',
        payload: {
          id: `round-${currentRound}-initiative`,
          type: 'initiative',
          playerId: initiativePlayerId,
          roundNumber: currentRound + 1,
          description: `${state.players[initiativePlayerId]?.name} has initiative for round ${currentRound + 1}`,
          timestamp: Date.now()
        }
      });
      
      toast.success(`Round ${currentRound} scored successfully. ${state.players[initiativePlayerId]?.name} has initiative for round ${currentRound + 1}`);
      setShowInitiativeDialog(false);
    } else {
      toast.error("Please select a player with initiative");
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container px-4">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-8"
        >
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-primary">Game In Progress</h1>
            <Button onClick={handleEndGame}>
              End Game & Score
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          <Card className="p-6 border border-border/40 shadow-sm bg-black/80">
            <div className="space-y-8">
              {/* Game Details Section */}
              <div>
                <h2 className="text-xl font-semibold mb-4 text-primary">Game Information</h2>
                
                <div className="space-y-2 mb-6">
                  {state.mission && (
                    <p><strong>Mission:</strong> {state.mission.name}</p>
                  )}
                  <p><strong>Players:</strong> {Object.values(state.players).map(p => p.name).join(' vs ')}</p>
                  <p><strong>Current Turn:</strong> {state.currentTurn}</p>
                  <p><strong>Current Round:</strong> {currentRound} of 3</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(state.players).map(player => (
                    <div key={player.id} className="p-4 border rounded-lg border-border/20 bg-black/60">
                      <h3 className="text-lg font-medium mb-2 text-primary">{player.name}</h3>
                      <p><strong>Nation:</strong> {typeof player.faction === 'string' ? player.faction : player.faction?.name}</p>
                      <p><strong>Score:</strong> {player.score || 0}</p>
                    </div>
                  ))}
                </div>
              </div>
               
              {/* Scoring Section */}
              <div>
                <div className="flex justify-between items-center mb-4 border-t pt-4 border-border/20">
                  <h2 className="text-xl font-semibold text-primary">Round {currentRound} Scoring</h2>
                  <Button 
                    onClick={handleScoreRound}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Star className="h-4 w-4" />
                    <span>Score Round {currentRound}</span>
                  </Button>
                </div>
                
                {state.mission ? (
                  <MissionScoring 
                    mission={state.mission}
                    players={state.players}
                    missionScoring={missionScoring}
                    currentRound={currentRound}
                    toggleScoringCondition={toggleScoringCondition}
                    calculateVP={calculateVP}
                    scoredFogMarkers={scoredFogMarkers}
                  />
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No mission selected
                  </div>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      
      <InitiativeDialog
        open={showInitiativeDialog}
        onOpenChange={setShowInitiativeDialog}
        players={state.players}
        currentRound={currentRound + 1}
        initiativePlayerId={initiativePlayerId}
        setInitiativePlayerId={setInitiativePlayerId}
        onConfirm={handleConfirmInitiative}
      />
    </div>
  );
};

export default Game;
