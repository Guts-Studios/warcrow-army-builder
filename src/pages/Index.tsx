import { useState, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import FactionSelector from "@/components/FactionSelector";
import ArmyList from "@/components/ArmyList";
import { Loader2 } from "lucide-react";

const Index = () => {
  const [selectedFaction, setSelectedFaction] = useState("northern-tribes");
  const navigate = useNavigate();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col relative overflow-x-hidden">
        <div className="container max-w-7xl mx-auto py-8 px-4 flex-grow relative z-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="w-fit border-warcrow-gold text-warcrow-gold bg-black hover:bg-warcrow-gold hover:text-black"
            >
              Back to Home
            </Button>
            <img 
              src="/art/decorative-frame.png"
              alt="Warcrow Logo" 
              className="h-16 md:h-24 mx-auto"
              loading="eager"
              width={96}
              height={96}
            />
            <div className="hidden md:block w-[100px]" />
          </div>
          
          <div className="hidden md:block">
            <FactionSelector
              selectedFaction={selectedFaction}
              onFactionChange={setSelectedFaction}
            />
          </div>

          <ErrorBoundary fallback={<ErrorFallback />}>
            <Suspense fallback={
              <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-warcrow-gold mx-auto mb-4" />
                  <p className="text-warcrow-gold">Loading army builder...</p>
                </div>
              </div>
            }>
              <ArmyList 
                selectedFaction={selectedFaction} 
                onFactionChange={setSelectedFaction}
              />
            </Suspense>
          </ErrorBoundary>
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  );
};

// Simple error boundary fallback component
const ErrorFallback = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="text-center">
      <p className="text-warcrow-gold mb-4">Something went wrong loading the army builder.</p>
      <Button 
        onClick={() => window.location.reload()}
        variant="outline"
        className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black"
      >
        Try Again
      </Button>
    </div>
  </div>
);

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Army builder error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default Index;