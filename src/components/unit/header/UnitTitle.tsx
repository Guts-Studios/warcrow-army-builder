interface UnitTitleProps {
  mainName: string;
  subtitle?: string;
  highCommand?: boolean;
}

const UnitTitle = ({ mainName, subtitle, highCommand }: UnitTitleProps) => {
  return (
    <div className="flex-1">
      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-warcrow-text">{mainName}</h3>
        {highCommand && (
          <span className="text-xs bg-warcrow-gold text-black px-2 py-0.5 rounded">
            High Command
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-sm text-warcrow-muted">{subtitle}</p>
      )}
    </div>
  );
};

export default UnitTitle;