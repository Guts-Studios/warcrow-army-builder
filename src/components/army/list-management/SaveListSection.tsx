import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save } from "lucide-react";

interface SaveListSectionProps {
  listName: string;
  onListNameChange: (name: string) => void;
  onSaveList: () => void;
}

const SaveListSection = ({ listName, onListNameChange, onSaveList }: SaveListSectionProps) => {
  return (
    <div className="flex items-center gap-4 w-full">
      <Button
        onClick={onSaveList}
        className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black whitespace-nowrap"
      >
        <Save className="h-4 w-4 mr-2" />
        Save List
      </Button>
      <Input
        placeholder="Enter list name"
        value={listName}
        onChange={(e) => onListNameChange(e.target.value)}
        className="flex-1 bg-warcrow-background text-warcrow-text border-warcrow-accent focus:border-warcrow-gold"
      />
    </div>
  );
};

export default SaveListSection;