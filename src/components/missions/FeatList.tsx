
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Feat {
  id: string;
  name: string;
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
  
  return (
    <Card className="bg-warcrow-accent p-6">
      <h2 className="text-xl font-bold text-warcrow-gold mb-4">Feats</h2>
      {isLoading ? (
        <div className="text-warcrow-text text-center py-4">Loading feats...</div>
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
              {feat.name}
            </Button>
          ))}
          {feats.length === 0 && (
            <div className="text-warcrow-text text-center py-4">
              No feats available yet
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
