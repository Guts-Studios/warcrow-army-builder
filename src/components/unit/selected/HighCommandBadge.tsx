import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Check } from "lucide-react";

const HighCommandBadge = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <Check className="h-4 w-4 text-warcrow-gold" />
        </TooltipTrigger>
        <TooltipContent>
          <p>High Command</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default HighCommandBadge;