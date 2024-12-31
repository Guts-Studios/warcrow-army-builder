import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center relative overflow-x-hidden px-4">
      <div className="text-center space-y-6 md:space-y-8 max-w-xl mx-auto">
        <img 
          src="https://assets.corvusbelli.net/warcrow/web/logo_warcrow.png" 
          alt="Warcrow Logo" 
          className="h-20 md:h-32 mx-auto"
        />
        <h1 className="text-2xl md:text-4xl font-bold text-warcrow-gold">
          Welcome to Warcrow Army Builder
        </h1>
        <div className="text-warcrow-gold/80 text-xs md:text-sm">Version 0.2.6</div>
        <p className="text-lg md:text-xl text-warcrow-text">
          Create and manage your Warcrow army lists with ease.
        </p>
        <div className="bg-warcrow-accent/50 p-3 md:p-4 rounded-lg">
          <p className="text-warcrow-gold font-semibold mb-2 text-sm md:text-base">🚧 Still in Development</p>
          <p className="text-warcrow-text text-sm md:text-base">
            This application is actively being developed with frequent updates and improvements.
            We appreciate your patience and feedback!
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-center">
          <Button
            onClick={() => navigate('/builder')}
            className="w-full md:w-auto bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors"
          >
            Start Building
          </Button>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black transition-colors"
          >
            Sign Out
          </Button>
          <Button
            onClick={() => window.open('https://www.patreon.com/c/GutzStudio', '_blank')}
            variant="outline"
            className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black transition-colors"
          >
            Support on Patreon
          </Button>
        </div>
        <div className="mt-6 md:mt-8 text-sm text-warcrow-text/80">
          <p>Have ideas, issues, love, or hate to share?</p>
          <a 
            href="mailto:warcrowarmy@gmail.com"
            className="text-warcrow-gold hover:text-warcrow-gold/80 underline"
          >
            Contact us at warcrowarmy@gmail.com
          </a>
        </div>
      </div>
      <footer className="absolute bottom-4 text-center text-xs md:text-sm text-warcrow-text/60 max-w-md md:max-w-2xl px-4">
        <p>
          WARCROW and all associated marks, logos, places, names, creatures, races and race insignia/devices/logos/symbols, 
          vehicles, locations, weapons, units, characters, products, illustrations and images are either ® or ™, and/or © 
          Corvus Belli S.L.L. This is a fan-made application and is not officially endorsed by or affiliated with Corvus Belli S.L.L.
        </p>
      </footer>
    </div>
  );
};

export default Landing;