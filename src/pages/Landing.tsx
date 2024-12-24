import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col relative overflow-hidden">
      <div 
        className="absolute inset-x-0 -top-1/4 h-[150%] z-0 bg-contain bg-top bg-no-repeat opacity-20 scale-100"
        style={{ backgroundImage: 'url(/art/decorative-frame.png)' }}
      />
      <div className="container max-w-7xl mx-auto py-8 px-4 flex-grow relative z-10">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="https://assets.corvusbelli.net/warcrow/web/logo_warcrow.png" 
            alt="Warcrow Logo" 
            className="h-24 mb-4"
          />
          <h1 className="text-4xl font-bold text-center mb-4 text-warcrow-gold">
            Warcrow Army Builder
          </h1>
          <p className="text-center text-lg mb-8 max-w-2xl">
            Warcrow Army Builder is a free tool for creating and managing army lists for the Warcrow miniatures game, designed to make list-building quick and easy.
          </p>
          <Button
            onClick={() => navigate('/builder')}
            className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black font-semibold px-8 py-4 text-lg"
          >
            Start Building
          </Button>
        </div>
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