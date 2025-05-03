
import { getLatestVersion } from "@/utils/version";
import { useLanguage } from "@/contexts/LanguageContext";

interface HeaderProps {
  latestVersion: string;
  userCount: number | null;
  isLoadingUserCount: boolean;
}

export const Header = ({ latestVersion, userCount, isLoadingUserCount }: HeaderProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center space-y-6 md:space-y-8">
      <img 
        src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
        alt={t('logoAlt')} 
        className="w-64 md:w-[32rem] mx-auto"
      />
      <h1 className="text-2xl md:text-4xl font-bold text-warcrow-gold">
        {t('welcomeMessage')}
      </h1>
      <div className="text-warcrow-gold/80 text-xs md:text-sm">{t('version')} {latestVersion}</div>
      <p className="text-lg md:text-xl text-warcrow-text">
        {t('appDescription')}
      </p>
      <p className="text-md md:text-lg text-warcrow-gold/80">
        {isLoadingUserCount ? (
          t('loadingUserCount')
        ) : (
          t('userCountMessage').replace('{count}', String(userCount))
        )}
      </p>
      <div className="bg-warcrow-accent/50 p-3 md:p-4 rounded-lg">
        <p className="text-warcrow-gold font-semibold mb-2 text-sm md:text-base">🚧 {t('inDevelopment')}</p>
        <p className="text-warcrow-text text-sm md:text-base">
          {t('recentNews')}
        </p>       
      </div>
    </div>
  );
};
