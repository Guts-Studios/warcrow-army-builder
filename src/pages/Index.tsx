import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArmyBuilder } from "@/components/army/ArmyBuilder";
import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

const Index = () => {
  const navigate = useNavigate();
  const { toast: hookToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(true);

  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  React.useEffect(() => {
    const checkPreviewMode = () => {
      const isPreview = window.location.hostname === 'lovableproject.com' || 
                       window.location.hostname.endsWith('.lovableproject.com');
      return isPreview;
    };

    const setupAuth = async () => {
      try {
        if (checkPreviewMode()) {
          setIsLoading(false);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          toast.warning(
            "You are in offline mode. Cloud features like saving lists will not be available.",
            {
              duration: 5000,
            }
          );
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth setup error:', error);
        hookToast({
          title: "Authentication Error",
          description: "There was a problem checking your authentication status.",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    setupAuth();
  }, [hookToast]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              onClick={() => navigate('/rules')} 
              className="bg-warcrow-accent text-warcrow-text hover:bg-warcrow-accent/80 transition-colors border border-warcrow-gold/30"
            >
              Rules
            </Button>
            <Button 
              variant="outline"
              onClick={() => navigate('/landing')} 
              className="bg-warcrow-accent text-warcrow-text hover:bg-warcrow-accent/80 transition-colors border border-warcrow-gold/30"
            >
              Home
            </Button>
          </div>
          <img
            src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z"
            alt="Warcrow Logo"
            className="h-24 md:h-32"
          />
          <div className="w-[140px]" />
        </div>
        <ArmyBuilder session={session} />
      </div>
    </div>
  );
};

export default Index;