import { Command, BadgeCheck, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Unit } from "@/types/army";
import CharacteristicsSection from "./keyword-sections/CharacteristicsSection";

interface UnitHeaderProps {
  unit: Unit;
  mainName: string;
  subtitle?: string;
  portraitUrl?: string;
}

const UnitHeader = ({ unit, mainName, subtitle, portraitUrl }: UnitHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={portraitUrl} alt={mainName} />
        <AvatarFallback className="bg-warcrow-background text-warcrow-muted text-xs">
          {mainName.split(' ').map(word => word[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <span className="truncate max-w-[200px]">{mainName}</span>
            {subtitle && (
              <span className="text-xs text-warcrow-muted">{subtitle}</span>
            )}
          </div>
          {unit.command > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <div className="flex items-center gap-1">
                    <Command className="h-4 w-4 text-warcrow-gold" />
                    <span className="text-xs text-warcrow-gold">{unit.command}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Command Value</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {unit.highCommand && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <BadgeCheck className="h-4 w-4 text-warcrow-gold" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>High Command</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-6 w-6 p-0.5 hover:bg-warcrow-gold/20"
              >
                <Eye className="h-4 w-4 text-warcrow-gold" />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogTitle className="sr-only">{unit.name} Card Image</DialogTitle>
              {unit.imageUrl ? (
                <img 
                  src={unit.imageUrl} 
                  alt={unit.name} 
                  className="w-full h-auto rounded-lg"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-warcrow-background/50 rounded-lg flex items-center justify-center text-warcrow-muted">
                  Card image coming soon
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
        <CharacteristicsSection keywords={unit.keywords} />
      </div>
    </div>
  );
};

export default UnitHeader;