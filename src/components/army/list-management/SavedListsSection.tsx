import { Button } from "@/components/ui/button";
import { Trash2, CloudOff, Cloud } from "lucide-react";
import { SavedList } from "@/types/army";

interface SavedListsSectionProps {
  savedLists: SavedList[];
  selectedFaction: string;
  onLoadList: (list: SavedList) => void;
  onDeleteClick: (listId: string) => void;
}

const SavedListsSection = ({ 
  savedLists, 
  selectedFaction, 
  onLoadList, 
  onDeleteClick 
}: SavedListsSectionProps) => {
  const filteredLists = savedLists.filter((list) => list.faction === selectedFaction);

  if (filteredLists.length === 0) return null;

  return (
    <div className="bg-warcrow-accent rounded-lg p-4 w-full">
      <h3 className="text-lg font-semibold text-warcrow-gold mb-2">
        Saved Lists
      </h3>
      <div className="space-y-2">
        {filteredLists.map((list) => (
          <div
            key={list.id}
            className="flex items-center justify-between bg-warcrow-background p-2 rounded w-full"
          >
            <div className="flex items-center gap-2">
              {list.user_id ? (
                <Cloud className="h-4 w-4 text-blue-500" />
              ) : (
                <CloudOff className="h-4 w-4 text-gray-500" />
              )}
              <span className="text-warcrow-text">{list.name}</span>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => onLoadList(list)}
                variant="outline"
                className="bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background transition-colors"
              >
                Load
              </Button>
              <Button
                onClick={() => onDeleteClick(list.id)}
                variant="outline"
                className="bg-warcrow-background border-red-500 text-red-500 hover:bg-red-500 hover:text-warcrow-background transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedListsSection;