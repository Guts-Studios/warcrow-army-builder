import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FactionSelector from "@/components/FactionSelector";
import ArmyList from "@/components/ArmyList";

const Index = () => {
  const [selectedFaction, setSelectedFaction] = useState("northern-tribes");
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col relative overflow-x-hidden">
        <div className="container max-w-7xl mx-auto py-8 px-4 flex-grow relative z-10">
          <div className="flex justify-between items-center mb-8">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black"
            >
              Back to Home
            </Button>
            <img 
              src="https://assets.corvusbelli.net/warcrow/web/logo_warcrow.png" 
              alt="Warcrow Logo" 
              className="h-24"
            />
            <Button
              onClick={() => navigate('/login')}
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black"
            >
              Login
            </Button>
          </div>
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-center mb-2 text-warcrow-gold">
              Build and manage your Warcrow army lists
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
          />
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  );
};

export default Index;