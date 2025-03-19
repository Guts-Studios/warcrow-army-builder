
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Player, Unit, Mission, Photo } from '@/types/game';
import { ArrowUp, ArrowDown, Camera } from 'lucide-react';
import PhotoCapture from '@/components/PhotoCapture';
import { toast } from 'sonner';

interface RoundSummaryProps {
  roundNumber: number;
  players: Record<string, Player>;
  units?: Unit[];
  mission?: Mission | null;
  onComplete: (scores: Record<string, number>, photo: any) => void;
  onCancel: () => void;
}

const RoundSummary: React.FC<RoundSummaryProps> = ({
  roundNumber,
  players,
  units,
  mission,
  onComplete,
  onCancel
}) => {
  const playerIds = Object.keys(players);
  
  // Initialize scores with current round scores
  const [scores, setScores] = useState<Record<string, number>>(() => {
    return playerIds.reduce((acc, playerId) => {
      const roundScore = players[playerId]?.roundScores?.[roundNumber] || 0;
      return { ...acc, [playerId]: roundScore };
    }, {});
  });
  
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [takingPhoto, setTakingPhoto] = useState(false);
  
  const incrementScore = (playerId: string) => {
    setScores(prev => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1
    }));
  };

  const decrementScore = (playerId: string) => {
    setScores(prev => ({
      ...prev,
      [playerId]: Math.max(0, (prev[playerId] || 0) - 1)
    }));
  };
  
  const handleScoreChange = (playerId: string, value: string) => {
    const numValue = parseInt(value) || 0;
    setScores(prev => ({
      ...prev,
      [playerId]: numValue
    }));
  };
  
  const handlePhotoTaken = (photoData: string) => {
    setPhoto({
      id: `round-${roundNumber}-photo-${Date.now()}`,
      url: photoData,
      timestamp: Date.now(),
      phase: 'midgame',
      roundNumber: roundNumber,
      annotations: []
    });
    setTakingPhoto(false);
    toast.success('Photo captured for round ' + roundNumber);
  };
  
  const handleSave = () => {
    onComplete(scores, photo);
  };
  
  return (
    <Dialog open={true} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Edit Round {roundNumber} Scores</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          {playerIds.map((playerId) => (
            <div key={playerId} className="bg-muted/30 rounded-lg p-4">
              <Label htmlFor={`score-${playerId}`} className="text-lg font-medium mb-2 block">
                {players[playerId].name}'s Victory Points
              </Label>
              <div className="flex items-center">
                <Button 
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => decrementScore(playerId)}
                  className="bg-red-500/20 hover:bg-red-500/30 border-red-500/50"
                >
                  <ArrowDown className="h-4 w-4 text-white" />
                </Button>
                <Input
                  id={`score-${playerId}`}
                  type="number"
                  min="0"
                  className="text-lg h-12 mx-2"
                  value={scores[playerId] || 0}
                  onChange={(e) => handleScoreChange(playerId, e.target.value)}
                />
                <Button 
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => incrementScore(playerId)}
                  className="bg-green-500/20 hover:bg-green-500/30 border-green-500/50"
                >
                  <ArrowUp className="h-4 w-4 text-white" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {takingPhoto ? (
          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">Capture Game State</h3>
            <PhotoCapture 
              onPhotoTaken={handlePhotoTaken} 
              phase="midgame" 
              turn={roundNumber}
            />
            <Button 
              variant="outline" 
              onClick={() => setTakingPhoto(false)}
            >
              Cancel Photo
            </Button>
          </div>
        ) : photo ? (
          <div className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">Game Photo</h3>
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src={photo.url} 
                alt={`Round ${roundNumber} game state`} 
                className="w-full h-auto"
              />
            </div>
            <Button 
              variant="outline" 
              onClick={() => setTakingPhoto(true)}
            >
              Retake Photo
            </Button>
          </div>
        ) : (
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline" 
              onClick={() => setTakingPhoto(true)}
            >
              <Camera className="w-4 h-4 mr-2" />
              Take Game Photo
            </Button>
          </div>
        )}
        
        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoundSummary;
