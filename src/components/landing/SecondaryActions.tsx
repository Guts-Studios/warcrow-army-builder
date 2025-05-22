
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const SecondaryActions = ({ isGuest = false }: { isGuest?: boolean }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { forceSignOut } = useAuth();
  
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      forceSignOut(); // Use forceSignOut instead of clearAuthState
      navigate('/');
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="max-w-xs mx-auto px-4 sm:px-0 w-full">
      <div className="flex justify-center">
        {!isGuest ? (
          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="border-warcrow-gold/30 text-warcrow-gold/70 hover:bg-transparent hover:text-warcrow-gold hover:border-warcrow-gold"
          >
            <LogOut className="h-4 w-4 mr-1" />
            {t('signOut')}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            className="border-warcrow-gold/30 text-warcrow-gold/70 hover:bg-transparent hover:text-warcrow-gold hover:border-warcrow-gold"
            asChild
          >
            <Link to="/login">
              {t('signedAsGuest')}
            </Link>
          </Button>
        )}
      </div>

      {/* We've kept the About Us button as it was already moved to the top as a SupportButton */}
    </div>
  );
};
