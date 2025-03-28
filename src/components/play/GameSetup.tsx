import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Swords, ShieldCheck, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Faction, Mission } from '@/types/game';
import FactionSelector from './FactionSelector';
import MissionSelector from './MissionSelector';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { fadeIn, slideInRight } from '@/lib/animations';
import JoinCodeShare from './JoinCodeShare';

interface Player {
  id: string;
  name: string;
  faction: Faction | null;
  list: string | null;
  wab_id?: string;
  verified?: boolean;
  avatar_url?: string;
}

interface UserProfile {
  id: string;
  username: string;
  wab_id: string;
  avatar_url?: string;
}

interface GameSetupProps {
  onComplete: (players: Player[], mission: Mission) => void;
  currentUser?: UserProfile | null;
  isLoading?: boolean;
}

const GameSetup: React.FC<GameSetupProps> = ({ 
  onComplete, 
  currentUser, 
  isLoading = false 
}) => {
  const [step, setStep] = useState<number>(1);
  const [playerOne, setPlayerOne] = useState<Player>({
    id: 'player-1',
    name: '',
    faction: null,
    list: null,
  });
  const [playerTwo, setPlayerTwo] = useState<Player>({
    id: 'player-2',
    name: '',
    faction: null,
    list: null,
  });
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [showJoinCodeDialog, setShowJoinCodeDialog] = useState(false);
  const [gameId, setGameId] = useState<string>(`game-${Date.now()}`);

  useEffect(() => {
    if (currentUser && !isLoading) {
      setPlayerOne(prev => ({
        ...prev,
        name: currentUser.username,
        wab_id: currentUser.wab_id,
        verified: true,
        avatar_url: currentUser.avatar_url
      }));
    }
  }, [currentUser, isLoading]);

  const goToNextStep = () => {
    if (step === 1) {
      if (!playerOne.name.trim() || !playerTwo.name.trim()) {
        toast.error('Please enter names for both players');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!selectedMission) {
        toast.error('Please select a mission');
        return;
      }
      onComplete([playerOne, playerTwo], selectedMission);
    }
  };

  const goToPrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleInvitePlayer = () => {
    setShowJoinCodeDialog(true);
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-warcrow-gold mb-4">Who's Playing?</h2>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="player-one-name" className="text-base font-medium flex items-center gap-2 text-warcrow-text">
                  <User className="w-5 h-5 text-warcrow-gold" />
                  <span>Player One {currentUser ? '(You)' : ''}</span>
                </Label>
                <Input
                  id="player-one-name"
                  placeholder="Enter player name"
                  value={playerOne.name}
                  onChange={(e) => setPlayerOne({ ...playerOne, name: e.target.value })}
                  className="h-12 bg-warcrow-accent border-warcrow-gold/40 text-warcrow-text focus-visible:ring-warcrow-gold"
                  disabled={isLoading}
                />
                {playerOne.wab_id && (
                  <div className="text-xs text-warcrow-gold">
                    WAB ID: {playerOne.wab_id} {playerOne.verified && '✓'}
                  </div>
                )}
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="player-two-name" className="text-base font-medium flex items-center gap-2 text-warcrow-text">
                  <User className="w-5 h-5 text-warcrow-gold" />
                  <span>Player Two</span>
                </Label>
                <Input
                  id="player-two-name"
                  placeholder="Enter player name"
                  value={playerTwo.name}
                  onChange={(e) => setPlayerTwo({ ...playerTwo, name: e.target.value })}
                  className="h-12 bg-warcrow-accent border-warcrow-gold/40 text-warcrow-text focus-visible:ring-warcrow-gold"
                />
              </div>
            </div>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            key="step2"
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-warcrow-gold mb-4">Select Nations</h2>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium flex items-center gap-2 text-warcrow-text">
                  <ShieldCheck className="w-5 h-5 text-warcrow-gold" />
                  <span>{playerOne.name}'s Nation</span>
                </Label>
                <FactionSelector
                  selectedFaction={playerOne.faction}
                  onSelectFaction={(faction) => setPlayerOne({ ...playerOne, faction })}
                />
              </div>
              
              <div className="space-y-4">
                <Label className="text-base font-medium flex items-center gap-2 text-warcrow-text">
                  <ShieldCheck className="w-5 h-5 text-warcrow-gold" />
                  <span>{playerTwo.name}'s Nation</span>
                </Label>
                <FactionSelector
                  selectedFaction={playerTwo.faction}
                  onSelectFaction={(faction) => setPlayerTwo({ ...playerTwo, faction })}
                />
              </div>
            </div>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            key="step3"
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <h2 className="text-2xl font-semibold text-warcrow-gold mb-4">Select Mission</h2>
            
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2 text-warcrow-text">
                <Swords className="w-5 h-5 text-warcrow-gold" />
                <span>Choose a Mission</span>
              </Label>
              <MissionSelector
                selectedMission={selectedMission}
                onSelectMission={setSelectedMission}
              />
            </div>
          </motion.div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className="flex items-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: step >= stepNumber ? 1 : 0.8, 
                  opacity: 1 
                }}
                transition={{ delay: stepNumber * 0.1 }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center",
                  step > stepNumber 
                    ? "bg-warcrow-gold text-warcrow-background" 
                    : step === stepNumber 
                      ? "bg-transparent text-warcrow-gold border-2 border-warcrow-gold" 
                      : "bg-warcrow-accent/30 text-warcrow-text"
                )}
              >
                {stepNumber === 1 && <User className="w-5 h-5" />}
                {stepNumber === 2 && <ShieldCheck className="w-5 h-5" />}
                {stepNumber === 3 && <Swords className="w-5 h-5" />}
              </motion.div>
              
              {stepNumber < 3 && (
                <div 
                  className={cn(
                    "w-full h-1 mx-1",
                    step > stepNumber ? "bg-warcrow-gold" : "bg-warcrow-accent/30"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8 min-h-[400px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-[400px]">
            <div className="animate-pulse text-warcrow-gold">Loading user data...</div>
          </div>
        ) : (
          renderStepContent()
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={goToPrevStep}
          disabled={step === 1}
          className="w-32 border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background disabled:opacity-50"
        >
          Back
        </Button>
        
        {step === 1 && currentUser?.wab_id && (
          <Button
            variant="outline"
            onClick={handleInvitePlayer}
            className="flex items-center gap-2"
          >
            <Users className="w-4 h-4" />
            <span>Invite Player</span>
          </Button>
        )}
        
        <Button
          onClick={goToNextStep}
          className="w-32 bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90"
          disabled={isLoading}
        >
          {step === 3 ? 'Start Game' : 'Next'}
        </Button>
      </div>

      <JoinCodeShare 
        gameId={gameId} 
        hostName={playerOne.name}
        isOpen={showJoinCodeDialog} 
        onClose={() => setShowJoinCodeDialog(false)}
      />
    </div>
  );
};

export default GameSetup;
