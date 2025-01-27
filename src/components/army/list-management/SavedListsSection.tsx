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
  // Filter lists by faction first
  const filteredLists = savedLists.filter((list) => list.faction === selectedFaction);
  
  // Create a map to store unique lists, keeping the most recent version of each name
  const uniqueListsMap = new Map();
  filteredLists.forEach((list) => {
    // If the name already exists, only replace if the current list is newer
    const existingList = uniqueListsMap.get(list.name);
    if (!existingList || new Date(list.created_at) > new Date(existingList.created_at)) {
      uniqueListsMap.set(list.name, list);
    }
  });

  // Convert map values back to array
  const uniqueLists = Array.from(uniqueListsMap.values());

  if (uniqueLists.length === 0) return null;

  return (
    <div className="bg-warcrow-accent rounded-lg p-4 w-full">
      <h3 className="text-lg font-semibold text-warcrow-gold mb-2">
        Saved Lists
      </h3>
      <div className="space-y-2">
        {uniqueLists.map((list) => (
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
