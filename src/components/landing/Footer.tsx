
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

export const Footer = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="w-full bg-black py-3 border-t border-warcrow-gold/10">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-warcrow-text/60">
          <div className="mb-2 md:mb-0 text-center md:text-left">
            {t('footerText')}
          </div>
          <div className="flex space-x-4">
            <Link to="/terms" className="hover:text-warcrow-gold transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-warcrow-gold transition-colors">Privacy</Link>
            <Link to="/about" className="hover:text-warcrow-gold transition-colors">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
