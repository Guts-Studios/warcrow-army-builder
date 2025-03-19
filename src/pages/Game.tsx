
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { 
  Power,
  Flag,
  ArrowLeft,
  Camera
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { fadeIn } from '@/lib/animations';
import RoundSummary from '@/components/play/RoundSummary';
import { Unit } from '@/types/game';
import PhotoCapture from '@/components/PhotoCapture';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose
} from "@/components/ui/sheet";

// Refactored components with correct import paths
import MissionScoring from '@/components/play/MissionScoring';
import InitiativeDialog from '@/components/play/InitiativeDialog';
import EndGameDialog from '@/components/play/EndGameDialog';
import PreviousRounds from '@/components/play/PreviousRounds';

// Custom hooks that we need to create
import { useGameScoring } from '@/hooks/useGameScoring';
import { useGameUnits } from '@/hooks/useGameUnits';

const Game = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const { getAllUnits } = useGameUnits();
  
  // Game state
  const [currentRound, setCurrentRound] = useState(1);
  const [showEndGame, setShowEndGame] = useState(false);
  const [editingRound, setEditingRound] = useState<number | null>(null);
  const [showInitiativeDialog, setShowInitiativeDialog] = useState(false);
  const [initiativePlayerId, setInitiativePlayerId] = useState<string>('');
  
  // Scoring logic from custom hook
  const { 
    missionScoring,
    scoredFogMarkers,
    toggleScoringCondition,
    calculateVP,
    updateScores
  } = useGameScoring(currentRound);
  
  // Initialize game if needed
  useEffect(() => {
    if (state.currentPhase === 'deployment') {
      // Add game start event
      dispatch({
        type: 'ADD_GAME_EVENT',
        payload: {
          id: `event-${Date.now()}`,
          timestamp: Date.now(),
          type: 'note',
          description: 'Game started'
        }
      });
      
      // Set the game phase
      dispatch({
        type: 'SET_PHASE',
        payload: 'game'
      });
      
      toast.success('Game started!');
    }
  }, [dispatch, state.currentPhase]);
  
  // End the current round and start the next
  const handleEndRound = () => {
    // Update the round number
    const nextRound = currentRound + 1;
    
    // Add round end event
    dispatch({
      type: 'ADD_GAME_EVENT',
      payload: {
        id: `event-${Date.now()}`,
        timestamp: Date.now(),
        type: 'note',
        description: `Round ${currentRound} completed`
      }
    });
    
    setCurrentRound(nextRound);
    
    // Show initiative dialog for rounds 2 and 3
    if (nextRound === 2 || nextRound === 3) {
      setShowInitiativeDialog(true);
    }
    
    // Check if we've reached the end of the game (3 rounds)
    if (nextRound > 3) {
      toast.info('This was the final round. The game is now complete.');
      setShowEndGame(true);
    }
  };
  
  // Handle initiative selection
  const handleInitiativeSelected = () => {
    if (!initiativePlayerId) {
      toast.error('Please select a player');
      return;
    }
    
    // Add initiative event
    dispatch({
      type: 'ADD_GAME_EVENT',
      payload: {
        id: `initiative-${Date.now()}`,
        timestamp: Date.now(),
        type: 'initiative',
        playerId: initiativePlayerId,
        description: `${state.players[initiativePlayerId].name} has initiative for round ${currentRound}`,
        roundNumber: currentRound,
      }
    });
    
    setShowInitiativeDialog(false);
    toast.success(`${state.players[initiativePlayerId].name} has initiative for round ${currentRound}`);
  };
  
  // Combined function to update scores and end the round
  const handleEndRoundWithScoring = () => {
    // First apply the VP
    updateScores();
    
    // Then handle round end
    handleEndRound();
  };
  
  // End game and go to scoring
  const handleEndGame = () => {
    dispatch({ type: 'SET_PHASE', payload: 'scoring' });
    navigate('/scoring');
  };

  // Handle editing a previous round
  const handleEditRound = (roundNumber: number) => {
    setEditingRound(roundNumber);
  };

  // Handle when round edit is complete
  const handleRoundEditComplete = (roundScores: Record<string, number>, photo: any) => {
    if (editingRound === null) return;
    
    Object.entries(roundScores).forEach(([playerId, score]) => {
      const currentScore = state.players[playerId]?.score || 0;
      const oldRoundScore = state.players[playerId]?.roundScores?.[editingRound] || 0;
      
      // Calculate the difference from the previous round score
      const scoreDiff = score - oldRoundScore;
      
      // Update player's total score and the specific round score
      dispatch({
        type: 'UPDATE_SCORE',
        payload: {
          playerId,
          score: currentScore + scoreDiff,
          roundNumber: editingRound
        }
      });
    });
    
    setEditingRound(null);
    toast.success(`Round ${editingRound} scores updated!`);
  };

  // Handle photo capture
  const handlePhotoCapture = (photoData: string) => {
    // Add photo to game state
    dispatch({
      type: 'ADD_PHOTO',
      payload: {
        id: `photo-${Date.now()}`,
        url: photoData,
        timestamp: Date.now(),
        phase: 'midgame',
        turnNumber: currentRound,
        annotations: []
      }
    });
    
    toast.success('Photo captured!');
  };
  
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="container py-6 max-w-5xl mx-auto"
    >
      <div className="grid grid-cols-1 gap-6 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neo-card p-4"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Game in Progress</h2>
            <div className="text-sm text-muted-foreground">Round {currentRound} of 3</div>
          </div>
          
          {/* Take Photo Button */}
          <div className="mb-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary" className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Take Photo
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] sm:h-[90vh] p-0">
                <SheetHeader className="p-4 pb-0">
                  <SheetTitle>Game Photo</SheetTitle>
                  <SheetDescription>Capture the current game state</SheetDescription>
                </SheetHeader>
                <div className="p-4">
                  <PhotoCapture 
                    onPhotoTaken={handlePhotoCapture} 
                    phase="midgame" 
                    turn={currentRound} 
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Previous Rounds Section */}
          <PreviousRounds 
            currentRound={currentRound} 
            onEditRound={handleEditRound} 
          />
          
          {/* Mission VP Scoring */}
          <div className="mb-4">
            <MissionScoring 
              mission={state.mission} 
              players={state.players}
              missionScoring={missionScoring}
              currentRound={currentRound}
              toggleScoringCondition={toggleScoringCondition}
              calculateVP={calculateVP}
              scoredFogMarkers={scoredFogMarkers}
            />
          </div>
          
          {/* End Round button - now combined with Apply VP */}
          <div className="mt-4 pt-4 border-t border-border">
            <Button 
              variant="default"
              className="w-full mb-3"
              onClick={handleEndRoundWithScoring}
            >
              <Flag className="w-4 h-4 mr-2" />
              Complete Round {currentRound} & Apply VP
            </Button>
            
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => setShowEndGame(true)}
            >
              <Power className="w-4 h-4 mr-2" />
              End Game
            </Button>
          </div>
        </motion.div>
      </div>
      
      {/* Initiative Dialog */}
      <InitiativeDialog
        open={showInitiativeDialog}
        onOpenChange={setShowInitiativeDialog}
        players={state.players}
        currentRound={currentRound}
        initiativePlayerId={initiativePlayerId}
        setInitiativePlayerId={setInitiativePlayerId}
        onConfirm={handleInitiativeSelected}
        onPhotoCapture={handlePhotoCapture}
      />
      
      {/* End Game Dialog */}
      <EndGameDialog
        open={showEndGame}
        onOpenChange={setShowEndGame}
        onConfirm={handleEndGame}
      />
      
      {/* Round Summary Dialog */}
      {editingRound && (
        <RoundSummary
          roundNumber={editingRound}
          players={state.players}
          units={getAllUnits()}
          mission={state.mission}
          onComplete={handleRoundEditComplete}
          onCancel={() => setEditingRound(null)}
        />
      )}
    </motion.div>
  );
};

export default Game;
