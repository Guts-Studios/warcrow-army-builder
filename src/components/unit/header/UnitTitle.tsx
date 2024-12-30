interface UnitTitleProps {
  mainName: string;
  subtitle?: string;
  highCommand?: boolean;
}

const UnitTitle = ({ mainName, subtitle }: UnitTitleProps) => {
  return (
    <div className="flex-1">
      <div className="flex items-center">
        <h3 className="font-semibold text-warcrow-text">{mainName}</h3>
      </div>
      {subtitle && (
        <p className="text-sm text-warcrow-muted">{subtitle}</p>
      )}
    </div>
  );
};

export default UnitTitle;