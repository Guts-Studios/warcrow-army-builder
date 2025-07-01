
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { loadFeatTranslations, getFeatTranslation } from "@/utils/missionTranslationLoader";

interface Feat {
  id: string;
  name: string;
  details: string;
}

interface FeatDetailsProps {
  feat: Feat | null;
  isLoading: boolean;
}

export const FeatDetails = ({ feat, isLoading }: FeatDetailsProps) => {
  const { t, language } = useLanguage();
  const [translatedDetails, setTranslatedDetails] = useState<string>('');
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(false);

  useEffect(() => {
    const loadTranslations = async () => {
      if (!feat) {
        setTranslatedDetails('');
        return;
      }

      // Reset the content first to prevent overlapping
      setTranslatedDetails('');

      if (language === 'en') {
        setTranslatedDetails(feat.details);
        return;
      }

      setIsLoadingTranslations(true);
      try {
        await loadFeatTranslations();
        const translated = getFeatTranslation(
          feat.name, 
          language as 'es' | 'fr', 
          feat.details
        );
        setTranslatedDetails(translated);
      } catch (error) {
        console.error('Failed to load feat translations:', error);
        setTranslatedDetails(feat.details); // Fallback to original
      } finally {
        setIsLoadingTranslations(false);
      }
    };

    loadTranslations();
  }, [feat, language]);

  if (!feat) {
    return (
      <div className="text-warcrow-text text-center py-8 bg-black/50 rounded-md border border-warcrow-gold/10">
        {isLoading ? t('loadingFeatDetails') : t('selectFeatToView')}
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-black/70 p-6 rounded-lg border border-warcrow-gold/20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-warcrow-gold mb-4">
          {feat.name}
        </h2>
      </div>
      <ScrollArea className="h-[calc(100vh-32rem)] pr-4">
        <div className="text-warcrow-text whitespace-pre-wrap">
          {isLoadingTranslations ? (
            <div className="text-center py-4 text-warcrow-gold">
              {t('loadingFeatDetails')}...
            </div>
          ) : (
            <div key={`${feat.id}-${language}`}>
              {translatedDetails}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
