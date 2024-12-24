import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col relative overflow-hidden">
      <div 
        className="absolute -left-[50px] -right-[50px] top-0 bottom-0 z-0 bg-contain bg-top bg-no-repeat opacity-20 scale-100"
        style={{ backgroundImage: 'url(/art/decorative-frame.png)' }}
      />
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
          <p className="text-lg text-warcrow-muted">
            Create and manage your army lists with ease.
          </p>
        </div>
        <Button 
          onClick={() => navigate('/builder')}
          className="w-full max-w-xs mx-auto block mb-4 bg-warcrow-accent hover:bg-warcrow-accent/90 text-warcrow-gold border border-warcrow-gold"
        >
          Start Building
        </Button>
      </div>
    </div>
  );
};

export default Landing;
