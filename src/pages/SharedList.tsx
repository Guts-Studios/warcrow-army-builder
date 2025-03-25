
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { decodeUrlToList } from "@/utils/shareListUtils";
import { SavedList } from "@/types/army";
import { factions } from "@/data/factions";
import ExportDialog from "@/components/army/ExportDialog";

const SharedList = () => {
  const { listCode } = useParams<{ listCode: string }>();
  const [listData, setListData] = useState<SavedList | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!listCode) {
      setError("No list code provided");
      return;
    }
    
    try {
      const decodedList = decodeUrlToList(listCode);
      if (!decodedList) {
        setError("Invalid list data");
        return;
      }
      
      setListData(decodedList);
    } catch (err) {
      console.error("Error decoding list:", err);
      setError("Failed to load army list data");
    }
  }, [listCode]);

  // Get faction name from faction ID
  const getFactionName = (factionId: string): string => {
    const faction = factions.find(f => f.id === factionId);
    return faction?.name || "Unknown Faction";
  };

  const renderUnit = (unit: any, index: number) => {
    const pointsCost = unit.pointsCost * (unit.quantity || 1);
    const commandPoints = unit.command ? ` (${unit.command} CP)` : "";
    const highCommand = unit.highCommand ? " [High Command]" : "";
    
    return (
      <div 
        key={`${unit.id}-${index}`}
        className="flex justify-between p-3 bg-black/30 rounded-md mb-2 border border-warcrow-gold/20"
      >
        <div>
          <span className="text-warcrow-gold">{unit.name}</span>
          <span className="text-warcrow-text/70">{highCommand}{commandPoints}</span>
          <span className="ml-2 text-warcrow-text/70">×{unit.quantity || 1}</span>
        </div>
        <div className="text-warcrow-gold">{pointsCost} pts</div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex items-center justify-center">
        <div className="max-w-md p-6 bg-black/50 rounded-lg border border-warcrow-gold/20 text-center">
          <h1 className="text-xl text-warcrow-gold mb-4">Error Loading List</h1>
          <p>{error}</p>
          <p className="mt-4 text-sm text-warcrow-text/70">
            The list might be invalid or the link may have expired.
          </p>
        </div>
      </div>
    );
  }

  if (!listData) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex items-center justify-center">
        <div className="max-w-md p-6 bg-black/50 rounded-lg border border-warcrow-gold/20 text-center">
          <h1 className="text-xl text-warcrow-gold mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  // Calculate total points
  const totalPoints = listData.units.reduce(
    (total, unit) => total + unit.pointsCost * (unit.quantity || 1), 
    0
  );
  
  // Calculate total command points
  const totalCommand = listData.units.reduce(
    (total, unit) => total + ((unit.command || 0) * (unit.quantity || 1)),
    0
  );

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text p-4">
      <div className="max-w-3xl mx-auto bg-black/50 rounded-lg shadow-lg border border-warcrow-gold/20 p-6">
        <div className="mb-6 border-b border-warcrow-gold/20 pb-4">
          <h1 className="text-2xl font-bold text-warcrow-gold">{listData.name}</h1>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
            <div>
              <p className="text-warcrow-text/70">Faction: {getFactionName(listData.faction)}</p>
              <p className="text-sm text-warcrow-text/70">Created: {new Date(listData.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              <ExportDialog selectedUnits={listData.units} listName={listData.name} />
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-warcrow-gold mb-3">Units</h2>
            <div className="space-y-2">
              {listData.units.map((unit, index) => renderUnit(unit, index))}
            </div>
          </div>

          <div className="bg-black/30 p-4 rounded-md border border-warcrow-gold/20">
            <div className="flex justify-between text-warcrow-gold">
              <span>Total Command Points:</span>
              <span>{totalCommand} CP</span>
            </div>
            <div className="flex justify-between text-warcrow-gold font-bold mt-1">
              <span>Total Points:</span>
              <span>{totalPoints} pts</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SharedList;
