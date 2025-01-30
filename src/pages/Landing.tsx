import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Import the changelog content
import changelogContent from '../../CHANGELOG.md?raw';

// Function to get the latest version from changelog
const getLatestVersion = (content: string): string => {
  const versionRegex = /\[(\d+\.\d+\.\d+)\]/;
  const matches = content.match(new RegExp(versionRegex, 'g'));
  if (!matches) return '0.0.0';
  
  return matches[0].match(versionRegex)![1];
};

const Landing = () => {
  const navigate = useNavigate();
  const [isGuest, setIsGuest] = useState(false);
  const latestVersion = getLatestVersion(changelogContent);

  useEffect(() => {
    const checkAuthStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsGuest(!session);
    };

    checkAuthStatus();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center relative overflow-x-hidden px-4 pb-32">
      <div className="text-center space-y-6 md:space-y-8 max-w-xl mx-auto">
        <img 
          src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
          alt="Warcrow Logo" 
          className="w-48 md:w-96 mx-auto"
        />
        <h1 className="text-2xl md:text-4xl font-bold text-warcrow-gold">
          Welcome to Warcrow Army Builder
        </h1>
        <div className="text-warcrow-gold/80 text-xs md:text-sm">Version {latestVersion}</div>
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
            onClick={() => navigate('/rules')}
            variant="outline"
            className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
          >
            Rules Reference
          </Button>
          <Button
            onClick={() => navigate('/missions')}
            variant="outline"
            className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
          >
            Missions
          </Button>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full md:w-auto border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black"
          >
            {isGuest ? "Signed in as Guest" : "Sign Out"}
          </Button>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="text-warcrow-gold hover:text-warcrow-gold/80"
            >
              View Changelog
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-warcrow-gold">Changelog</DialogTitle>
            </DialogHeader>
            <div className="whitespace-pre-wrap font-mono text-sm">
              {changelogContent}
            </div>
          </DialogContent>
        </Dialog>
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
      <footer className="fixed bottom-0 left-0 right-0 bg-warcrow-background/95 text-center text-xs md:text-sm text-warcrow-text/60 p-4">
        <p className="max-w-md md:max-w-2xl mx-auto">
          WARCROW and all associated marks, logos, places, names, creatures, races and race insignia/devices/logos/symbols, 
          vehicles, locations, weapons, units, characters, products, illustrations and images are either ® or ™, and/or © 
          Corvus Belli S.L.L. This is a fan-made application and is not officially endorsed by or affiliated with Corvus Belli S.L.L.
        </p>
      </footer>
    </div>
  );
};

export default Landing;
