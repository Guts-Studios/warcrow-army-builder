import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import PlayerInfo from '@/components/PlayerInfo';
import PhotoCapture from '@/components/PhotoCapture';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const Deployment = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();

  // Local state for deployment configuration
  const [initialInitiativePlayerId, setInitialInitiativePlayerId] = useState<string | null>(null);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);
  const [hasDeploymentPhoto, setHasDeploymentPhoto] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showInitiativeDialog, setShowInitiativeDialog] = useState(false);

  // Function to handle photo capture completion
  const handlePhotoTaken = (photoData: string) => {
    const newPhotoId = `photo-${Date.now()}`;
    const newPhoto = {
      id: newPhotoId,
      url: photoData,
      timestamp: Date.now(),
      phase: 'deployment' as const,
      annotations: [],
    };

    // Dispatch the new photo to the game state
    dispatch({ type: 'ADD_PHOTO', payload: newPhoto });
    setHasDeploymentPhoto(true);
    setShowPhotoCapture(false);
    toast.success('Deployment photo captured!');
  };

  const handleShowPhotoCapture = () => {
    setShowPhotoCapture(true);
  };

  // Function to skip taking a photo
  const handleSkipPhoto = () => {
    setHasDeploymentPhoto(true);
    toast.info('Deployment photo skipped');
  };

  // Function to handle selecting who deploys first
  const handleSelectFirstToDeploy = (playerId: string) => {
    dispatch({ type: 'SET_FIRST_TO_DEPLOY', payload: playerId });
    toast.success(`${state.players[playerId].name} will deploy first`);
  };

  // Function to select which player has initiative for the first turn
  const handleSelectInitiative = (playerId: string) => {
    dispatch({ type: 'SET_INITIAL_INITIATIVE', payload: playerId });
    setInitialInitiativePlayerId(playerId);
    setShowInitiativeDialog(false);
    
    // Start the game with first turn and specified active player
    dispatch({ 
      type: 'START_TURN', 
      payload: { 
        turnNumber: 1, 
        activePlayer: playerId 
      } 
    });
    
    dispatch({ type: 'SET_PHASE', payload: 'game' });
    toast.success('Starting the game!');
    navigate('/game');
  };

  // Function to start the game
  const handleStartGame = () => {
    setShowInitiativeDialog(true);
  };

  // Function to render player info section 
  const renderPlayerInfo = (playerId: string, index: number) => {
    return (
      <PlayerInfo
        key={playerId}
        playerId={playerId}
        index={index}
      />
    );
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="container py-8 max-w-5xl mx-auto"
    >
      <h1 className="phase-title text-center mb-8">Deployment Phase</h1>
      
      {/* Mission Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="neo-card p-6 mb-8"
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-4">
          <div>
            <h2 className="text-xl font-semibold mb-2">Mission: {state.mission?.name}</h2>
            <p className="text-muted-foreground">{state.mission?.description}</p>
            
            <div className="mt-4">
              <h3 className="font-medium mb-1">Objectives</h3>
              <p className="text-sm">{state.mission?.objectiveDescription}</p>
            </div>
            
            {state.mission?.specialRules && state.mission.specialRules.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-1">Special Rules</h3>
                <ul className="text-sm list-disc pl-5">
                  {state.mission.specialRules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {state.mission?.mapImage && (
            <div className="flex-shrink-0">
              <div 
                className="w-40 h-40 bg-muted rounded-md overflow-hidden cursor-pointer"
                onClick={() => setShowMap(true)}
              >
                <img 
                  src={state.mission.mapImage} 
                  alt="Mission map" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-1 text-xs text-muted-foreground">
                Click to expand
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Players' deployment sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        {Object.entries(state.players).map(([playerId, _], index) => 
          renderPlayerInfo(playerId, index)
        )}
      </motion.div>
      
      {/* Deployment order Selection - REPLACED DROPDOWN WITH BUTTONS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="neo-card p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Deployment Order</h2>
        
        <div className="bg-muted/30 rounded-md p-4">
          <h3 className="font-medium text-center mb-4">Who deploys first?</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(state.players).map(([playerId, player]) => (
              <Button
                key={playerId}
                onClick={() => handleSelectFirstToDeploy(playerId)}
                variant={state.firstToDeployPlayerId === playerId ? "default" : "outline"}
                className="py-6 flex flex-col gap-2 h-auto"
              >
                <span className="text-lg font-medium">{player.name}</span>
                <span className="text-sm">Deploys First</span>
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Deployment actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="neo-card p-6 mb-8"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Deployment Photo</h2>
        
        <div className="mt-6 flex flex-col gap-2">
          <Button
            onClick={handleShowPhotoCapture}
            className="w-full"
          >
            Capture Deployment Photo
          </Button>
          <Button
            onClick={handleSkipPhoto}
            variant="outline"
            className="w-full"
          >
            Skip Photo
          </Button>
        </div>
      </motion.div>
      
      {/* Start Game button - centered */}
      <div className="flex justify-center mt-8 mb-4">
        <Button
          onClick={handleStartGame}
          disabled={!state.firstToDeployPlayerId}
          size="lg"
          className="px-10"
        >
          Start Game
        </Button>
      </div>
      
      {/* Navigation back button */}
      <div className="flex justify-start mt-4">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
        >
          Back to Setup
        </Button>
      </div>
      
      {/* Photo capture modal */}
      {showPhotoCapture && (
        <Dialog open={showPhotoCapture} onOpenChange={setShowPhotoCapture}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Capture Deployment Photo</DialogTitle>
              <DialogDescription>
                Take a photo of the battlefield after deployment is complete.
              </DialogDescription>
            </DialogHeader>
            <PhotoCapture
              onPhotoTaken={handlePhotoTaken}
              phase="deployment"
              turn={0} // Adding the required turn prop (0 for deployment phase)
            />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Map view dialog */}
      {state.mission?.mapImage && (
        <Dialog open={showMap} onOpenChange={setShowMap}>
          <DialogHeader>
            <DialogTitle>Mission Map: {state.mission.name}</DialogTitle>
          </DialogHeader>
          <div className="w-full overflow-hidden rounded-md">
            <img 
              src={state.mission.mapImage} 
              alt="Mission map" 
              className="w-full object-contain"
            />
          </div>
        </Dialog>
      )}

      {/* Initiative Selection Dialog */}
      <Dialog open={showInitiativeDialog} onOpenChange={setShowInitiativeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select First Player</DialogTitle>
            <DialogDescription>
              Choose which player has the initiative for the first turn.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            {Object.entries(state.players).map(([playerId, player]) => (
              <Button 
                key={playerId}
                className="py-8 flex flex-col gap-2"
                onClick={() => handleSelectInitiative(playerId)}
              >
                <span className="text-xl font-bold">{player.name}</span>
                <span className="text-sm">Has First Initiative</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default Deployment;
