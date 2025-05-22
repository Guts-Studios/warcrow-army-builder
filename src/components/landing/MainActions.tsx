
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export const MainActions = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center">
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
        variant="gold" 
        size="lg" 
        asChild
      >
        <Link to="/login">
          {t('signIn')}
        </Link>
      </Button>
    </div>
  );
};
