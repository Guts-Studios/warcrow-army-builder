
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useGame } from '@/context/GameContext';
import { 
  LayoutDashboard, 
  Swords, 
  PenSquare, 
  Flag, 
  Trophy,
  BookCopy,
  TrendingUp
} from 'lucide-react';
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Play = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useGame();
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                   window.location.hostname.endsWith('.lovableproject.com');
  
  useEffect(() => {
    const checkAccess = async () => {
      setIsLoading(true);
      
      // If in preview mode, grant access
      if (isPreview) {
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
          navigate('/landing');
        }
      } else {
        setHasAccess(false);
        toast.error("Please log in to access this feature");
        navigate('/login');
      }
      
      setIsLoading(false);
    };

    checkAccess();
  }, [navigate, isPreview]);
  
  // Simple animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };
  
  // Helper to get button variant based on current phase
  const getButtonVariant = (buttonPhase: string) => {
    if (buttonPhase === state.currentPhase) return "default";
    
    // Enable setup button always
    if (buttonPhase === 'setup') return "outline";
    
    // Enable deployment if setup is complete
    if (buttonPhase === 'deployment' && state.currentPhase !== 'setup') {
      return "outline";
    }
    
    // Enable game if deployment is complete
    if (buttonPhase === 'game' && ['deployment', 'game', 'scoring', 'summary'].includes(state.currentPhase)) {
      return "outline";
    }
    
    // Enable scoring if game is complete
    if (buttonPhase === 'scoring' && ['game', 'scoring', 'summary'].includes(state.currentPhase)) {
      return "outline";
    }
    
    // Enable summary if scoring is complete
    if (buttonPhase === 'summary' && ['scoring', 'summary'].includes(state.currentPhase)) {
      return "outline";
    }
    
    return "outline";
  };
  
  // Helper to disable buttons for phases that aren't available yet
  const isButtonDisabled = (buttonPhase: string) => {
    if (buttonPhase === 'setup') return false;
    if (buttonPhase === 'deployment' && state.currentPhase === 'setup') return true;
    if (buttonPhase === 'game' && ['setup'].includes(state.currentPhase)) return true;
    if (buttonPhase === 'scoring' && ['setup', 'deployment'].includes(state.currentPhase)) return true;
    if (buttonPhase === 'summary' && ['setup', 'deployment', 'game'].includes(state.currentPhase)) return true;
    return false;
  };
  
  const resetGame = () => {
    if (window.confirm('Are you sure you want to reset the game? All progress will be lost.')) {
      dispatch({ type: 'RESET_GAME' });
      navigate('/play');
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-warcrow-background flex items-center justify-center">
        <div className="text-warcrow-gold">Loading...</div>
      </div>
    );
  }
  
  if (!hasAccess) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="min-h-screen bg-warcrow-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-2 text-warcrow-gold">Warcrow Companion</h1>
          <p className="text-warcrow-text max-w-md mx-auto">
            Track your games, manage objectives, and keep score with this digital companion app.
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="col-span-full md:col-span-1">
            <Button
              onClick={() => navigate('/setup')}
              variant={getButtonVariant('setup')}
              disabled={isButtonDisabled('setup')}
              className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-black border-warcrow-gold text-warcrow-gold hover:bg-black/80"
            >
              <LayoutDashboard className="w-6 h-6" />
              <span>Game Setup</span>
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="col-span-full md:col-span-1">
            <Button
              onClick={() => navigate('/deployment')}
              variant={getButtonVariant('deployment')}
              disabled={isButtonDisabled('deployment')}
              className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-black border-warcrow-gold text-warcrow-gold hover:bg-black/80"
            >
              <Swords className="w-6 h-6" />
              <span>Deployment</span>
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="col-span-full md:col-span-1">
            <Button
              onClick={() => navigate('/game')}
              variant={getButtonVariant('game')}
              disabled={isButtonDisabled('game')}
              className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-black border-warcrow-gold text-warcrow-gold hover:bg-black/80"
            >
              <Flag className="w-6 h-6" />
              <span>Game</span>
            </Button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="col-span-full md:col-span-1 md:col-start-2">
            <Button
              onClick={() => navigate('/summary')}
              variant={getButtonVariant('summary')}
              disabled={isButtonDisabled('summary')}
              className="w-full h-24 flex flex-col items-center justify-center gap-2 bg-black border-warcrow-gold text-warcrow-gold hover:bg-black/80"
            >
              <Trophy className="w-6 h-6" />
              <span>Game Summary</span>
            </Button>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Button 
            variant="outline"
            onClick={resetGame}
            className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
          >
            Reset Game
          </Button>
        </motion.div>
      </div>
      
      <motion.footer 
        className="p-4 border-t border-warcrow-gold/20 text-center text-sm text-warcrow-text"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>Warcrow Companion App - Made with ♥ for the Warcrow community</p>
      </motion.footer>
    </div>
  );
};

export default Play;
