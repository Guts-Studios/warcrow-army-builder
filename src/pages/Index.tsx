import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FactionSelector from "@/components/FactionSelector";
import ArmyList from "@/components/ArmyList";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const Index = () => {
  const [selectedFaction, setSelectedFaction] = useState("northern-tribes");
  const session = useSession();
  const navigate = useNavigate();

  if (!session) {
    navigate("/login");
    return null;
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-warcrow-background text-warcrow-text">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center mb-8">
            <Button
              onClick={() => navigate('/')}
              variant="outline"
              className="self-start mb-4 border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background"
            >
              Back to Home
            </Button>
            <img
              src="/art/decorative-frame.png"
              alt="Warcrow Logo"
              className="w-32 h-32 mb-4"
              loading="eager"
              width={128}
              height={128}
            />
            <h1 className="text-4xl font-bold text-warcrow-gold mb-8">
              Army Builder
            </h1>
          </div>

          <div className="hidden md:block mb-8">
            <FactionSelector
              selectedFaction={selectedFaction}
              onFactionChange={setSelectedFaction}
            />
          </div>

          <ErrorBoundary
            fallback={
              <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <h2 className="text-xl font-bold text-warcrow-gold">
                  Something went wrong
                </h2>
                <p className="text-warcrow-text">Please try reloading the page</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background"
                >
                  Reload
                </Button>
              </div>
            }
          >
            <React.Suspense
              fallback={
                <div className="flex items-center justify-center min-h-[400px]">
                  <Loader2 className="h-8 w-8 animate-spin text-warcrow-gold" />
                </div>
              }
            >
              <ArmyList
                selectedFaction={selectedFaction}
                onFactionChange={setSelectedFaction}
              />
            </React.Suspense>
          </ErrorBoundary>
        </div>
        <Toaster />
      </div>
    </TooltipProvider>
  );
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Army builder error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default Index;