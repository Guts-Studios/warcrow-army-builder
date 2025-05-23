
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useEnvironment } from "@/hooks/useEnvironment";
import { BookOpen, ShieldAlert } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const MainActions = () => {
  const { t } = useLanguage();
  const { isWabAdmin, isAuthenticated } = useAuth();
  const { isPreview } = useEnvironment();
  const isMobile = useIsMobile();
  
  // Calculate if the user should see admin content - simplified logic
  const showAdminContent = (isWabAdmin || isPreview) && isAuthenticated;
  
  console.log("MainActions: Admin visibility check:", { isWabAdmin, isAuthenticated, isPreview, showAdminContent });
  
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap max-w-xs sm:max-w-none mx-auto px-4 sm:px-0">
      <Button 
        variant="gold" 
        size="lg" 
        asChild
        className="w-full sm:w-auto"
      >
        <Link to="/builder">
          {t('startBuilding')}
        </Link>
      </Button>
      
      <Button 
        variant="outline"
        size="lg" 
        className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10 w-full sm:w-auto"
        asChild
      >
        <Link to="/rules">
          <BookOpen className="mr-2 h-5 w-5" />
          Rules & FAQ
        </Link>
      </Button>
      
      {showAdminContent && (
        <Button 
          variant="outline"
          size="lg" 
          className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10 w-full sm:w-auto"
          asChild
        >
          <Link to="/admin">
            <ShieldAlert className="mr-2 h-5 w-5" />
            Admin
          </Link>
        </Button>
      )}
    </div>
  );
};
