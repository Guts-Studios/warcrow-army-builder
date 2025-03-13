
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import ExtendedUnitCard from "@/components/extended-unit/ExtendedUnitCard";
import { extendedUnits } from "@/data/extended-units";

const UnitDetail = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const navigate = useNavigate();
  
  const unit = extendedUnits.find(u => u.id === unitId);

  if (!unit) {
    return (
      <div className="min-h-screen bg-warcrow-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Unit Not Found</h2>
          <p className="text-warcrow-text mb-6">The unit you're looking for doesn't exist or hasn't been added yet.</p>
          <Button 
            variant="outline"
            className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black"
            onClick={() => navigate('/playmode')}
          >
            Return to Unit List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warcrow-background">
      {/* Navigation Header */}
      <div className="bg-black/50 p-4">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
            <div className="flex flex-col md:flex-row items-center gap-4 mx-auto md:mx-0">
              <img 
                src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
                alt="Warcrow Logo" 
                className="h-16"
              />
              <h1 className="text-3xl font-bold text-warcrow-gold text-center">Play Mode (Beta)</h1>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <Button
                variant="outline"
                className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
                onClick={() => navigate('/playmode')}
              >
                Unit List
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

      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="pb-20">
          <ExtendedUnitCard unit={unit} />
        </div>
      </div>
    </div>
  );
};

export default UnitDetail;
