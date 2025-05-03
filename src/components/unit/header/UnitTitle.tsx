
import React from "react";
import { Badge } from "@/components/ui/badge";

interface UnitTitleProps {
  mainName: string;
  subtitle?: string;
  command?: boolean;
}

const UnitTitle: React.FC<UnitTitleProps> = ({ mainName, subtitle, command }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-warcrow-gold font-semibold text-sm sm:text-base leading-tight">
          {mainName}
        </h3>
        {command && (
          <Badge className="bg-warcrow-gold text-black text-xs py-0 px-1">Command</Badge>
        )}
      </div>
      {subtitle && (
        <p className="text-warcrow-text/80 text-xs">{subtitle}</p>
      )}
    </div>
  );
};

export default UnitTitle;
