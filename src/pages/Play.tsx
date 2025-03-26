import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import GameSetup from '@/components/play/GameSetup';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/animations';
import { Player, Mission } from '@/types/game';
import { Button } from '@/components/ui/button';
import { ArrowLeftCircle, Crown } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';

interface GamePlayer {
  id: string;
  name: string;
  faction: {
    id: string;
    name: string;
    icon?: string;
  } | null;
  list: string | null;
  wab_id?: string;
  verified?: boolean;
  avatar_url?: string;
}

const Play = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { isWabAdmin } = useAuth();
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                    window.location.hostname.endsWith('.lovableproject.com');
  
  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      
      // If in preview mode or user is a wab-admin, grant access immediately
      if (isPreview || isWabAdmin) {
        setHasAccess(true);
        setIsLoading(false);
        return;
      }

      // Check if user has tester role
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data, error } = await supabase
          .from('profiles')
          .select('tester')
          .eq('id', session.user.id)
          .single();
          
        if (!error && data && data.tester) {
          setHasAccess(true);
        } else {
          setHasAccess(false);
          toast.error("You don't have access to this feature");
          navigate('/');
        }
      } else {
        setHasAccess(false);
        toast.error("Please log in to access this feature");
        navigate('/login');
      }
      
      setIsLoading(false);
    };

    checkAccess();
  }, [navigate, isPreview, isWabAdmin]);
  
  const handleSetupComplete = async (players: GamePlayer[], mission: Mission) => {
    console.log('Setting up game with mission:', mission);
    
    // Reset the game state first
    dispatch({ type: 'RESET_GAME' });
    
    // Record the verified players' WAB IDs to track game stats later
    const verifiedWabIds = players
      .filter(p => p.verified && p.wab_id)
      .map(p => ({ wab_id: p.wab_id, name: p.name }));
    
    if (verifiedWabIds.length > 0) {
      // Store the verified WAB IDs in localStorage for later use when the game ends
      localStorage.setItem('warcrow_verified_players', JSON.stringify(verifiedWabIds));
    }
    
    // Add players to the game state with correct type
    players.forEach(player => {
      dispatch({
        type: 'ADD_PLAYER',
        payload: {
          ...player,
          score: 0, // Initialize score to 0
          points: 0, // Add required field
          objectivePoints: 0 // Add required field
        } as Player
      });
    });

    // Set the mission
    dispatch({ type: 'SET_MISSION', payload: mission });

    // Transition to deployment phase
    dispatch({ type: 'SET_PHASE', payload: 'deployment' });

    // Navigate to deployment page
    toast.success(`Game setup complete! Starting mission: ${mission.name}`);
    navigate('/deployment');
  };
  
  const handleNavigateBack = () => {
    navigate('/landing');
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-warcrow-background flex items-center justify-center">
        <div className="text-warcrow-gold animate-pulse">Loading...</div>
      </div>
    );
  }
  
  if (!hasAccess) {
    return null; // Will redirect in useEffect
  }
  
  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      dispatch({ type: 'RESET_GAME' });
      // Also clear any stored game data
      localStorage.removeItem('warcrow_verified_players');
    }
  };
  
  return (
    <div className="min-h-screen bg-warcrow-background">
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="py-8"
      >
        {isWabAdmin && (
          <div className="container px-4 mb-6 flex justify-center">
            <div className="bg-black/50 border border-warcrow-gold/20 rounded-md p-4 flex gap-4 items-center">
              <Crown className="h-5 w-5 text-warcrow-gold" />
              <span className="text-warcrow-gold">You have admin privileges for game setup</span>
            </div>
          </div>
        )}
        
        <GameSetup onComplete={handleSetupComplete} />
        
        <div className="container px-4 mt-6 flex justify-center">
          <button 
            onClick={resetGame}
            className="border border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background transition-colors bg-transparent px-4 py-2 rounded"
          >
            Reset Game
          </button>
        </div>
        
        <motion.footer 
          className="p-4 border-t border-warcrow-gold/20 text-center text-sm text-warcrow-text mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="container flex justify-between items-center">
            <Button
              onClick={handleNavigateBack}
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold/10 flex items-center gap-2"
            >
              <ArrowLeftCircle size={18} />
              <span>Back to Home</span>
            </Button>
            <p>Warcrow Companion App - Made with ♥ for the Warcrow community</p>
          </div>
        </motion.footer>
      </motion.div>
    </div>
  );
};

export default Play;
