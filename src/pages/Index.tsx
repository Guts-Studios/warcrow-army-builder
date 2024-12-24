import { useState } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import ArmyList from "@/components/ArmyList";
import FactionSelector from "@/components/FactionSelector";

const Index = () => {
  const [selectedFaction, setSelectedFaction] = useState("northern-tribes");
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [currentListName, setCurrentListName] = useState(null);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text">
        <div className="container max-w-7xl mx-auto p-4 relative">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-warcrow-gold">
              Warcrow Army Builder
            </h1>
          </div>
          <div className="hidden md:block">
            <FactionSelector
              selectedFaction={selectedFaction}
              onFactionChange={setSelectedFaction}
            />
          </div>
          <ArmyList 
            selectedFaction={selectedFaction} 
            onFactionChange={setSelectedFaction}
            onUnitsChange={setSelectedUnits}
            onListNameChange={setCurrentListName}
          />
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  );
};

export default Index;