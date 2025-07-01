
import { ScrollArea } from "@/components/ui/scroll-area";

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
  if (!feat) {
    return (
      <div className="text-warcrow-text text-center py-8 bg-black/50 rounded-md border border-warcrow-gold/10">
        {isLoading ? 'Loading feat details...' : 'Select a feat to view details'}
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
          {feat.details}
        </div>
      </ScrollArea>
    </div>
  );
};
