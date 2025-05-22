
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { NavDropdown } from "@/components/ui/NavDropdown";
import { useLanguage } from "@/contexts/LanguageContext";
import { PageHeader } from "@/components/common/PageHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";

export const UnitStatsHeader = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <PageHeader title={t('unitStats')}>
      <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
        <Button
          variant="outline"
          className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
          onClick={() => navigate('/builder')}
        >
          {t('armyBuilder')}
        </Button>
        <Button
          variant="outline"
          className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
          onClick={() => navigate('/rules')}
        >
          {t('rules')}
        </Button>
        <Button
          variant="outline"
          className="border-warcrow-gold text-warcrow-gold hover:bg-black hover:border-black hover:text-warcrow-gold transition-colors bg-black w-full md:w-auto"
          onClick={() => navigate('/landing')}
        >
          <Home className="mr-2 h-4 w-4" />
          {t('home')}
        </Button>
      </div>
      <LanguageSwitcher />
      <NavDropdown />
    </PageHeader>
  );
};
