import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FactionSelector from "@/components/FactionSelector";
import ArmyList from "@/components/ArmyList";

const Index = () => {
  const [selectedFaction, setSelectedFaction] = useState("northern-tribes");

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col relative overflow-x-hidden">
        <div className="container max-w-7xl mx-auto py-8 px-4 flex-grow relative z-10 pt-[73px]">
          <div className="flex flex-col items-center mb-8">
            <img 
              src="https://assets.corvusbelli.net/warcrow/web/logo_warcrow.png" 
              alt="Warcrow Logo" 
              className="h-24 mb-4"
            />
            <h1 className="text-4xl font-bold text-center mb-2 text-warcrow-gold">
              Build and manage your Warcrow army lists
            </h1>
          </div>
          <FactionSelector
            selectedFaction={selectedFaction}
            onFactionChange={setSelectedFaction}
          />
          <ArmyList selectedFaction={selectedFaction} />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Index;