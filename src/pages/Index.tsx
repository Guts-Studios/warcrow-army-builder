
import * as React from "react";
import { supabase } from "@/integrations/supabase/client";
import { NavDropdown } from "@/components/ui/NavDropdown";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { PageHeader } from "@/components/common/PageHeader";
import { DataLoadingDiagnostics } from "@/components/debug/DataLoadingDiagnostics";
import ArmyBuilderSimple from "@/components/army/ArmyBuilderSimple";

const Index = () => {
  const [session, setSession] = React.useState(null);
  const { t } = useLanguage();
  
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
        <LanguageSwitcher />
        <NavDropdown />
      </PageHeader>

      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="animate-fade-in">
          <ArmyBuilderSimple session={session} />
        </div>
      </div>

      <DataLoadingDiagnostics />
    </div>
  );
};

export default Index;
