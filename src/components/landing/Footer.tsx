
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-warcrow-background/95 text-center text-xs md:text-sm text-warcrow-text/60 p-4">
      <p className="max-w-md md:max-w-2xl mx-auto">
        {t('footerText')}
      </p>
    </footer>
  );
};
