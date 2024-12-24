import { useState } from "react";
import FactionSelector from "@/components/FactionSelector";
import ArmyList from "@/components/ArmyList";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [selectedFaction, setSelectedFaction] = useState("northern-tribes");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col relative">
        {isMobile && (
          <div 
            className="fixed inset-0 bottom-16 z-0 bg-contain bg-center bg-no-repeat opacity-20"
            style={{ backgroundImage: 'url(/art/decorative-frame.png)' }}
          />
        )}
        <div className="container max-w-7xl mx-auto py-8 px-4 flex-grow relative z-10">
          <div className="flex flex-col items-center mb-8">
            <img 
              src="https://assets.corvusbelli.net/warcrow/web/logo_warcrow.png" 
              alt="Warcrow Logo" 
              className="h-24 mb-4"
            />
            <h1 className="text-4xl font-bold text-center mb-2 text-warcrow-gold">
              Warcrow Army Builder
            </h1>
            <p className="text-center text-white mb-8">
              Warcrow Army Builder is a free tool for creating and managing army lists for the Warcrow miniatures game, designed to make list-building quick and easy.
            </p>
          </div>
          <Button 
            onClick={() => navigate('/')}
            className="w-full max-w-xs mx-auto block mb-4 bg-warcrow-accent hover:bg-warcrow-accent/90 text-warcrow-gold border border-warcrow-gold"
          >
            Home
          </Button>
          <FactionSelector
            selectedFaction={selectedFaction}
            onFactionChange={setSelectedFaction}
          />
          <ArmyList selectedFaction={selectedFaction} />
        </div>
        <footer className="w-full py-4 bg-warcrow-accent relative z-20">
          <div className="container max-w-7xl mx-auto px-4 text-center">
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