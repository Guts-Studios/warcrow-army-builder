
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, ShieldAlert } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export const MainActions = () => {
  const { t } = useLanguage();
  const { isWabAdmin, isAuthenticated } = useAuth();
  const isMobile = useIsMobile();
  
  // Only show admin content if user is authenticated AND has admin privileges
  const showAdminContent = isAuthenticated === true && isWabAdmin === true;
  
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
