import { Button } from "@/components/ui/button";
import { FilePlus } from "lucide-react";

interface NewListButtonProps {
  onNewList: () => void;
}

const NewListButton = ({ onNewList }: NewListButtonProps) => {
  return (
    <Button
      onClick={onNewList}
      variant="outline"
      className="w-full bg-[#1A1F2C] border-[#9b87f5] text-[#9b87f5] hover:bg-[#9b87f5] hover:text-[#1A1F2C] transition-colors"
    >
      <FilePlus className="h-4 w-4 mr-2" />
      New List
    </Button>
  );
};

export default NewListButton;