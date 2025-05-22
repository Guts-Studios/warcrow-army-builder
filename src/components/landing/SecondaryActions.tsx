
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";
import { BookOpenCheck, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewsArchiveDialog from "./NewsArchiveDialog";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export const SecondaryActions = ({ isGuest = false }: { isGuest?: boolean }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { clearAuthState } = useAuth();
  
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      clearAuthState();
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
    <>
      <div className="flex flex-row items-center justify-center gap-4">
        <Button
          variant="outline"
          className="border-warcrow-gold/30 text-warcrow-gold/70 hover:bg-transparent hover:text-warcrow-gold hover:border-warcrow-gold"
          size="sm"
          asChild
        >
          <Link to="/changelog">
            {t('viewChangelog')}
          </Link>
        </Button>
        <NewsArchiveDialog triggerClassName="border-warcrow-gold/30 text-warcrow-gold/70 hover:bg-transparent hover:text-warcrow-gold hover:border-warcrow-gold" />
      </div>

      <div className="flex justify-center">
        {!isGuest ? (
          <Button
            onClick={handleSignOut}
            disabled={isLoading}
            variant="link"
            size="sm"
            className="text-warcrow-text/60 hover:text-warcrow-text/80"
          >
            <LogOut className="h-4 w-4 mr-1" />
            {t('signOut')}
          </Button>
        ) : (
          <Button
            variant="link"
            size="sm"
            className="text-warcrow-text/60 hover:text-warcrow-text/80"
            asChild
          >
            <Link to="/login">
              {t('signedAsGuest')}
            </Link>
          </Button>
        )}
      </div>

      <div className="flex justify-center">
        <Button
          variant="link"
          size="sm"
          className="text-warcrow-gold/70 hover:text-warcrow-gold/90"
          asChild
        >
          <a href="https://www.buymeacoffee.com/warcrowarmy" target="_blank" rel="noopener noreferrer">
            {t('buyCoffee')}
          </a>
        </Button>
      </div>
    </>
  );
};
