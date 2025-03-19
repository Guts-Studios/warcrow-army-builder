
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { toast } from 'sonner';
import { ArrowRight, Camera, Star, Target } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MissionScoring from '@/components/play/MissionScoring';
import { useGameScoring } from '@/hooks/useGameScoring';
import ObjectiveUpdate from '@/components/play/ObjectiveUpdate';

const Game = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [showObjectiveDialog, setShowObjectiveDialog] = useState(false);
  const [currentRound, setCurrentRound] = useState(1);
  
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
    
    // Increment round counter after scoring
    setCurrentRound(prev => prev + 1);
    toast.success(`Round ${currentRound} scored successfully`);
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
          
          <Card className="p-6">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Game Details</TabsTrigger>
                <TabsTrigger value="objectives">Objectives</TabsTrigger>
                <TabsTrigger value="scoring">Scoring</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-4">
                <h2 className="text-xl font-semibold mb-4">Game Information</h2>
                
                <div className="space-y-2 mb-6">
                  {state.mission && (
                    <p><strong>Mission:</strong> {state.mission.name}</p>
                  )}
                  <p><strong>Players:</strong> {Object.values(state.players).map(p => p.name).join(' vs ')}</p>
                  <p><strong>Current Turn:</strong> {state.currentTurn}</p>
                  <p><strong>Current Round:</strong> {currentRound}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.values(state.players).map(player => (
                    <div key={player.id} className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">{player.name}</h3>
                      <p><strong>Nation:</strong> {typeof player.faction === 'string' ? player.faction : player.faction?.name}</p>
                      <p><strong>Score:</strong> {player.score || 0}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="objectives" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Objectives</h2>
                  <Button 
                    onClick={() => setShowObjectiveDialog(true)}
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Target className="h-4 w-4" />
                    <span>Update Objective</span>
                  </Button>
                </div>
                
                {state.mission?.objectiveMarkers && state.mission.objectiveMarkers.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {state.mission.objectiveMarkers.map(marker => (
                      <div 
                        key={marker.id} 
                        className="p-3 border rounded-lg flex items-center gap-3"
                      >
                        <div 
                          className="w-6 h-6 rounded-full flex-shrink-0" 
                          style={{ backgroundColor: marker.color }}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{marker.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {marker.controlledBy ? 
                              `Controlled by: ${state.players[marker.controlledBy]?.name}` : 
                              'Not controlled'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No objective markers defined for this mission
                  </div>
                )}
                
                <ObjectiveUpdate 
                  open={showObjectiveDialog} 
                  onClose={() => setShowObjectiveDialog(false)} 
                />
              </TabsContent>
              
              <TabsContent value="scoring" className="mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">Round {currentRound} Scoring</h2>
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
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Game;
