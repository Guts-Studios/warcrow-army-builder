
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { loadMissionTranslations, getMissionTranslation } from "@/utils/missionTranslationLoader";

interface Mission {
  id: string;
  title: string;
  details: string;
  isHomebrew: boolean;
}

interface MissionDetailsProps {
  mission: Mission | null;
  isLoading: boolean;
}

export const MissionDetails = ({ mission, isLoading }: MissionDetailsProps) => {
  const { t, language } = useLanguage();
  const [translatedDetails, setTranslatedDetails] = useState<string>('');
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(false);

  useEffect(() => {
    const loadTranslations = async () => {
      if (!mission) {
        setTranslatedDetails('');
        return;
      }

      // Reset the content first to prevent overlapping
      setTranslatedDetails('');

      if (language === 'en') {
        setTranslatedDetails(mission.details);
        return;
      }

      setIsLoadingTranslations(true);
      try {
        await loadMissionTranslations();
        const translated = getMissionTranslation(
          mission.title, 
          language as 'es' | 'fr', 
          mission.details
        );
        setTranslatedDetails(translated);
      } catch (error) {
        console.error('Failed to load mission translations:', error);
        setTranslatedDetails(mission.details); // Fallback to original
      } finally {
        setIsLoadingTranslations(false);
      }
    };

    loadTranslations();
  }, [mission, language]);

  if (!mission) {
    return (
      <div className="text-warcrow-text text-center py-8 bg-black/50 rounded-md border border-warcrow-gold/10">
        {isLoading ? t('loadingMissionDetails') : t('selectMissionToView')}
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-black/70 p-6 rounded-lg border border-warcrow-gold/20">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-warcrow-gold mb-4">
          {mission.title}
        </h2>
        <div className="flex gap-2">
          {!mission.isHomebrew ? (
            <Badge variant="secondary" className="bg-warcrow-gold/20 text-warcrow-gold border-warcrow-gold/40">
              {t('official')}
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-purple-800/40 text-purple-200 border-purple-600">
              {t('community')}
            </Badge>
          )}
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-32rem)] pr-4">
        <div className="text-warcrow-text whitespace-pre-wrap">
          {isLoadingTranslations ? (
            <div className="text-center py-4 text-warcrow-gold">
              {t('loadingMissionDetails')}...
            </div>
          ) : (
            <div key={`${mission.id}-${language}`}>
              {translatedDetails}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
