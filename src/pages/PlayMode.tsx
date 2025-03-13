
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UnitList from "@/components/extended-unit/UnitList";
import { extendedUnits } from "@/data/extended-units";

const PlayMode = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warcrow-background">
      {/* Navigation Header */}
      <div className="bg-black py-4 shadow-md border-b border-warcrow-gold/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-4 mx-auto md:mx-0">
              <img 
                src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
                alt="Warcrow Logo" 
                className="h-16"
              />
              <h1 className="text-3xl font-bold text-warcrow-gold text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                Play Mode (Beta)
              </h1>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <Button
                variant="outline"
                className="border-2 border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black transition-colors bg-black/80 w-full md:w-auto font-semibold shadow-lg"
                onClick={() => navigate('/builder')}
              >
                Army Builder
              </Button>
              <Button
                variant="outline"
                className="border-2 border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black transition-colors bg-black/80 w-full md:w-auto font-semibold shadow-lg"
                onClick={() => navigate('/landing')}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="bg-warcrow-background/95 backdrop-blur-sm rounded-lg p-6 shadow-xl border-2 border-warcrow-accent">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-warcrow-gold mb-4 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
              Unit Reference
            </h2>
            <p className="text-warcrow-text mb-2 text-lg leading-relaxed">
              This section provides detailed information about each unit, including their statistics, 
              abilities, and special rules. Use this reference during gameplay to quickly look up 
              unit capabilities and effects.
            </p>
            <p className="text-warcrow-text text-sm italic text-warcrow-gold/80">
              Note: This is a beta feature and more units will be added in future updates.
            </p>
          </div>
          
          <UnitList units={extendedUnits} />
        </div>
      </div>
    </div>
  );
};

export default PlayMode;
