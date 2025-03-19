
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Target } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface ObjectiveUpdateProps {
  open: boolean;
  onClose: () => void;
}

const ObjectiveUpdate: React.FC<ObjectiveUpdateProps> = ({ open, onClose }) => {
  const { state, dispatch } = useGame();
  const [description, setDescription] = useState('');
  const [value, setValue] = useState<number>(1);
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const [selectedObjectiveId, setSelectedObjectiveId] = useState<string | null>(null);

  // Reset form state when dialog opens
  useEffect(() => {
    if (open) {
      setDescription('');
      setValue(1);
      setSelectedPlayerId(null);
      setSelectedObjectiveId(null);
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description || !selectedPlayerId) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Add to game events
    dispatch({
      type: 'ADD_GAME_EVENT',
      payload: {
        id: uuidv4(),
        timestamp: Date.now(),
        type: 'objective',
        playerId: selectedPlayerId,
        description,
        value,
        objectiveId: selectedObjectiveId || undefined
      }
    });
    
    // Update player score
    const player = state.players[selectedPlayerId];
    if (player) {
      dispatch({
        type: 'UPDATE_SCORE',
        payload: {
          playerId: selectedPlayerId,
          score: (player.score || 0) + value
        }
      });
    }
    
    // Update mission objective control if an objective was selected
    if (selectedObjectiveId && state.mission?.objectiveMarkers) {
      const objectiveMarker = state.mission.objectiveMarkers.find(
        marker => marker.id === selectedObjectiveId
      );
      
      if (objectiveMarker) {
        const updatedMission = {
          ...state.mission,
          objectiveMarkers: state.mission.objectiveMarkers.map(marker => 
            marker.id === selectedObjectiveId 
              ? { ...marker, controlledBy: selectedPlayerId }
              : marker
          )
        };
        
        dispatch({
          type: 'SET_MISSION',
          payload: updatedMission
        });
      }
    }
    
    toast.success('Objective updated successfully');
    setDescription('');
    setValue(1);
    setSelectedPlayerId(null);
    setSelectedObjectiveId(null);
    onClose();
  };

  // Generate mission-specific objective descriptions based on the mission ID
  const getMissionSpecificScoring = () => {
    if (!state.mission) return null;
    
    switch (state.mission.id) {
      case 'consolidated-progress':
        return (
          <div className="space-y-2 mt-4 p-3 bg-muted/50 rounded-lg">
            <h3 className="font-medium text-sm">Mission Scoring</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>1 VP for controlling the central objective</li>
              <li>1 VP for controlling opponent's objective (1)</li>
              <li>2 VPs for controlling opponent's objective (2)</li>
              <li>1 VP if opponent controls neither of your objectives</li>
            </ul>
          </div>
        );
      
      case 'take-positions':
        return (
          <div className="space-y-2 mt-4 p-3 bg-muted/50 rounded-lg">
            <h3 className="font-medium text-sm">Mission Scoring</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>1 VP for each objective you control with your opponent's color</li>
              <li>1 VP if your opponent doesn't control any of the objectives of your color</li>
            </ul>
          </div>
        );
      
      case 'fog-of-death':
        return (
          <div className="space-y-2 mt-4 p-3 bg-muted/50 rounded-lg">
            <h3 className="font-medium text-sm">Mission Scoring</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>1 VP if you control the artifact and a Fog marker comes into contact with the conquest marker. In this case, remove the Fog marker from the game.</li>
              <li>At the end of each round, you get:</li>
              <li className="ml-4">• 2 VPs if you control the artifact</li>
            </ul>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Update Objective Control
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Player</label>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(state.players).map(([playerId, player]) => (
                <Button
                  key={playerId}
                  type="button"
                  variant={selectedPlayerId === playerId ? "default" : "outline"}
                  className="justify-start"
                  onClick={() => setSelectedPlayerId(playerId)}
                >
                  {player.name}
                </Button>
              ))}
            </div>
          </div>
          
          {state.mission?.objectiveMarkers && state.mission.objectiveMarkers.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Objective Marker</label>
              <RadioGroup value={selectedObjectiveId || ''} onValueChange={setSelectedObjectiveId}>
                <div className="grid grid-cols-1 gap-2">
                  {state.mission.objectiveMarkers.map((marker) => (
                    <div key={marker.id} className="flex items-center space-x-2 p-2 border rounded-md">
                      <RadioGroupItem value={marker.id} id={`objective-${marker.id}`} />
                      <div className="flex items-center gap-2 flex-1">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: marker.color }}
                        />
                        <Label htmlFor={`objective-${marker.id}`}>{marker.name}</Label>
                      </div>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full h-20 p-2 border rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Controlled central objective for 2 turns"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Victory Points</label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <Button
                  key={num}
                  type="button"
                  variant={value === num ? "default" : "outline"}
                  onClick={() => setValue(num)}
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
          
          {getMissionSpecificScoring()}
          
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ObjectiveUpdate;
