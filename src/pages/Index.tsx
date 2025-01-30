import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import ArmyBuilder from "@/components/army/ArmyBuilder";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warcrow-background">
      {/* Navigation Header */}
      <div className="bg-black/50 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <img 
            src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
            alt="Warcrow Logo" 
            className="h-14"
          />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
              onClick={() => navigate('/missions')}
            >
              Missions
            </Button>
            <Button
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
              onClick={() => navigate('/rules')}
            >
              Rules
            </Button>
            <Button
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
              onClick={() => navigate('/landing')}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <ArmyBuilder />
      </div>
    </div>
  );
};

export default Index;