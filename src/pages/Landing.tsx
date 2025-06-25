
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLatestVersion } from "@/utils/version";
import { Header } from "@/components/landing/Header";
import { MainActions } from "@/components/landing/MainActions";
import { SecondaryActions } from "@/components/landing/SecondaryActions";
import { Footer } from "@/components/landing/Footer";
import { PWAUpdatePrompt } from "@/components/pwa/PWAUpdatePrompt";
import { SupportButton } from "@/components/landing/SupportButton";
import { NavDropdown } from "@/components/ui/NavDropdown";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Landing = () => {
  const { authReady } = useAuth();
  const { t } = useLanguage();
  const latestVersion = getLatestVersion();

  // Fetch user count
  const { data: userCount, isLoading: isLoadingUserCount } = useQuery({
    queryKey: ['user-count'],
    queryFn: async () => {
      const { count } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      return count || 0;
    },
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return (
    <div className="min-h-screen bg-warcrow-background flex flex-col">
      {/* Top Navigation Bar */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <SupportButton />
        <LanguageSwitcher />
        <NavDropdown />
      </div>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto space-y-8">
          <Header 
            latestVersion={latestVersion}
            userCount={userCount}
            isLoadingUserCount={isLoadingUserCount}
            authReady={authReady}
          />
          
          <MainActions />
          
          <SecondaryActions />
        </div>
      </div>
      
      <Footer />
      <PWAUpdatePrompt />
    </div>
  );
};

export default Landing;
