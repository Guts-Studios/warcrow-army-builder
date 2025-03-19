
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skull } from 'lucide-react';
import { useGame } from '@/context/GameContext';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

interface CasualtyRecordProps {
  open: boolean;
  onClose: () => void;
}

const CasualtyRecord: React.FC<CasualtyRecordProps> = ({ open, onClose }) => {
  const { state, dispatch } = useGame();
  const [unitId, setUnitId] = useState<string>('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!unitId || !description) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    // Add game event
    dispatch({
      type: 'ADD_GAME_EVENT',
      payload: {
        id: uuidv4(),
        timestamp: Date.now(),
        type: 'casualty',
        unitId,
        description
      }
    });
    
    // Update unit status if needed
    dispatch({
      type: 'UPDATE_UNIT',
      payload: {
        id: unitId,
        updates: {
          status: 'destroyed'
        }
      }
    });
    
    toast.success('Casualty recorded successfully');
    setUnitId('');
    setDescription('');
    onClose();
  };

  // Get all units from all players
  const allUnits = state.units && state.units.length > 0 
    ? state.units 
    : Object.values(state.players).flatMap(player => 
        player.units || []
      );

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Skull className="w-5 h-5" />
            Record Casualty
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Unit</label>
            <select
              className="w-full p-2 border rounded-md"
              value={unitId}
              onChange={(e) => setUnitId(e.target.value)}
              required
            >
              <option value="">Select a unit</option>
              {allUnits.map(unit => (
                <option key={unit.id} value={unit.id}>
                  {unit.name} ({state.players[unit.player]?.name})
                </option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full h-20 p-2 border rounded-md"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Destroyed by ranged attack"
              required
            />
          </div>
          
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

export default CasualtyRecord;
