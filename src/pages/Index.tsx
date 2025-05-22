
import * as React from "react";
import ArmyBuilder from "@/components/army/ArmyBuilder";
import { supabase } from "@/integrations/supabase/client";
import { NavDropdown } from "@/components/ui/NavDropdown";
import { Link } from "react-router-dom";
import { PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { PageHeader } from "@/components/common/PageHeader";

const Index = () => {
  const [session, setSession] = React.useState(null);
  const { isTester, isWabAdmin } = useAuth();
  const { t } = useLanguage();
  const isPreview = window.location.hostname === 'lovableproject.com' || 
                   window.location.hostname.endsWith('.lovableproject.com');
  
  // Check if user has permission to see the Play Mode
  const canAccessPlayMode = isTester || isWabAdmin || isPreview;

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-warcrow-background">
      <PageHeader title={t('appTitle')}>
        {canAccessPlayMode && (
          <Link to="/play">
            <Button 
              className="bg-warcrow-gold text-warcrow-background hover:bg-warcrow-gold/90 flex items-center gap-2"
            >
              <PlayCircle className="h-5 w-5" />
              <span>{t('playMode')}</span>
            </Button>
          </Link>
        )}
        <LanguageSwitcher />
        <NavDropdown />
      </PageHeader>

      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="animate-fade-in">
          <ArmyBuilder session={session} />
        </div>
      </div>
    </div>
  );
};

export default Index;
