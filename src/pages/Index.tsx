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
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <Button
              onClick={() => navigate('/landing')}
              variant="outline"
              className="w-fit border-warcrow-gold text-warcrow-gold bg-black hover:bg-warcrow-gold hover:text-black"
            >
              Back to Home
            </Button>
            <img 
              src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
              alt="Warcrow Logo" 
              className="h-16 md:h-24 mx-auto"
            />
            <div className="hidden md:block w-[100px]" /> {/* Spacer to maintain centering on desktop */}
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