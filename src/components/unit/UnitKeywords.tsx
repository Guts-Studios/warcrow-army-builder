import { Keyword } from "@/types/army";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";

interface UnitKeywordsProps {
  keywords: Keyword[];
  specialRules?: string[];
  companion?: string;
}

const UnitKeywords = ({ keywords, specialRules, companion }: UnitKeywordsProps) => {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1">
        {keywords.map((keyword, index) => (
          <TooltipProvider key={index}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="outline" className="text-xs cursor-help">
                  {keyword.name}
                </Badge>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p className="text-sm">{keyword.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {specialRules && specialRules.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {specialRules.map((rule, index) => {
            const ruleKey = rule.toLowerCase().split('(')[0].trim();
            const definition = specialRuleDefinitions[ruleKey];
            
            return (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="secondary" className="text-xs cursor-help">
                      {rule}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="text-sm">{definition || "Definition coming soon"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      )}

      {companion && (
        <div className="flex flex-wrap gap-1">
          <Badge variant="destructive" className="text-xs">
            Companion of: {companion.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </Badge>
        </div>
      )}
    </div>
  );
};

export default UnitKeywords;