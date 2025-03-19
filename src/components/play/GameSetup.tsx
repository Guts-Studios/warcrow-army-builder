
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Swords, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Faction, Mission } from '@/types/game';
import FactionSelector from './FactionSelector';
import MissionSelector from './MissionSelector';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { fadeIn, slideInRight } from '@/lib/animations';

interface Player {
  id: string;
  name: string;
  faction: Faction | null;
  list: string | null;
}

interface GameSetupProps {
  onComplete: (players: Player[], mission: Mission) => void;
}

const GameSetup: React.FC<GameSetupProps> = ({ onComplete }) => {
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
            <h2 className="phase-title">Who's Playing?</h2>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Label htmlFor="player-one-name" className="text-base font-medium flex items-center gap-2">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span>Player One</span>
                </Label>
                <Input
                  id="player-one-name"
                  placeholder="Enter player name"
                  value={playerOne.name}
                  onChange={(e) => setPlayerOne({ ...playerOne, name: e.target.value })}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-4">
                <Label htmlFor="player-two-name" className="text-base font-medium flex items-center gap-2">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span>Player Two</span>
                </Label>
                <Input
                  id="player-two-name"
                  placeholder="Enter player name"
                  value={playerTwo.name}
                  onChange={(e) => setPlayerTwo({ ...playerTwo, name: e.target.value })}
                  className="h-12"
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
            <h2 className="phase-title">Select Nations</h2>
            
            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-muted-foreground" />
                  <span>{playerOne.name}'s Nation</span>
                </Label>
                <FactionSelector
                  selectedFaction={playerOne.faction}
                  onSelectFaction={(faction) => setPlayerOne({ ...playerOne, faction })}
                />
              </div>
              
              <div className="space-y-4">
                <Label className="text-base font-medium flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-muted-foreground" />
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
            <h2 className="phase-title">Select Mission</h2>
            
            <div className="space-y-4">
              <Label className="text-base font-medium flex items-center gap-2">
                <Swords className="w-5 h-5 text-muted-foreground" />
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
                    ? "bg-primary text-primary-foreground" 
                    : step === stepNumber 
                      ? "bg-primary/20 text-primary border-2 border-primary" 
                      : "bg-secondary text-muted-foreground"
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
                    step > stepNumber ? "bg-primary" : "bg-secondary"
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8 min-h-[400px]">
        {renderStepContent()}
      </div>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={goToPrevStep}
          disabled={step === 1}
          className="w-32"
        >
          Back
        </Button>
        
        <Button
          onClick={goToNextStep}
          className="w-32"
        >
          {step === 3 ? 'Start Game' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

export default GameSetup;
