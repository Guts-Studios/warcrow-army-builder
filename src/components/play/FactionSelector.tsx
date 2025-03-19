
import React from 'react';
import { Check, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { Faction } from '@/types/game';
import { cn } from '@/lib/utils';

const nations: Faction[] = [
  { id: 'embersig', name: 'Hegemony of Embersig' },
  { id: 'northern-tribes', name: 'Northern Tribes' },
  { id: 'syenann', name: 'The Sÿenann' },
  { id: 'scions', name: 'Scions of Yaldabaoth' }
];

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
  // Handle click based on which prop API is being used
  const handleFactionClick = (faction: Faction) => {
    if (onSelectFaction) {
      onSelectFaction(faction);
    } else if (onFactionSelect) {
      onFactionSelect(faction.id, faction.name);
    }
  };

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
                ? "ring-2 ring-primary/50" 
                : "hover:bg-secondary/50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent-foreground/70" />
              </div>
              <span className="font-medium">{faction.name}</span>
            </div>
            {(selectedFaction?.id === faction.id || selectedFactionId === faction.id) && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-6 h-6 bg-primary rounded-full flex items-center justify-center"
              >
                <Check className="w-4 h-4 text-primary-foreground" />
              </motion.div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default FactionSelector;
