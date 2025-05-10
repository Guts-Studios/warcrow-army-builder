
import React, { useEffect, useState } from 'react';
import { Check, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Faction } from '@/types/game';
import { cn } from '@/lib/utils';
import { factions } from '@/data/factions';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

// Fallback to our centralized faction definitions
const defaultFactions: Faction[] = factions;

interface NationSelectorProps {
  selectedFaction: Faction | null;
  onSelectFaction: (faction: Faction) => void;
  selectedFactionId?: string;
  onFactionSelect?: (factionId: string, factionName: string) => void;
}

const FactionSelector: React.FC<NationSelectorProps> = ({ 
  selectedFaction, 
  onSelectFaction,
  selectedFactionId,
  onFactionSelect
}) => {
  const [nations, setNations] = useState<Faction[]>(defaultFactions);
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
          
          console.log('Fetched factions for play:', fetchedFactions);
          setNations(fetchedFactions);
        } else {
          console.log('No factions found in database for play, using default factions');
        }
      } catch (error) {
        console.error('Failed to fetch factions for play:', error);
        // If there's an error, we'll use the default factions from the data file
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFactions();
  }, [language]);

  // Handle click based on which prop API is being used
  const handleFactionClick = (faction: Faction) => {
    if (onSelectFaction) {
      onSelectFaction(faction);
    } else if (onFactionSelect) {
      onFactionSelect(faction.id, faction.name);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="w-6 h-6 border-2 border-warcrow-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-4 w-full"
      initial="hidden"
      animate="visible"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {nations.map((faction) => (
          <motion.div
            key={faction.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleFactionClick(faction)}
            className={cn(
              "neo-card p-4 flex items-center justify-between cursor-pointer",
              (selectedFaction?.id === faction.id || selectedFactionId === faction.id) 
                ? "ring-2 ring-warcrow-gold/50" 
                : "hover:bg-warcrow-accent/50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warcrow-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-warcrow-gold" />
              </div>
              <span className="font-medium text-warcrow-text">{faction.name}</span>
            </div>
            {(selectedFaction?.id === faction.id || selectedFactionId === faction.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 bg-warcrow-gold rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-warcrow-background" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FactionSelector;
