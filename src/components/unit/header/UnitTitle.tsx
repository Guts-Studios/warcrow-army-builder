
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
        <div className="mt-0.5 text-xs bg-warcrow-gold/20 border border-warcrow-gold inline-block px-1 rounded text-warcrow-text">
          Command: {command}
        </div>
      )}
    </div>
  );
};

export default UnitTitle;
