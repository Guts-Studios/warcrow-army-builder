import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col relative overflow-hidden">
      <div className="container max-w-7xl mx-auto py-8 px-4 flex-grow relative z-10">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="https://assets.corvusbelli.net/warcrow/web/logo_warcrow.png" 
            alt="Warcrow Logo" 
            className="h-24 mb-4"
          />
          <h1 className="text-4xl font-bold text-center mb-2 text-warcrow-gold">
            Welcome to Warcrow Army Builder
          </h1>
          <p className="text-lg text-warcrow-text text-center max-w-2xl">
            Warcrow Army Builder is a free tool for creating and managing army lists for the Warcrow miniatures game, designed to make list-building quick and easy.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/builder')}
          className="w-full max-w-xs mx-auto block mb-4 bg-warcrow-accent hover:bg-warcrow-accent/90 text-warcrow-gold border border-warcrow-gold"
        >
          Start Building
        </Button>
      </div>
      <footer className="w-full py-4 bg-warcrow-accent relative z-20">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <a 
            href="https://www.patreon.com/GutzStudio" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-warcrow-gold hover:text-warcrow-gold/80 transition-colors"
          >
            Support us on Patreon
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;