import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Diamond } from "lucide-react";

interface CommandPointsProps {
  command: number;
}

const CommandPoints = ({ command }: CommandPointsProps) => {
  if (!command) return null;
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex items-center gap-0.5 text-warcrow-gold">
            <Diamond className="h-4 w-4" />
            {command}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          <p>Command Points: {command}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CommandPoints;