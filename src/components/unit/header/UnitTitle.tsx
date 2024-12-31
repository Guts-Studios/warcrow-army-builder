import { Diamond } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface UnitTitleProps {
  mainName: string;
  subtitle?: string;
  command?: number;
}

const UnitTitle = ({ mainName, subtitle, command }: UnitTitleProps) => {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-1">
        <h3 className="font-semibold text-warcrow-text">{mainName}</h3>
        {command && command > 0 ? (
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
        ) : (
          <span className="text-sm text-warcrow-muted"></span>
        )}
      </div>
      {subtitle && (
        <p className="text-sm text-warcrow-muted">{subtitle}</p>
      )}
    </div>
  );
};

export default UnitTitle;
