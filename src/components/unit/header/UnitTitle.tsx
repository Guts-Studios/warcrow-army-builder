
import React from 'react';

interface UnitTitleProps {
  mainName: string;
  subtitle?: string;
  command?: number | boolean;
}

const UnitTitle = ({ mainName, subtitle, command }: UnitTitleProps) => {
  return (
    <div>
      <h3 className="font-medium text-lg text-warcrow-text">{mainName}</h3>
      {subtitle && <p className="text-sm text-warcrow-text/80">{subtitle}</p>}
      {command !== undefined && command !== false && command !== 0 && (
        <div className="mt-0.5 text-xs bg-warcrow-gold/20 border border-warcrow-gold inline-flex items-center px-1 rounded text-warcrow-text">
          <img 
            src="/art/icons/command_icon.png" 
            alt="Command" 
            className="h-3.5 w-3.5 mr-1"
          />
          <span>{command}</span>
        </div>
      )}
    </div>
  );
};

export default UnitTitle;
