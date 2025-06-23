
import { useState, useEffect } from 'react';
import { useArmyBuilderUnits } from './useArmyData';
import { CsvUnit, parseCsvContent } from '@/utils/csvValidator';
import { normalizeFactionId } from '@/utils/unitManagement';

interface ValidationResult {
  factionId: string;
  csvUnits: CsvUnit[];
  builderUnits: any[];
  missingInBuilder: CsvUnit[];
  extraInBuilder: any[];
  isLoading: boolean;
  error: string | null;
  csvNotFound: boolean;
}

export const useCsvValidation = (factionId: string, csvFileName: string) => {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    factionId,
    csvUnits: [],
    builderUnits: [],
    missingInBuilder: [],
    extraInBuilder: [],
    isLoading: false,
    error: null,
    csvNotFound: false
  });

  // Get units from the army builder
  const { data: builderUnits = [], isLoading: isLoadingBuilder, error: builderError } = useArmyBuilderUnits(factionId);

  const validateFaction = async () => {
    setValidationResult(prev => ({ ...prev, isLoading: true, error: null, csvNotFound: false }));

    try {
      // Load CSV data
      let csvUnits: CsvUnit[] = [];
      let csvNotFound = false;
      
      try {
        const filePath = `/data/reference-csv/units/${csvFileName}`;
        const response = await fetch(filePath);
        
        if (!response.ok) {
          if (response.status === 404) {
            csvNotFound = true;
          } else {
            throw new Error(`Failed to fetch CSV: ${response.statusText}`);
          }
        } else {
          const csvContent = await response.text();
          csvUnits = await parseCsvContent(csvContent);
        }
      } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
          csvNotFound = true;
        } else {
          throw error;
        }
      }

      // Wait for builder units to load if they haven't yet
      const currentBuilderUnits = builderUnits;

      // Compare units
      const missingInBuilder = csvUnits.filter(csvUnit => 
        !currentBuilderUnits.some(builderUnit => 
          builderUnit.name.toLowerCase().trim() === csvUnit.name.toLowerCase().trim()
        )
      );

      const extraInBuilder = currentBuilderUnits.filter(builderUnit => 
        !csvUnits.some(csvUnit => 
          csvUnit.name.toLowerCase().trim() === builderUnit.name.toLowerCase().trim()
        )
      );

      console.log(`CSV Validation for ${factionId}:`, {
        csvUnits: csvUnits.length,
        builderUnits: currentBuilderUnits.length,
        missingInBuilder: missingInBuilder.length,
        extraInBuilder: extraInBuilder.length
      });

      setValidationResult({
        factionId,
        csvUnits,
        builderUnits: currentBuilderUnits,
        missingInBuilder,
        extraInBuilder,
        isLoading: false,
        error: null,
        csvNotFound
      });

    } catch (error) {
      console.error(`Error validating ${factionId}:`, error);
      setValidationResult(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  };

  return {
    validationResult,
    validateFaction,
    isBuilderLoading: isLoadingBuilder,
    builderError
  };
};
