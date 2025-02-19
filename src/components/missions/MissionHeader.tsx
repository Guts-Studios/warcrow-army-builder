
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

export const MissionHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-black/50 p-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
          <div className="flex items-center gap-4 mx-auto md:mx-0">
            <img 
              src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
              alt="Warcrow Logo" 
              className="h-16"
            />
            <h1 className="text-3xl font-bold text-warcrow-gold text-center">Missions</h1>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <Button
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
              onClick={() => navigate('/builder')}
            >
              Army Builder
            </Button>
            <Button
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
              onClick={() => navigate('/rules')}
            >
              Rules
            </Button>
            <Button
              variant="outline"
              className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
              onClick={() => navigate('/landing')}
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
