import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, CloudUpload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SaveListSectionProps {
  listName: string;
  onListNameChange: (name: string) => void;
  onSaveList: () => void;
  selectedUnits: any[]; // Using any[] for now since we don't have the type
  selectedFaction: string;
}

const SaveListSection = ({ 
  listName, 
  onListNameChange, 
  onSaveList,
  selectedUnits,
  selectedFaction
}: SaveListSectionProps) => {
  const handleCloudSave = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("You must be logged in to use cloud save");
        return;
      }

      if (!listName.trim()) {
        toast.error("Please enter a list name before saving");
        return;
      }

      const { error } = await supabase
        .from('army_lists')
        .insert({
          name: listName,
          faction: selectedFaction,
          units: selectedUnits,
          user_id: user.id
        });

      if (error) throw error;

      toast.success("List saved to cloud successfully!");
    } catch (error) {
      console.error('Error saving to cloud:', error);
      toast.error("Failed to save list to cloud");
    }
  };

  return (
    <div className="flex items-center gap-4 w-full">
      <Button
        onClick={onSaveList}
        className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black whitespace-nowrap"
      >
        <Save className="h-4 w-4 mr-2" />
        Save List
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleCloudSave}
              className="bg-blue-500 hover:bg-blue-600 text-white whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!supabase.auth.getUser()}
            >
              <CloudUpload className="h-4 w-4 mr-2" />
              Cloud Save
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            className="bg-warcrow-background border-warcrow-accent text-warcrow-text"
            side="bottom"
          >
            Login required to use cloud features
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
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