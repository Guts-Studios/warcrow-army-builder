
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { ArrowRightCircle, Loader2 } from 'lucide-react';
import { fadeIn } from '@/lib/animations';
import { getGameByJoinCode } from '@/utils/joinCodeUtils';
import { toast } from 'sonner';

const JoinGame: React.FC = () => {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Remove non-alphanumeric characters and convert to uppercase
    const sanitizedCode = e.target.value.replace(/[^A-Za-z0-9-]/g, '').toUpperCase();
    
    // Remove dashes for processing
    const processedCode = sanitizedCode.replace(/-/g, '');
    
    // Format with a dash in the middle if long enough (XXX-XXX)
    if (processedCode.length > 3) {
      const formattedCode = `${processedCode.slice(0, 3)}-${processedCode.slice(3, 6)}`;
      setJoinCode(formattedCode);
    } else {
      setJoinCode(sanitizedCode);
    }
  };

  const handleJoinGame = async () => {
    // Remove any dashes for processing
    const processedCode = joinCode.replace(/-/g, '');
    
    if (processedCode.length !== 6) {
      toast.error("Please enter a valid 6-character join code");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const gameId = await getGameByJoinCode(processedCode);
      
      if (gameId) {
        toast.success("Join code valid! Connecting to game...");
        // Store the joined game id in local storage
        localStorage.setItem('warcrow_joined_game', gameId);
        navigate('/deployment');
      } else {
        toast.error("Invalid or expired join code. Please check and try again.");
      }
    } catch (err) {
      console.error("Error joining game:", err);
      toast.error("Failed to join game. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="p-6 bg-warcrow-accent border border-warcrow-gold/30 rounded-xl shadow-md max-w-md mx-auto"
    >
      <h2 className="text-2xl font-semibold text-warcrow-gold mb-4 text-center">Join Existing Game</h2>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <Label 
            htmlFor="join-code-input" 
            className="text-base font-medium text-warcrow-text"
          >
            Enter Join Code
          </Label>
          <Input
            id="join-code-input"
            value={joinCode}
            onChange={handleJoinCodeChange}
            placeholder="XXX-XXX"
            className="h-12 text-center text-lg font-mono tracking-widest bg-warcrow-background border-warcrow-gold/40 text-warcrow-gold"
            maxLength={7} // 6 chars + 1 dash
          />
          <p className="text-xs text-warcrow-text/70 text-center">
            Enter the 6-character code shared by your opponent
          </p>
        </div>
        
        <Button
          onClick={handleJoinGame}
          disabled={isLoading || joinCode.replace(/-/g, '').length !== 6}
          className="w-full h-12 bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <ArrowRightCircle className="h-5 w-5" />
              <span>Join Game</span>
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
};

export default JoinGame;
