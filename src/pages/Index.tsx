import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import ArmyBuilder from "@/components/army/ArmyBuilder";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const navigate = useNavigate();
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-warcrow-background">
      {/* Navigation Header */}
      <div className="bg-black/50 p-6 shadow-custom">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-0">
            <img 
              src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
              alt="Warcrow Logo" 
              className="h-24 md:h-32 transition-transform duration-300 hover:scale-105"
            />
            <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
              <Button
                variant="outline"
                className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black transition-all duration-300 bg-black/50 backdrop-blur-sm w-full md:w-auto px-6 py-2 text-lg tracking-wider shadow-custom"
                onClick={() => navigate('/missions')}
              >
                Missions
              </Button>
              <Button
                variant="outline"
                className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black transition-all duration-300 bg-black/50 backdrop-blur-sm w-full md:w-auto px-6 py-2 text-lg tracking-wider shadow-custom"
                onClick={() => navigate('/rules')}
              >
                Rules
              </Button>
              <Button
                variant="outline"
                className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black transition-all duration-300 bg-black/50 backdrop-blur-sm w-full md:w-auto px-6 py-2 text-lg tracking-wider shadow-custom"
                onClick={() => navigate('/landing')}
              >
                <Home className="mr-2 h-5 w-5" />
                Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="animate-fade-in">
          <ArmyBuilder session={session} />
        </div>
      </div>
    </div>
  );
};

export default Index;