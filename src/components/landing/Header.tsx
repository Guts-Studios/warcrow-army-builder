
import { getLatestVersion } from "@/utils/version";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BuildFailureAlert } from "@/components/landing/BuildFailureAlert";
import { NewsSection } from "@/components/landing/NewsSection";
import { ChangelogDialog } from "@/components/landing/ChangelogDialog";

interface HeaderProps {
  latestVersion: string;
  userCount: number | null;
  isLoadingUserCount: boolean;
  latestFailedBuild?: any;
  onRefreshUserCount?: () => void;
  authReady: boolean;
}

export const Header = ({ 
  latestVersion, 
  userCount, 
  isLoadingUserCount, 
  latestFailedBuild,
  onRefreshUserCount,
  authReady
}: HeaderProps) => {
  const { t } = useLanguage();
  const { isWabAdmin, isAuthenticated } = useAuth();
  const [shownBuildFailureId, setShownBuildFailureId] = useState<string | null>(null);
  
  console.log("[Header] Received authReady prop:", {
    authReady,
    isAuthenticated,
    timestamp: new Date().toISOString()
  });
  
  // Log when authReady changes
  useEffect(() => {
    console.log("[Header] 🔄 Auth ready state changed:", {
      authReady,
      isAuthenticated,
      timestamp: new Date().toISOString()
    });
    
    if (authReady) {
      console.log("[Header] ✅ Auth is ready, can now fetch news data");
    }
  }, [authReady, isAuthenticated]);
  
  // Update the shown build failure ID when a new one comes in
  useEffect(() => {
    if (latestFailedBuild?.id) {
      setShownBuildFailureId(latestFailedBuild.id);
    }
  }, [latestFailedBuild]);
  
  return (
    <div className="text-center space-y-6 md:space-y-8">
      <img 
        src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
        alt={t('logoAlt')} 
        className="w-64 md:w-[32rem] mx-auto"
        width="512"
        height="256"
        loading="eager"
        decoding="async"
      />
      <h1 className="text-2xl md:text-4xl font-bold text-warcrow-gold">
        {t('welcomeMessage')}
      </h1>
      <div className="text-warcrow-gold/80 text-xs md:text-sm">{t('version')} {latestVersion}</div>
      <p className="text-lg md:text-xl text-warcrow-text">
        {t('appDescription')}
      </p>
      <div>
        <p className="text-md md:text-lg text-warcrow-gold/80">
          {isLoadingUserCount ? (
            t('loadingUserCount')
          ) : (
            userCount !== null ? t('userCountMessage').replace('{count}', String(userCount)) : t('loadingUserCount')
          )}
        </p>
      </div>
      
      {/* Admin-only Build Failure Alert - Only for Warcrow sites */}
      <BuildFailureAlert 
        latestFailedBuild={latestFailedBuild}
        isWabAdmin={isWabAdmin}
        isPreview={false}
        shownBuildFailureId={shownBuildFailureId}
      />
      
      <NewsSection authReady={authReady} />
      
      {/* Changelog link - now visible and placed under news content */}
      <ChangelogDialog />
    </div>
  );
};
