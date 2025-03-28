
import React from 'react';
import { Label } from '@/components/ui/label';
import { SavedList } from '@/types/army';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface SavedListSelectorProps {
  savedLists: SavedList[];
  playerWabId: string;
  isLoadingSavedLists: boolean;
  onSelectList: (listId: string) => void;
}

const SavedListSelector: React.FC<SavedListSelectorProps> = ({
  savedLists,
  playerWabId,
  isLoadingSavedLists,
  onSelectList
}) => {
  return (
    <div className="bg-warcrow-accent rounded-lg p-4">
      <Label className="text-lg font-semibold text-warcrow-gold mb-4 block">Saved Army Lists</Label>
      {isLoadingSavedLists ? (
        <p className="text-xs text-muted-foreground mt-1">Loading lists...</p>
      ) : savedLists.length > 0 ? (
        <Select onValueChange={onSelectList}>
          <SelectTrigger className="w-full mt-1 bg-warcrow-background border-warcrow-gold text-warcrow-text">
            <SelectValue placeholder="Select a saved list" />
          </SelectTrigger>
          <SelectContent className="bg-warcrow-background border-warcrow-gold">
            {savedLists.map((list) => (
              <SelectItem 
                key={list.id} 
                value={list.id}
                className="text-warcrow-gold font-medium hover:bg-warcrow-gold/10"
              >
                {list.name} ({list.faction})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <p className="text-xs text-muted-foreground mt-1">
          No saved lists available{playerWabId ? ` for ${playerWabId}` : ""}
        </p>
      )}
    </div>
  );
};

export default SavedListSelector;
