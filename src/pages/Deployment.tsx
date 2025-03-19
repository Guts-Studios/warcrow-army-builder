
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { fadeIn } from '@/lib/animations';
import { toast } from 'sonner';
import PhotoCapture from '@/components/PhotoCapture';
import { v4 as uuidv4 } from 'uuid';

const Deployment = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [takingPhoto, setTakingPhoto] = useState(false);
  const [rollOffComplete, setRollOffComplete] = useState(!!state.rollOffWinner);
  const [deploymentComplete, setDeploymentComplete] = useState(false);

  const players = Object.values(state.players);
  
  useEffect(() => {
    if (state.currentPhase !== 'deployment') {
      navigate('/setup');
    }
  }, [state.currentPhase, navigate]);

  const handleRollOff = () => {
    // Simulate a roll-off between players
    const winnerIndex = Math.floor(Math.random() * players.length);
    const winnerId = players[winnerIndex].id;
    
    dispatch({ 
      type: 'SET_ROLL_OFF_WINNER', 
      payload: winnerId 
    });
    
    dispatch({
      type: 'ADD_GAME_EVENT',
      payload: {
        id: uuidv4(),
        timestamp: Date.now(),
        type: 'initiative',
        playerId: winnerId,
        description: `${players[winnerIndex].name} won the deployment roll-off`,
      }
    });
    
    toast.success(`${players[winnerIndex].name} won the roll-off and will choose deployment order!`);
    setRollOffComplete(true);
  };
  
  const handleSetFirstToDeployChoice = (playerId: string) => {
    dispatch({ 
      type: 'SET_FIRST_TO_DEPLOY', 
      payload: playerId 
    });
    
    // Set the other player to go first for initiative
    const otherPlayerId = players.find(p => p.id !== playerId)?.id;
    if (otherPlayerId) {
      dispatch({ 
        type: 'SET_INITIAL_INITIATIVE', 
        payload: otherPlayerId 
      });
      
      dispatch({
        type: 'ADD_GAME_EVENT',
        payload: {
          id: uuidv4(),
          timestamp: Date.now(),
          type: 'initiative',
          playerId: playerId,
          description: `${state.players[playerId].name} chose to deploy first. ${state.players[otherPlayerId].name} will have first turn.`,
        }
      });
    }
    
    setDeploymentComplete(true);
  };
  
  const handlePhotoTaken = (photoData: string) => {
    dispatch({
      type: 'ADD_PHOTO',
      payload: {
        id: `deployment-photo-${Date.now()}`,
        url: photoData,
        timestamp: Date.now(),
        phase: 'deployment',
        annotations: []
      }
    });
    
    setTakingPhoto(false);
    toast.success('Deployment photo saved!');
  };
  
  const handleStartGame = () => {
    dispatch({ type: 'SET_PHASE', payload: 'game' });
    navigate('/game');
  };

  return (
    <div className="min-h-screen py-8 bg-background">
      <div className="container max-w-4xl mx-auto px-4">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="space-y-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8">Deployment Phase</h1>
          
          {!rollOffComplete ? (
            <div className="neo-card p-6 space-y-4">
              <h2 className="text-xl font-semibold">Roll-Off</h2>
              <p className="text-muted-foreground">
                The players roll off to determine who will choose which player deploys first.
              </p>
              <div className="flex justify-center pt-4">
                <Button onClick={handleRollOff} size="lg">
                  <Shuffle className="mr-2 h-5 w-5" />
                  Roll for Deployment
                </Button>
              </div>
            </div>
          ) : !state.firstToDeployPlayerId ? (
            <div className="neo-card p-6 space-y-4">
              <h2 className="text-xl font-semibold">Choose Deployment Order</h2>
              <p className="text-muted-foreground">
                {state.players[state.rollOffWinner!].name} won the roll-off and can choose who deploys first.
                <br />
                <em className="text-sm">Remember: The player who deploys first gets second turn.</em>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                {players.map((player) => (
                  <Button 
                    key={player.id}
                    onClick={() => handleSetFirstToDeployChoice(player.id)} 
                    variant="outline"
                    className="h-auto py-3"
                  >
                    {player.name} deploys first
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="neo-card p-6 space-y-4">
              <h2 className="text-xl font-semibold">Deployment Choices</h2>
              <div className="space-y-2">
                <p>
                  <strong>First to deploy:</strong> {state.players[state.firstToDeployPlayerId].name}
                </p>
                <p>
                  <strong>First turn:</strong> {state.players[state.initialInitiativePlayerId!].name}
                </p>
              </div>
              
              <p className="text-muted-foreground pt-2">
                Deploy your forces according to the mission parameters.
                When both players have finished deploying, you can begin the game.
              </p>
              
              {takingPhoto ? (
                <div className="pt-4 space-y-4">
                  <h3 className="text-lg font-medium">Capture Deployment Photo</h3>
                  <PhotoCapture onPhotoTaken={handlePhotoTaken} phase="deployment" />
                  <Button 
                    variant="outline" 
                    onClick={() => setTakingPhoto(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setTakingPhoto(true)}
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Take Deployment Photo
                  </Button>
                  
                  <Button onClick={handleStartGame}>
                    Start Game
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Deployment;
