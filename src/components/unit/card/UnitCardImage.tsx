
import { Unit } from "@/types/army";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";

interface UnitCardImageProps {
  unit: Unit;
}

const UnitCardImage = ({ unit }: UnitCardImageProps) => {
  const { language } = useLanguage();
  
  // Determine which image to use based on language
  const getCardImageUrl = (unitImageUrl: string | undefined): string => {
    if (!unitImageUrl) return "";
    
    // If Spanish or French is selected, check if a localized version exists
    if (language === 'es' || language === 'fr') {
      // Transform the URL to look for the language-specific version
      const baseUrl = unitImageUrl.replace('.jpg', '');
      const languageSuffix = language === 'es' ? '_sp' : '_fr';
      const localizedUrl = `${baseUrl}${languageSuffix}.jpg`;
      
      return localizedUrl;
    }
    
    // Otherwise return the original URL
    return unitImageUrl;
  };

  const cardImageUrl = getCardImageUrl(unit.imageUrl);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="w-full border border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-black h-auto py-2"
        >
          <Eye className="h-4 w-4 mr-2" />
          {language === 'es' ? 'Ver Carta' : language === 'fr' ? 'Voir Carte' : 'View Card'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-warcrow-background border-warcrow-accent max-w-4xl w-[95vw] p-0">
        <DialogTitle className="sr-only">{unit.name} Card Image</DialogTitle>
        {cardImageUrl ? (
          <img
            src={cardImageUrl}
            alt={unit.name}
            className="w-full h-auto rounded-lg object-contain max-h-[90vh]"
            loading="eager"
            onError={(e) => {
              // If the localized image fails to load, fall back to the English version
              if ((language === 'es' || language === 'fr') && cardImageUrl !== unit.imageUrl) {
                (e.target as HTMLImageElement).src = unit.imageUrl || '';
              }
            }}
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-warcrow-background/50 rounded-lg flex items-center justify-center text-warcrow-muted">
            {language === 'es' 
              ? 'Imagen de carta próximamente' 
              : language === 'fr' 
                ? 'Image de carte à venir' 
                : 'Card image coming soon'}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UnitCardImage;
