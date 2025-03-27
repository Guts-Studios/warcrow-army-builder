
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PlayerInfo from '@/components/PlayerInfo';
import { toast } from 'sonner';
import { Map, Shield, ArrowLeftCircle, AlertCircle, Users, UserPlus } from 'lucide-react';
import JoinCodeShare from '@/components/play/JoinCodeShare';
import FriendInviteDialog from '@/components/play/FriendInviteDialog';
import { useFriends } from '@/hooks/useFriends';
import { supabase } from '@/integrations/supabase/client';

const Deployment = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [userId, setUserId] = useState<string | null>(null);

  // Local state for deployment configuration
  const [initialInitiativePlayerId, setInitialInitiativePlayerId] = useState<string | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [showInitiativeDialog, setShowInitiativeDialog] = useState(false);
  const [showJoinCodeDialog, setShowJoinCodeDialog] = useState(false);
  const [showFriendInviteDialog, setShowFriendInviteDialog] = useState(false);
  
  // Get the user session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user?.id) {
        setUserId(data.session.user.id);
      }
    };
    
    getSession();
  }, []);
  
  // Get friends list if we have a user ID
  const { friends, isLoading: isFriendsLoading } = useFriends(userId || 'preview-user-id');

  useEffect(() => {
    // Check if this is a joined game
    const joinedGameId = localStorage.getItem('warcrow_joined_game');
    if (joinedGameId) {
      // In a real implementation, we would fetch the game state from the database
      console.log('Joined game with ID:', joinedGameId);
      // Clear the joined game ID since we're now in the game
      localStorage.removeItem('warcrow_joined_game');
    }
  }, []);

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

  // Function to show join code
  const handleShowJoinCode = () => {
    setShowJoinCodeDialog(true);
  };
  
  // Function to show friend invite dialog
  const handleShowFriendInvite = () => {
    setShowFriendInviteDialog(true);
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
  
  // Get current player's name for sending invitations
  const getCurrentPlayerName = () => {
    if (!userId) return "A player";
    
    // Find the player that might correspond to the current user
    const playerEntry = Object.entries(state.players).find(
      ([_, player]) => player.wab_id && userId.includes(player.wab_id)
    );
    
    return playerEntry ? playerEntry[1].name : "A player";
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen bg-warcrow-background text-warcrow-text container py-8 max-w-5xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-warcrow-gold text-center mb-8 tracking-wider">Deployment Phase</h1>
      
      {/* Invite buttons row */}
      <div className="flex justify-center mb-8 gap-4 flex-wrap">
        <Button
          variant="outline"
          onClick={handleShowJoinCode}
          className="flex items-center gap-2"
        >
          <Users className="h-5 w-5" />
          <span>Invite Player with Code</span>
        </Button>
        
        {userId && (
          <Button
            variant="outline"
            onClick={handleShowFriendInvite}
            className="flex items-center gap-2 border-warcrow-gold/50 bg-warcrow-background hover:bg-warcrow-gold/10"
          >
            <UserPlus className="h-5 w-5 text-warcrow-gold" />
            <span className="text-warcrow-gold">Invite Friends</span>
          </Button>
        )}
      </div>
      
      {/* Mission Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-warcrow-accent border border-warcrow-gold/30 rounded-xl p-6 mb-8 shadow-md"
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-4">
          <div className="space-y-4 flex-1">
            <div>
              <h2 className="text-2xl font-semibold mb-2 text-warcrow-gold">
                {state.mission?.name || "Mission"}
              </h2>
              <p className="text-warcrow-text/90 leading-relaxed">
                {state.mission?.description || "No mission description available"}
              </p>
            </div>
            
            <div className="pt-2">
              <h3 className="font-medium mb-1 text-warcrow-gold text-lg">Objectives</h3>
              <p className="text-warcrow-text/90 leading-relaxed">
                {state.mission?.objectiveDescription || "No objectives defined"}
              </p>
            </div>
            
            {state.mission?.specialRules && state.mission.specialRules.length > 0 && (
              <div className="pt-2">
                <h3 className="font-medium mb-1 text-warcrow-gold text-lg">Special Rules</h3>
                <ul className="text-warcrow-text/90 list-disc pl-5 space-y-1">
                  {state.mission.specialRules.map((rule, i) => (
                    <li key={i} className="leading-relaxed">{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {state.mission?.mapImage && (
            <div className="flex-shrink-0">
              <div 
                className="w-48 h-48 bg-warcrow-background border border-warcrow-gold/30 rounded-md overflow-hidden cursor-pointer shadow-md transition-transform hover:scale-105 hover:shadow-lg duration-300"
                onClick={() => setShowMap(true)}
              >
                <img 
                  src={state.mission.mapImage} 
                  alt="Mission map" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center mt-2 text-sm text-warcrow-gold flex justify-center items-center gap-1">
                <Map size={16} />
                <span>Click to expand</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Players' deployment sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"
      >
        {Object.entries(state.players).map(([playerId, _], index) => 
          renderPlayerInfo(playerId, index)
        )}
      </motion.div>
      
      {/* Deployment order Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-warcrow-accent border border-warcrow-gold/30 rounded-xl p-6 mb-8 shadow-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center text-warcrow-gold">Deployment Order</h2>
        
        <div className="bg-warcrow-background/50 rounded-md p-6 border border-warcrow-gold/20">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="text-warcrow-gold w-5 h-5" />
            <h3 className="font-medium text-center text-warcrow-gold text-lg">Who deploys first?</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(state.players).map(([playerId, player]) => (
              <Button
                key={playerId}
                onClick={() => handleSelectFirstToDeploy(playerId)}
                variant={state.firstToDeployPlayerId === playerId ? "default" : "outline"}
                className={`py-6 flex flex-col gap-2 h-auto border border-warcrow-gold/30 ${
                  state.firstToDeployPlayerId === playerId 
                    ? "bg-warcrow-gold text-warcrow-background" 
                    : "bg-warcrow-background text-warcrow-text hover:bg-warcrow-gold/20"
                }`}
              >
                <span className="text-lg font-medium">{player.name}</span>
                <span className="text-sm">Deploys First</span>
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
      
      {/* Start Game button - centered */}
      <div className="flex justify-center mt-8 mb-8">
        <Button
          onClick={handleStartGame}
          disabled={!state.firstToDeployPlayerId}
          size="lg"
          className={`px-10 py-6 text-lg ${
            !state.firstToDeployPlayerId 
              ? "bg-warcrow-accent/50 text-warcrow-text/50 cursor-not-allowed" 
              : "bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90"
          }`}
        >
          Start Game
        </Button>
      </div>
      
      {/* Navigation back button */}
      <div className="flex justify-start mt-4 mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10 flex items-center gap-2"
        >
          <ArrowLeftCircle size={18} />
          <span>Back to Setup</span>
        </Button>
      </div>
      
      {/* Map view dialog */}
      {state.mission?.mapImage && (
        <Dialog open={showMap} onOpenChange={setShowMap}>
          <DialogContent className="max-w-3xl bg-warcrow-background border-warcrow-gold/30">
            <DialogHeader>
              <DialogTitle className="text-warcrow-gold">Mission Map: {state.mission.name}</DialogTitle>
            </DialogHeader>
            <div className="w-full overflow-hidden rounded-md border border-warcrow-gold/20">
              <img 
                src={state.mission.mapImage} 
                alt="Mission map" 
                className="w-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Initiative Selection Dialog */}
      <Dialog open={showInitiativeDialog} onOpenChange={setShowInitiativeDialog}>
        <DialogContent className="max-w-md bg-warcrow-background border-warcrow-gold/30">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">Select First Player</DialogTitle>
            <DialogDescription className="text-warcrow-text/90">
              Choose which player has the initiative for the first turn.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
            {Object.entries(state.players).map(([playerId, player]) => (
              <Button 
                key={playerId}
                className="py-8 flex flex-col gap-2 bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90"
                onClick={() => handleSelectInitiative(playerId)}
              >
                <span className="text-xl font-bold">{player.name}</span>
                <span className="text-sm">Has First Initiative</span>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Join Code Dialog */}
      <JoinCodeShare 
        gameId={state.id} 
        isOpen={showJoinCodeDialog} 
        onClose={() => setShowJoinCodeDialog(false)}
      />
      
      {/* Friend Invite Dialog */}
      <FriendInviteDialog
        gameId={state.id}
        playerName={getCurrentPlayerName()}
        isOpen={showFriendInviteDialog}
        onClose={() => setShowFriendInviteDialog(false)}
        friends={friends}
        isLoading={isFriendsLoading}
      />
    </motion.div>
  );
};

export default Deployment;
