
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useEnvironment } from "@/hooks/useEnvironment";
import { BookOpen, ShieldAlert } from "lucide-react";

export const MainActions = () => {
  const { t } = useLanguage();
  const { isWabAdmin, isGuest } = useAuth();
  const { isPreview } = useEnvironment();
  
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center flex-wrap">
      <Button 
        variant="gold" 
        size="lg" 
        asChild
      >
        <Link to="/builder">
          {t('startBuilding')}
        </Link>
      </Button>
      
      <Button 
        variant="outline"
        size="lg" 
        className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
        asChild
      >
        <Link to="/rules">
          <BookOpen className="mr-2 h-5 w-5" />
          Rules & FAQ
        </Link>
      </Button>
      
      {((isWabAdmin || isPreview) && !isGuest) && (
        <Button 
          variant="outline"
          size="lg" 
          className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
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
