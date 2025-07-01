
import * as React from "react";
import { NavDropdown } from "@/components/ui/NavDropdown";
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { PageHeader } from "@/components/common/PageHeader";
import { DataLoadingDiagnostics } from "@/components/debug/DataLoadingDiagnostics";
import ArmyBuilder from "@/components/army/ArmyBuilder";

const Index = () => {
  const { t } = useLanguage();
  const { userId, isAuthenticated } = useAuth();
  
  // Create a session-like object for backward compatibility with ArmyBuilder
  const session = React.useMemo(() => {
    if (isAuthenticated && userId) {
      return { user: { id: userId } } as any;
    }
    return null;
  }, [isAuthenticated, userId]);

  return (
    <div className="min-h-screen bg-warcrow-background">
      <PageHeader title={t('appTitle')}>
        <LanguageSwitcher />
        <NavDropdown />
      </PageHeader>

      <div className="container mx-auto py-8 px-4 md:px-8">
        <div className="animate-fade-in">
          <ArmyBuilder session={session} />
        </div>
      </div>

      <DataLoadingDiagnostics />
    </div>
  );
};

export default Index;
