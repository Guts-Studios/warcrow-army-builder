import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";
import FactionSelector from "@/components/FactionSelector";
import ArmyList from "@/components/ArmyList";
import { Loader2 } from "lucide-react";
import * as React from "react";

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
    <ErrorBoundary
      fallback={
        <div className="flex flex-col items-center justify-center min-h-screen p-4 space-y-4 bg-warcrow-background text-warcrow-text">
          <h2 className="text-xl font-bold text-warcrow-gold">
            Something went wrong
          </h2>
          <p>Please try reloading the page</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-warcrow-gold text-warcrow-background rounded hover:bg-warcrow-gold/80 transition-colors"
          >
            Reload
          </button>
        </div>
      }
    >
      <div className="min-h-screen bg-warcrow-background text-warcrow-text">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center mb-8">
            <img
              src="/art/decorative-frame.png"
              alt="Warcrow Logo"
              className="w-32 h-32 mb-4"
              loading="eager"
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
        </div>
      </div>
    </ErrorBoundary>
  );
};

// Error boundary component
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