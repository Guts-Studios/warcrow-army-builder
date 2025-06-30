
import React from 'react';
import { useState, useEffect } from 'react';
import ArmyBuilder from '@/components/army/ArmyBuilder';
import { NavDropdown } from '@/components/ui/NavDropdown';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { PageHeader } from '@/components/common/PageHeader';
import { supabase } from '@/integrations/supabase/client';
import { Session } from '@supabase/supabase-js';

const ArmyBuilderPage: React.FC = () => {
  const { t } = useLanguage();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
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
      <PageHeader title="Army Builder">
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

export default ArmyBuilderPage;
