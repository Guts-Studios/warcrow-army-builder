
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import UnitTable from './UnitTable';
import UnitFilters from './UnitFilters';
import { normalizeFactionName } from './utils';
import { useLanguage } from '@/contexts/LanguageContext';

const UnitExplorer: React.FC = () => {
  const [units, setUnits] = useState<any[]>([]);
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  
  const fetchUnits = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('unit_data')
        .select('*')
        .order('faction')
        .order('name');
        
      if (error) {
        throw new Error(error.message);
      }
      
      // Process and normalize the data
      const processedUnits = data.map(unit => ({
        ...unit,
        faction: normalizeFactionName(unit.faction)
      }));
      
      setUnits(processedUnits);
      setFilteredUnits(processedUnits);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching units:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUnits();
  }, [language]); // Refetch when language changes
  
  const handleFilterChange = (filtered: any[]) => {
    setFilteredUnits(filtered);
  };
  
  if (error) {
    return (
      <Card className="p-6 bg-red-900/20 border-red-900/30">
        <h2 className="text-lg font-bold text-red-400 mb-2">Error Loading Units</h2>
        <p className="text-gray-300">{error}</p>
        <button 
          onClick={fetchUnits} 
          className="mt-4 px-4 py-2 bg-red-700 text-white rounded hover:bg-red-800"
        >
          Retry
        </button>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-black/50 border-warcrow-gold/30">
        <h1 className="text-2xl font-bold text-warcrow-gold mb-4">Unit Explorer</h1>
        <UnitFilters units={units} onFilterChange={handleFilterChange} isLoading={isLoading} />
      </Card>
      
      <UnitTable units={filteredUnits} isLoading={isLoading} />
    </div>
  );
};

export default UnitExplorer;
