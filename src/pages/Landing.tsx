import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col relative overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTQuNjI3IDQuMzczQzU2LjA0OSAyLjk1MSA1OC4zNzEgMi45NTEgNTkuNzkzIDQuMzczQzYxLjIxNSA1Ljc5NSA2MS4yMTUgOC4xMTcgNTkuNzkzIDkuNTM5TDkuNTM5IDU5Ljc5M0M4LjExNyA2MS4yMTUgNS43OTUgNjEuMjE1IDQuMzczIDU5Ljc5M0MyLjk1MSA1OC4zNzEgMi45NTEgNTYuMDQ5IDQuMzczIDU0LjYyN0w1NC42MjcgNC4zNzN6TTQuMzczIDU0LjYyN0MyLjk1MSA1My4yMDUgMi45NTEgNTAuODgzIDQuMzczIDQ5LjQ2MUM1Ljc5NSA0OC4wMzkgOC4xMTcgNDguMDM5IDkuNTM5IDQ5LjQ2MUw1OS43OTMgOS41MzlDNjEuMjE1IDguMTE3IDYxLjIxNSA1Ljc5NSA1OS43OTMgNC4zNzNDNTguMzcxIDIuOTUxIDU2LjA0OSAyLjk1MSA1NC42MjcgNC4zNzNMNC4zNzMgNTQuNjI3eiIgZmlsbD0iIzJhMmQzNCIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-5" />
      
      <div className="container max-w-7xl mx-auto py-8 px-4 flex-grow relative z-10">
        <div className="flex flex-col items-center mb-8">
          <img 
            src="https://assets.corvusbelli.net/warcrow/web/logo_warcrow.png" 
            alt="Warcrow Logo" 
            className="h-24 mb-4 animate-fade-in"
          />
          <h1 className="text-4xl font-bold text-center mb-2 text-warcrow-gold animate-fade-in">
            Welcome to Warcrow Army Builder
          </h1>
          <p className="text-lg text-warcrow-text text-center max-w-2xl animate-fade-in">
            Warcrow Army Builder is a free tool for creating and managing army lists for the Warcrow miniatures game, designed to make list-building quick and easy.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto grid gap-8 mb-12 animate-fade-in">
          <Button 
            onClick={() => navigate('/builder')}
            className="w-full max-w-xs mx-auto block mb-4 bg-warcrow-accent hover:bg-warcrow-accent/90 text-warcrow-gold border border-warcrow-gold transition-all hover:scale-105"
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