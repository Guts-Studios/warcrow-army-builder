import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="https://assets.corvusbelli.net/warcrow/web/logo_warcrow.png" 
            alt="Warcrow Logo" 
            className="h-24 mb-4"
          />
          <h1 className="text-4xl font-bold text-center mb-2 text-warcrow-gold">
            Warcrow Army Builder
          </h1>
          <p className="text-center text-warcrow-muted mb-8">
            Build and manage your Warcrow army lists
          </p>
          <Button 
            onClick={() => navigate('/builder')}
            className="bg-warcrow-gold hover:bg-warcrow-gold/90 text-black font-bold"
          >
            Start Building
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;