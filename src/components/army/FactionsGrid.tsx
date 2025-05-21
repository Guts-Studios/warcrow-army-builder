
import React from 'react';
import { Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFactions } from '@/components/stats/unit-explorer/useUnitData';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface FactionsGridProps {
  onSelect: (factionId: string) => void;
}

export const FactionsGrid: React.FC<FactionsGridProps> = ({ onSelect }) => {
  const { language } = useLanguage();
  const { 
    data: factions = [], 
    isLoading, 
    isError
  } = useFactions(language);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="w-6 h-6 border-2 border-warcrow-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-700/30 rounded-md text-center">
        <p className="text-red-400">Error loading factions</p>
      </div>
    );
  }

  if (factions.length === 0) {
    toast.info('No factions found. Using default factions.');
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
      {factions.map((faction) => (
        <motion.div
          key={faction.id}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="bg-warcrow-accent/30 border border-warcrow-gold/30 rounded-lg p-4 cursor-pointer hover:bg-warcrow-accent/50"
          onClick={() => onSelect(faction.id)}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-warcrow-accent flex items-center justify-center">
              <Shield className="w-5 h-5 text-warcrow-gold" />
            </div>
            <span className="font-medium text-warcrow-text">{faction.name}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
