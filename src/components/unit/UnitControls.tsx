import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface UnitControlsProps {
  quantity: number;
  availability: number;
  pointsCost: number;
  onAdd: () => void;
  onRemove: () => void;
}

const UnitControls = ({ quantity, availability, pointsCost, onAdd, onRemove }: UnitControlsProps) => {
  return (
    <div className="flex items-center justify-end mt-2">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onRemove}
          disabled={quantity === 0}
          className="h-7 w-7 bg-[#1A1F2C] border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-[#1A1F2C] disabled:opacity-50 disabled:hover:bg-[#1A1F2C] disabled:hover:text-[#9b87f5]"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="text-warcrow-text min-w-[2rem] text-center text-sm">
          {quantity}/{availability}
        </span>
        <Button
          variant="outline"
          size="icon"
          onClick={onAdd}
          disabled={quantity >= availability}
          className="h-7 w-7 bg-[#1A1F2C] border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-[#1A1F2C] disabled:opacity-50 disabled:hover:bg-[#1A1F2C] disabled:hover:text-[#9b87f5]"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};

export default UnitControls;