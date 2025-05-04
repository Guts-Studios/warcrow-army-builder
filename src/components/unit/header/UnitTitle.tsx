
import React from "react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { Circle } from "lucide-react";

interface UnitTitleProps {
  mainName: string;
  subtitle?: string;
  command?: boolean | number;
}

const UnitTitle: React.FC<UnitTitleProps> = ({ mainName, subtitle, command }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2 flex-wrap">
        <h3 className="text-warcrow-gold font-semibold text-sm sm:text-base leading-tight">
          {mainName}
        </h3>
        {command && (
          <div className="flex items-center">
            <Circle 
              size={16} 
              className="text-warcrow-gold" 
              fill="rgba(255, 215, 0, 0.3)" 
              strokeWidth={1.5}
            />
            {typeof command === 'number' && (
              <span className="text-warcrow-gold text-xs font-bold ml-0.5">{command}</span>
            )}
          </div>
        )}
      </div>
      {subtitle && (
        <p className="text-warcrow-text/80 text-xs">{subtitle}</p>
      )}
    </div>
  );
};

export default UnitTitle;
