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
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center relative overflow-x-hidden">
      <div className="text-center space-y-8">
        <img 
          src="https://assets.corvusbelli.net/warcrow/web/logo_warcrow.png" 
          alt="Warcrow Logo" 
          className="h-32 mx-auto"
        />
        <h1 className="text-4xl font-bold text-warcrow-gold">
          Welcome to Warcrow Army Builder
        </h1>
        <div className="text-warcrow-gold/80 text-sm">Version 0.2.6</div>
        <p className="text-xl text-warcrow-text max-w-2xl mx-auto">
          Create and manage your Warcrow army lists with ease.
        </p>
        <div className="bg-warcrow-accent/50 p-4 rounded-lg max-w-2xl mx-auto">
          <p className="text-warcrow-gold font-semibold mb-2">🚧 Still in Development</p>
          <p className="text-warcrow-text">
            This application is actively being developed with frequent updates and improvements.
            We appreciate your patience and feedback!
          </p>
        </div>
        <div className="space-x-4">
          <Button
            onClick={() => navigate('/builder')}
            className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-medium transition-colors"
          >
            Start Building
          </Button>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="border-warcrow-gold text-black hover:bg-warcrow-gold hover:text-black transition-colors"
          >
            Sign Out
          </Button>
          <Button
            onClick={() => window.open('https://www.patreon.com/c/GutzStudio', '_blank')}
            variant="outline"
            className="border-warcrow-gold text-black hover:bg-warcrow-gold hover:text-black transition-colors"
          >
            Support on Patreon
          </Button>
        </div>
        <div className="mt-8 text-warcrow-text/80">
          <p>Have ideas, issues, love, or hate to share?</p>
          <a 
            href="mailto:warcrowarmy@gmail.com"
            className="text-warcrow-gold hover:text-warcrow-gold/80 underline"
          >
            Contact us at warcrowarmy@gmail.com
          </a>
        </div>
      </div>
      <footer className="absolute bottom-4 text-center text-sm text-warcrow-text/60 max-w-2xl px-4">
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