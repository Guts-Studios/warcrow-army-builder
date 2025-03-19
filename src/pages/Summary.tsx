
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Home, RotateCw, Save, Flag, ArrowUp, ArrowDown } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import PhotoCapture from '@/components/PhotoCapture';
import UnitAnnotator from '@/components/play/UnitAnnotator';
import GameSummary from '@/components/play/GameSummary';
import RoundSummary from '@/components/play/RoundSummary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { fadeIn } from '@/lib/animations';
import { toast } from 'sonner';
import { Photo, Unit } from '@/types/game';
import { v4 as uuidv4 } from 'uuid';

type SummaryStep = 'scoring' | 'photo' | 'annotation' | 'summary';

const Summary = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [currentStep, setCurrentStep] = useState<SummaryStep>('scoring');
  const [viewingPhoto, setViewingPhoto] = useState<Photo | null>(null);
  const [editingRound, setEditingRound] = useState<number | null>(null);
  
  const players = Object.values(state.players);
  const playerIds = Object.keys(state.players);
  
  const [scores, setScores] = useState<Record<string, number>>(
    playerIds.reduce((acc, id) => ({ ...acc, [id]: state.players[id].score }), {})
  );
  
  const latestPhoto = state.photos.length > 0 
    ? state.photos[state.photos.length - 1] 
    : null;
  
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
    setCurrentStep('photo');
    toast.success('Scores saved successfully!');
  };
  
  const handlePhotoTaken = (photoData: string) => {
    const photoId = `photo-${Date.now()}`;
    const newPhoto: Photo = {
      id: photoId,
      url: photoData,
      timestamp: Date.now(),
      phase: 'endgame',
      annotations: []
    };
    
    dispatch({
      type: 'ADD_PHOTO',
      payload: newPhoto
    });
    toast.success('End game photo captured!');
    setCurrentStep('annotation');
  };
  
  const handleSaveAnnotations = (annotations: any[]) => {
    if (latestPhoto) {
      dispatch({
        type: 'UPDATE_PHOTO',
        payload: {
          id: latestPhoto.id,
          updates: { annotations }
        }
      });
    }
    
    dispatch({ type: 'SET_PHASE', payload: 'summary' });
    setCurrentStep('summary');
  };
  
  const handleNewGame = () => {
    dispatch({ type: 'RESET_GAME' });
    navigate('/');
  };

  const handleEditRound = (roundNumber: number) => {
    setEditingRound(roundNumber);
  };

  const handleRoundEditComplete = (roundScores: Record<string, number>, photo: Photo) => {
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
    
    if (photo && photo.url) {
      dispatch({
        type: 'ADD_PHOTO',
        payload: {
          ...photo,
          turnNumber: editingRound!
        }
      });
    }
    
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
                  className="neo-card p-5"
                >
                  <Label htmlFor={`score-${player.id}`} className="text-lg font-medium mb-2 block">
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
        
      case 'photo':
        return (
          <motion.div
            key="photo"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="max-w-2xl mx-auto space-y-6"
          >
            <h2 className="phase-title">Capture Final Game State</h2>
            
            <div className="mb-6 text-center">
              <p className="text-muted-foreground">
                Take a photo of the battlefield at the end of the game.
              </p>
            </div>
            
            <PhotoCapture 
              onPhotoTaken={handlePhotoTaken} 
              phase="endgame" 
              turn={state.currentTurn}
            />
            
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSkipToSummary}
                size="sm"
                variant="outline"
              >
                <Flag className="mr-2 w-4 h-4" />
                Skip Photo and Proceed to Summary
              </Button>
            </div>
          </motion.div>
        );
        
      case 'annotation':
        return (
          <motion.div
            key="annotation"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto space-y-6"
          >
            <h2 className="phase-title">Annotate Final Positions</h2>
            
            {latestPhoto && (
              <UnitAnnotator
                photoUrl={latestPhoto.url}
                units={getAllUnits()}
                initialAnnotations={latestPhoto.annotations}
                onSave={handleSaveAnnotations}
              />
            )}
            
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleSkipToSummary}
                size="sm"
                variant="outline"
              >
                <Flag className="mr-2 w-4 h-4" />
                Skip Annotation and Proceed to Summary
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
            <GameSummary 
              gameState={state} 
              onViewPhoto={(photo) => setViewingPhoto(photo)}
              onEditRoundScore={handleEditRound}
            />
            
            <div className="flex justify-center gap-4 mt-8">
              <Button
                variant="outline"
                onClick={handleNewGame}
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
        
        <Dialog open={!!viewingPhoto} onOpenChange={(open) => !open && setViewingPhoto(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Game Photo</DialogTitle>
            </DialogHeader>
            <div className="mt-2">
              {viewingPhoto && (
                <div className="relative">
                  <img 
                    src={viewingPhoto.url} 
                    alt="Game state" 
                    className="w-full rounded-lg"
                  />
                  
                  {viewingPhoto.annotations.map((annotation) => (
                    <div
                      key={annotation.id || annotation.unitId}
                      className="annotation-point"
                      style={{ left: `${annotation.x}%`, top: `${annotation.y}%` }}
                    >
                      {annotation.label.charAt(0)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
        
        {editingRound !== null && (
          <RoundSummary
            roundNumber={editingRound}
            players={state.players}
            units={getAllUnits()}
            onComplete={handleRoundEditComplete}
            onCancel={() => setEditingRound(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Summary;
