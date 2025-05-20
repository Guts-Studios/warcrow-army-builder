
import { useArmyList } from "@/hooks/use-army-list";
import ListManagement from "../ListManagement";
import HighCommandAlert from "./HighCommandAlert";
import TotalPoints from "./TotalPoints";
import FactionSelector from "../FactionSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import UnitListSection from "./UnitListSection";
import SelectedUnitsSection from "./SelectedUnitsSection";
import { SavedList } from "@/types/army";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ArmyListProps {
  selectedFaction: string;
  onFactionChange: (faction: string) => void;
  initialList?: SavedList;
}

const ArmyList = ({ selectedFaction, onFactionChange, initialList }: ArmyListProps) => {
  const {
    quantities,
    selectedUnits,
    listName,
    currentListName,
    savedLists,
    showHighCommandAlert,
    setShowHighCommandAlert,
    setListName,
    handleAdd,
    handleRemove,
    handleNewList,
    handleSaveList,
    handleLoadList,
    factionUnits,
    unitsLoading,
    unitsError,
    refetchUnits
  } = useArmyList(selectedFaction);

  const [isManuallyRefreshing, setIsManuallyRefreshing] = useState(false);
  const isMobile = useIsMobile();

  // Load initial list if provided
  useEffect(() => {
    if (initialList) {
      handleLoadList(initialList);
    }
  }, [initialList, handleLoadList]);

  // Notify user about faction units loading state
  useEffect(() => {
    if (unitsLoading) {
      console.log(`[ArmyList] Loading units for faction: ${selectedFaction}`);
    } else if (unitsError) {
      console.error(`[ArmyList] Error loading units:`, unitsError);
      toast.error(`Could not load units. Falling back to local data.`);
    } else if (factionUnits.length === 0) {
      console.warn(`[ArmyList] No units found for faction: ${selectedFaction}`);
      
      // If Northern Tribes specifically has no units, try to refetch
      if (selectedFaction === 'northern-tribes') {
        console.log("[ArmyList] Northern Tribes has no units, trying to refetch...");
        refetchUnits();
      }
    } else {
      console.log(`[ArmyList] Loaded ${factionUnits.length} units for faction: ${selectedFaction}`);
      
      // Debug: Check if any units have mismatched faction
      const mismatchedUnits = factionUnits.filter(unit => 
        unit.faction !== selectedFaction && selectedFaction !== 'all'
      );
      
      if (mismatchedUnits.length > 0) {
        console.warn(
          `[ArmyList] Found ${mismatchedUnits.length} units with mismatched faction:`,
          mismatchedUnits.map(u => `${u.name} (${u.faction} vs expected ${selectedFaction})`)
        );
      }
    }
  }, [factionUnits, unitsLoading, unitsError, selectedFaction, refetchUnits]);

  const handleRetry = () => {
    refetchUnits();
  };
  
  const handleManualRefresh = async () => {
    setIsManuallyRefreshing(true);
    try {
      await refetchUnits();
      toast.success(`Units refreshed for ${selectedFaction}`);
    } catch (error) {
      toast.error("Failed to refresh units");
    } finally {
      setIsManuallyRefreshing(false);
    }
  };

  return (
    <>
      <HighCommandAlert 
        open={showHighCommandAlert} 
        onOpenChange={setShowHighCommandAlert} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 pb-20 md:pb-16">
        <div className="space-y-4 order-2 md:order-1">
          <div className="bg-warcrow-background/50 p-2 md:p-3 rounded-lg border border-warcrow-gold/30">
            {unitsLoading ? (
              <div className="flex flex-col items-center justify-center p-12">
                <Loader2 className="h-8 w-8 text-warcrow-gold animate-spin mb-2" />
                <p className="text-warcrow-muted">Loading units...</p>
              </div>
            ) : unitsError ? (
              <div className="text-center p-8">
                <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-red-400 mb-2">Error loading units</p>
                <p className="text-xs text-warcrow-muted mb-4">
                  {unitsError.message || "Could not fetch units from the server"}
                </p>
                <Button variant="outline" onClick={handleRetry}>
                  Retry
                </Button>
              </div>
            ) : factionUnits.length === 0 ? (
              <div className="text-center p-8 text-warcrow-muted">
                <p>No units found for this faction.</p>
                <p className="text-xs mt-2 mb-4">Try selecting a different faction or check your connection.</p>
                <Button 
                  variant="outline" 
                  onClick={handleManualRefresh} 
                  disabled={isManuallyRefreshing}
                  className="flex items-center gap-2"
                >
                  {isManuallyRefreshing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  Refresh Units
                </Button>
              </div>
            ) : (
              <UnitListSection
                factionUnits={factionUnits}
                quantities={quantities}
                onAdd={handleAdd}
                onRemove={handleRemove}
              />
            )}
          </div>
        </div>

        <div className="space-y-4 order-1 md:order-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <ListManagement
              listName={listName}
              currentListName={currentListName}
              onListNameChange={setListName}
              onSaveList={handleSaveList}
              onLoadList={handleLoadList}
              onNewList={handleNewList}
              savedLists={savedLists}
              selectedFaction={selectedFaction}
              selectedUnits={selectedUnits}
            />
          </div>
          
          {isMobile && (
            <FactionSelector
              selectedFaction={selectedFaction}
              onFactionChange={onFactionChange}
            />
          )}
          
          <SelectedUnitsSection
            selectedUnits={selectedUnits}
            currentListName={currentListName}
            onRemove={handleRemove}
          />
        </div>
      </div>

      <TotalPoints selectedUnits={selectedUnits} />
    </>
  );
};

export default ArmyList;
