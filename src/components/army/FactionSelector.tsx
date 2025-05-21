
import React from 'react';
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useFactions } from "@/components/stats/unit-explorer/useUnitData";

interface FactionSelectorProps {
  onSelect: (factionId: string) => void;
}

export const FactionSelector: React.FC<FactionSelectorProps> = ({ onSelect }) => {
  const { t } = useLanguage();
  const { data: factions = [], isLoading } = useFactions();

  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-warcrow-gold mb-4">{t('selectFaction')}</h2>
      <p className="text-warcrow-text mb-6">
        {t('selectFactionDescription')}
      </p>
      <div className="flex flex-wrap gap-2">
        {isLoading ? (
          <div className="w-full text-center py-4">
            <div className="w-6 h-6 border-2 border-warcrow-gold border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p>{t('loadingFactions')}</p>
          </div>
        ) : (
          factions.map((faction) => (
            <Button 
              key={faction.id} 
              variant="outline" 
              className="border-warcrow-gold text-warcrow-text hover:bg-warcrow-gold/20"
              onClick={() => onSelect(faction.id)}
            >
              {faction.name}
            </Button>
          ))
        )}
      </div>
    </div>
  );
};
