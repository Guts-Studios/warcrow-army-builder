
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Player } from '@/types/game';
import { Camera, User, UserCheck } from 'lucide-react';
import PhotoCapture from '@/components/PhotoCapture';

interface InitiativeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  players: Record<string, Player>;
  currentRound: number;
  initiativePlayerId: string;
  setInitiativePlayerId: (id: string) => void;
  onConfirm: () => void;
  onPhotoCapture?: (photoData: string) => void;
}

const InitiativeDialog: React.FC<InitiativeDialogProps> = ({
  open,
  onOpenChange,
  players,
  currentRound,
  initiativePlayerId,
  setInitiativePlayerId,
  onConfirm,
  onPhotoCapture
}) => {
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);

  // Handle when a photo is captured
  const handlePhotoTaken = (photoData: string) => {
    if (onPhotoCapture) {
      onPhotoCapture(photoData);
    }
    setShowPhotoCapture(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {!showPhotoCapture ? (
          <>
            <DialogHeader>
              <DialogTitle>Select Player with Initiative</DialogTitle>
              <DialogDescription>
                Choose which player has initiative for round {currentRound}.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(players).map(([id, player]) => (
                  <Button
                    key={id}
                    type="button"
                    variant={initiativePlayerId === id ? "default" : "outline"}
                    className="h-auto py-6 flex flex-col items-center justify-center gap-2"
                    onClick={() => setInitiativePlayerId(id)}
                  >
                    {initiativePlayerId === id ? (
                      <UserCheck className="h-6 w-6" />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                    <span>{player.name}</span>
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col gap-3 mt-2">
              {onPhotoCapture && (
                <Button 
                  variant="secondary" 
                  onClick={() => setShowPhotoCapture(true)}
                  className="mb-2"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Take a game state Photo!
                </Button>
              )}
              
              <Button onClick={onConfirm}>
                Confirm Initiative
              </Button>
            </div>
          </>
        ) : (
          <div className="p-1">
            <PhotoCapture 
              onPhotoTaken={handlePhotoTaken} 
              phase="midgame" 
              turn={currentRound} 
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InitiativeDialog;
