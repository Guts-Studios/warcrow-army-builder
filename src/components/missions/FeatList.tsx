
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

interface Feat {
  id: string;
  name: string;
  displayName?: string;
  details: string;
}

interface FeatListProps {
  feats: Feat[];
  selectedFeat: Feat | null;
  onSelectFeat: (feat: Feat) => void;
  isLoading: boolean;
}

export const FeatList = ({ 
  feats, 
  selectedFeat, 
  onSelectFeat, 
  isLoading 
}: FeatListProps) => {
  const { t } = useLanguage();
  
  return (
    <Card className="bg-warcrow-accent p-6">
      <h2 className="text-xl font-bold text-warcrow-gold mb-4">{t('feats')}</h2>
      {isLoading ? (
        <div className="text-warcrow-text text-center py-4">{t('loadingFeats')}</div>
      ) : (
        <div className="space-y-2">
          {feats.map((feat) => (
            <Button
              key={feat.id}
              variant="ghost"
              className={`w-full justify-start text-lg font-medium ${
                selectedFeat?.id === feat.id
                  ? "text-warcrow-gold bg-black/20"
                  : "text-warcrow-text hover:text-warcrow-gold hover:bg-black/20"
              }`}
              onClick={() => onSelectFeat(feat)}
            >
              {feat.displayName || feat.name}
            </Button>
          ))}
        </div>
      )}
    </Card>
  );
};
