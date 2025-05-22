
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface SupportButtonProps {
  className?: string;
}

export const SupportButton = ({ className }: SupportButtonProps) => {
  const { t } = useLanguage();
  
  return (
    <Link 
      to="/about"
      className={cn(
        "flex items-center gap-1 px-3 py-1.5 rounded-md text-warcrow-gold hover:bg-warcrow-gold/10 transition-colors", 
        className
      )}
      aria-label={t('supportUs')}
    >
      <Heart className="h-4 w-4" />
      <span className="text-sm font-medium">{t('supportUs')}</span>
    </Link>
  );
};
