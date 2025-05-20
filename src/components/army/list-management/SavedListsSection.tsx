import { Button } from "@/components/ui/button";
import { Trash2, Cloud, Disc, RefreshCw } from "lucide-react";
import { SavedList } from "@/types/army";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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
  const { t } = useLanguage();
  const [sortedLists, setSortedLists] = useState<SavedList[]>([]);
  const { isAuthenticated, isGuest } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // Helper function to determine if a list is a cloud list
  const isCloudList = (list: SavedList): boolean => {
    // A list is a cloud list if it has a non-null and non-undefined user_id property
    return typeof list.user_id === 'string' && list.user_id.length > 0;
  };
  
  // Filter and sort lists whenever savedLists or selectedFaction changes
  useEffect(() => {
    console.log("SavedListsSection - Received lists:", {
      totalLists: savedLists?.length || 0,
      selectedFaction,
      isAuthenticated,
      timestamp: new Date().toISOString()
    });
    
    // Filter lists by faction first, if they're not an empty array
    const filteredLists = Array.isArray(savedLists) ? 
      savedLists.filter((list) => list.faction === selectedFaction) : [];
    
    if (filteredLists.length === 0) {
      console.log("No lists found for faction:", selectedFaction);
      setSortedLists([]);
      return;
    }
    
    console.log(`Found ${filteredLists.length} lists for faction "${selectedFaction}"`);
    
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
    
    // Sort lists - cloud lists first, then by created_at date (newest first)
    const sorted = uniqueLists.sort((a, b) => {
      // Cloud lists come first
      if (isCloudList(a) && !isCloudList(b)) return -1;
      if (!isCloudList(a) && isCloudList(b)) return 1;
      
      // Then sort by created_at date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    setSortedLists(sorted);
    
    console.log("Lists sorted:", {
      totalLists: savedLists.length,
      filteredListsCount: filteredLists.length,
      uniqueListsCount: uniqueLists.length,
      cloudLists: filteredLists.filter(list => isCloudList(list)).length,
      localLists: filteredLists.filter(list => !isCloudList(list)).length,
      selectedFaction,
      isAuthenticated
    });
    
  }, [savedLists, selectedFaction, isAuthenticated, isGuest, refreshTrigger]);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
    toast.info("Refreshing saved lists...");
  };

  if (sortedLists.length === 0) {
    // Check if we have any lists at all and show message accordingly
    if (savedLists && savedLists.length > 0) {
      return (
        <div className="bg-warcrow-accent rounded-lg p-4 w-full">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold text-warcrow-gold">
              {t('savedLists')}
            </h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-warcrow-gold hover:text-warcrow-gold/80 hover:bg-warcrow-accent/50"
              onClick={handleRefresh}
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
          <div className="text-center py-3 text-warcrow-text/80">
            No lists found for "{selectedFaction}" faction.
          </div>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="bg-warcrow-accent rounded-lg p-4 w-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-warcrow-gold">
          {t('savedLists')}
        </h3>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-warcrow-gold hover:text-warcrow-gold/80 hover:bg-warcrow-accent/50"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        {sortedLists.map((list) => (
          <div
            key={list.id}
            className="flex items-center justify-between bg-warcrow-background p-2 rounded w-full"
          >
            <div className="flex items-center gap-2">
              {isCloudList(list) ? (
                <Cloud className="h-4 w-4 text-blue-500" aria-label="Cloud save" />
              ) : (
                <Disc className="h-4 w-4 text-warcrow-gold/70" aria-label="Local save" />
              )}
              <span className="text-warcrow-gold font-medium">{list.name}</span>
              {list.wab_id && (
                <span className="text-xs text-warcrow-gold/70">{list.wab_id.slice(0, 8)}</span>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  console.log("Loading list:", list);
                  onLoadList(list);
                }}
                variant="outline"
                className="bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background transition-colors"
              >
                {t('loadList')}
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
