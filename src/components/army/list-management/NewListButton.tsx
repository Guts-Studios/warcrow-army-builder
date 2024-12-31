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
      className="w-full bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background transition-colors"
    >
      <FilePlus className="h-4 w-4 mr-2" />
      New List
    </Button>
  );
};

export default NewListButton;