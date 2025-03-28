
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';
import { toast } from 'sonner';
import JoinCodeShare from './JoinCodeShare';

interface UserProfile {
  id: string;
  username: string;
  wab_id: string;
  avatar_url?: string;
}

interface GameSetupProps {
  onStartGame: () => void;
  currentUser?: UserProfile | null;
  isLoading?: boolean;
}

const GameSetup: React.FC<GameSetupProps> = ({
  onStartGame,
  currentUser,
  isLoading = false
}) => {
  const [playerName, setPlayerName] = useState<string>('');
  const [showJoinCodeDialog, setShowJoinCodeDialog] = useState(false);
  const [gameId] = useState<string>(`game-${Date.now()}`);

  useEffect(() => {
    if (currentUser && !isLoading) {
      setPlayerName(currentUser.username);
    }
  }, [currentUser, isLoading]);

  const handleStartGame = () => {
    if (!playerName.trim()) {
      toast.error('Please enter your name before starting');
      return;
    }
    
    // Store player name in local storage for use in deployment
    localStorage.setItem('warcrow_host_name', playerName);
    
    onStartGame();
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="mb-8 min-h-[200px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-[200px]">
            <div className="animate-pulse text-warcrow-gold">Loading user data...</div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-warcrow-gold mb-4">Host New Game</h2>
            
            <div className="space-y-4">
              <Label htmlFor="player-name" className="text-base font-medium flex items-center gap-2 text-warcrow-text">
                <User className="w-5 h-5 text-warcrow-gold" />
                <span>Your Name {currentUser ? '(Signed In)' : ''}</span>
              </Label>
              <Input
                id="player-name"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="h-12 bg-warcrow-accent border-warcrow-gold/40 text-warcrow-text focus-visible:ring-warcrow-gold"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setShowJoinCodeDialog(true)}
          className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold/10 disabled:opacity-50"
        >
          Share Invite Code
        </Button>
        
        <Button
          onClick={handleStartGame}
          className="w-32 bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90"
          disabled={isLoading || !playerName.trim()}
        >
          Start Game
        </Button>
      </div>

      <JoinCodeShare 
        gameId={gameId} 
        hostName={playerName}
        isOpen={showJoinCodeDialog} 
        onClose={() => setShowJoinCodeDialog(false)}
      />
    </div>
  );
};

export default GameSetup;
