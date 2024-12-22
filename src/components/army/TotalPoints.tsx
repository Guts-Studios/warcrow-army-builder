import { SelectedUnit } from "@/types/army";

interface TotalPointsProps {
  selectedUnits: SelectedUnit[];
}

const TotalPoints = ({ selectedUnits }: TotalPointsProps) => {
  const totalPoints = selectedUnits.reduce(
    (total, unit) => total + unit.pointsCost * unit.quantity,
    0
  );

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-warcrow-background border-t border-warcrow-gold p-4">
      <div className="container max-w-7xl mx-auto flex flex-col md:flex-row md:justify-center items-center gap-2">
        <span className="text-warcrow-text">Total Army Points:</span>
        <span className="text-warcrow-gold text-xl font-bold">
          {totalPoints} pts
        </span>
      </div>
    </div>
  );
};

export default TotalPoints;