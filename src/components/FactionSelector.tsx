
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { factions } from "@/data/factions";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface Faction {
  id: string;
  name: string;
}

interface FactionSelectorProps {
  selectedFaction: string;
  onFactionChange: (faction: string) => void;
}

const FactionSelector = ({ selectedFaction, onFactionChange }: FactionSelectorProps) => {
  const [availableFactions, setAvailableFactions] = useState<Faction[]>(factions);
  const [isLoading, setIsLoading] = useState(false);
  const { language } = useLanguage();
  
  useEffect(() => {
    // Try to fetch factions from Supabase
    const fetchFactions = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('factions')
          .select('*')
          .order('name');
          
        if (error) {
          console.error('Error fetching factions in dropdown:', error);
          toast.error('Failed to load factions');
          return; // Use default factions if there's an error
        }
        
        if (data && data.length > 0) {
          // Transform to expected Faction type
          const fetchedFactions = data.map((faction: any) => ({
            id: faction.id,
            name: language === 'es' ? faction.name_es || faction.name :
                 language === 'fr' ? faction.name_fr || faction.name : 
                 faction.name
          }));
          
          console.log('Fetched factions for dropdown:', fetchedFactions);
          setAvailableFactions(fetchedFactions);
        } else {
          console.log('No factions found in database for dropdown, using default factions');
        }
      } catch (error) {
        console.error('Failed to fetch factions for dropdown:', error);
        // If there's an error, we'll use the default factions from the data file
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFactions();
  }, [language]);

  return (
    <div className="w-full max-w-xs mb-4 md:mb-8">
      <Select value={selectedFaction} onValueChange={onFactionChange}>
        <SelectTrigger className="w-full bg-warcrow-accent text-warcrow-text border-warcrow-gold">
          <SelectValue placeholder="Select a faction">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {selectedFaction ? availableFactions.find(f => f.id === selectedFaction)?.name || "Select a faction" : "Select a faction"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="bg-warcrow-accent border-warcrow-gold max-h-[300px] overflow-y-auto">
          {isLoading ? (
            <SelectItem value="loading" disabled className="text-warcrow-text/50">
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading factions...
              </div>
            </SelectItem>
          ) : availableFactions.length > 0 ? (
            availableFactions.map((faction) => (
              <SelectItem
                key={faction.id}
                value={faction.id}
                className="text-warcrow-text hover:bg-warcrow-gold hover:text-warcrow-background cursor-pointer"
              >
                {faction.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled className="text-warcrow-text/50">
              No factions available
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FactionSelector;
