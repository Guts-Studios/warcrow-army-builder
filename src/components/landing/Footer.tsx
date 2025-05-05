
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t, language } = useLanguage();
  
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-warcrow-background/95 text-center text-xs md:text-sm text-warcrow-text/60 p-2 md:p-4 z-10">
      <div className="max-w-md md:max-w-2xl mx-auto px-2 space-y-1">
        <p>
          {t('footerText')}
        </p>
        <p className="text-xs text-warcrow-text/40">
          {language === 'en' 
            ? "Warcrow © 2024 Corvus Belli S.L. - All rights reserved. This is an unofficial fan-made tool."
            : "Warcrow © 2024 Corvus Belli S.L. - Todos los derechos reservados. Esta es una herramienta no oficial creada por fans."}
        </p>
      </div>
    </footer>
  );
};
