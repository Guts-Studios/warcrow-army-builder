
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Save, CloudUpload, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { useProfileSession } from "@/hooks/useProfileSession";

interface SaveListSectionProps {
  listName: string;
  onListNameChange: (name: string) => void;
  onSaveList: () => void;
  selectedUnits: any[];
  selectedFaction: string;
  refreshSavedLists?: () => void;
}

const SaveListSection = ({ 
  listName, 
  onListNameChange, 
  onSaveList,
  selectedUnits,
  selectedFaction,
  refreshSavedLists
}: SaveListSectionProps) => {
  const { t } = useLanguage();
  const { isAuthenticated, userId } = useProfileSession();
  const [isSaving, setIsSaving] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  
  // Check authentication state when component mounts
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setAuthChecked(true);
      } catch (error) {
        console.error("Error checking auth status:", error);
        setAuthChecked(true);
      }
    };
    
    checkAuth();
  }, []);
  
  const handleLocalSave = () => {
    console.log("[SaveListSection] Local save button clicked");
    // Only call the local save function passed from parent
    onSaveList();
  };
  
  const handleCloudSave = async () => {
    console.log("[SaveListSection] Cloud save button clicked");
    
    if (!isAuthenticated) {
      toast.error("You must be logged in to use cloud save");
      return;
    }

    if (!listName.trim()) {
      toast.error("Please enter a list name before saving");
      return;
    }
    
    if (selectedUnits.length === 0) {
      toast.error("Cannot save an empty list. Add some units first.");
      return;
    }
    
    try {
      setIsSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Authentication error. Please try logging in again.");
        return;
      }

      console.log("Cloud save - Auth user:", user.id);

      // First, fetch the user's profile to get their WAB ID
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('wab_id')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        toast.error("Failed to retrieve your WAB ID");
        return;
      }

      const wab_id = profileData?.wab_id;
      
      if (!wab_id) {
        toast.error("Your profile doesn't have a WAB ID assigned");
        return;
      }

      console.log(`Saving list with WAB ID: ${wab_id}`);
      
      // Insert the data, handling possible errors
      const { data, error } = await supabase
        .from('army_lists')
        .insert({
          name: listName,
          faction: selectedFaction,
          units: selectedUnits,
          user_id: user.id,
          wab_id: wab_id
        })
        .select();

      if (error) {
        console.error('Error saving to cloud:', error);
        throw error;
      }

      console.log("List saved successfully:", data);
      toast.success("List saved to cloud successfully!");
      
      // Call the refreshSavedLists function if it exists to update the saved lists
      if (refreshSavedLists) {
        setTimeout(() => {
          refreshSavedLists();
        }, 500);
      }
    } catch (error) {
      console.error('Error saving to cloud:', error);
      toast.error("Failed to save list to cloud");
    } finally {
      setIsSaving(false);
    }
  };

  // Check if any units are not tournament legal
  const hasNonTournamentLegalUnits = selectedUnits.some(unit => unit.tournamentLegal === false);

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full">
      {hasNonTournamentLegalUnits && (
        <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-2 flex items-center gap-2 order-1">
          <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <p className="text-amber-200 text-xs">
            <strong>Warning:</strong> This list contains units not tournament legal.
          </p>
        </div>
      )}
      
      <Input
        placeholder={t('enterListName')}
        value={listName}
        onChange={(e) => onListNameChange(e.target.value)}
        className="flex-1 bg-warcrow-background text-warcrow-text border-warcrow-accent focus:border-warcrow-gold order-2 md:order-3"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleLocalSave}
              className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black whitespace-nowrap order-3 md:order-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {t('saveListLocally')}
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            className="bg-warcrow-background border-warcrow-accent text-warcrow-text"
            side="bottom"
          >
            Save list to your browser's local storage
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleCloudSave}
              disabled={!isAuthenticated || isSaving}
              className={`whitespace-nowrap order-4 md:order-2 ${
                !isAuthenticated || isSaving 
                  ? "bg-gray-500 text-gray-300 hover:bg-gray-500 cursor-not-allowed opacity-60" 
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              <CloudUpload className="h-4 w-4 mr-2" />
              {isSaving ? 'Saving...' : t('cloudSave')}
            </Button>
          </TooltipTrigger>
          <TooltipContent 
            className="bg-warcrow-background border-warcrow-accent text-warcrow-text"
            side="bottom"
          >
            {isAuthenticated ? 'Save list to the cloud' : 'Login required to use cloud features'}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SaveListSection;
