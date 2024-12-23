import { useState } from "react";
import FactionSelector from "@/components/FactionSelector";
import ArmyList from "@/components/ArmyList";
import { TooltipProvider } from "@/components/ui/tooltip";

const Index = () => {
  const [selectedFaction, setSelectedFaction] = useState("northern-tribes");

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col">
        <div className="container max-w-7xl mx-auto py-8 px-4 flex-grow">
          <div className="flex flex-col items-center mb-8">
            <img 
              src="https://assets.corvusbelli.net/warcrow/web/logo_warcrow.png" 
              alt="Warcrow Logo" 
              className="h-24 mb-4"
            />
            <h1 className="text-4xl font-bold text-center mb-2 text-warcrow-gold">
              Warcrow Army Builder
            </h1>
            <p className="text-center text-warcrow-muted mb-8">
              Build and manage your Warcrow army lists
            </p>
          </div>
          <FactionSelector
            selectedFaction={selectedFaction}
            onFactionChange={setSelectedFaction}
          />
          <ArmyList selectedFaction={selectedFaction} />
        </div>
        <footer className="w-full py-4 bg-warcrow-accent">
          <div className="container max-w-7xl mx-auto px-4">
            <a 
              href="https://www.patreon.com/GutzStudio" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-warcrow-gold hover:text-warcrow-gold/80 transition-colors"
            >
              Support us on Patreon
            </a>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
};

export default Index;