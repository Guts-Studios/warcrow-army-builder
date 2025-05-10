
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { factions } from "@/data/factions";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { language } = useLanguage();
  
  useEffect(() => {
    // Try to fetch factions from Supabase
    const fetchFactions = async () => {
      try {
        const { data, error } = await supabase
          .from('factions')
          .select('*')
          .order('name');
          
        if (error) {
          console.error('Error fetching factions:', error);
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
          setAvailableFactions(fetchedFactions);
        }
      } catch (error) {
        console.error('Failed to fetch factions:', error);
        // If there's an error, we'll use the default factions from the data file
      }
    };
    
    fetchFactions();
  }, [language]);

  return (
    <div className="w-full max-w-xs mb-4 md:mb-8">
      <Select value={selectedFaction} onValueChange={onFactionChange}>
        <SelectTrigger className="w-full bg-warcrow-accent text-warcrow-text border-warcrow-gold">
          <SelectValue placeholder="Select a faction" />
        </SelectTrigger>
        <SelectContent className="bg-warcrow-accent border-warcrow-gold">
          {availableFactions.map((faction) => (
            <SelectItem
              key={faction.id}
              value={faction.id}
              className="text-warcrow-text hover:bg-warcrow-gold hover:text-warcrow-background cursor-pointer"
            >
              {faction.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FactionSelector;
