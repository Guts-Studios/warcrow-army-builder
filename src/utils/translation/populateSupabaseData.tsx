
import { supabase } from "@/integrations/supabase/client";
import { factions, units } from "@/data/factions";
import { keywordDefinitions } from "@/data/keywordDefinitions";
import { specialRuleDefinitions } from "@/data/specialRuleDefinitions";
import { characteristicDefinitions } from "@/data/characteristicDefinitions";
import { toast } from "sonner";

/**
 * Populate the Supabase database with existing data from the application
 */
export const populateSupabaseData = async () => {
  // Track progress
  const totalSteps = 4;
  let currentStep = 0;

  try {
    // Step 1: Upload keywords
    currentStep++;
    await populateKeywords();
    toast.success(`Step ${currentStep}/${totalSteps}: Keywords uploaded`);

    // Step 2: Upload special rules
    currentStep++;
    await populateSpecialRules();
    toast.success(`Step ${currentStep}/${totalSteps}: Special rules uploaded`);

    // Step 3: Upload characteristics
    currentStep++;
    await populateCharacteristics();
    toast.success(`Step ${currentStep}/${totalSteps}: Characteristics uploaded`);

    // Step 4: Upload unit data
    currentStep++;
    await populateUnitData();
    toast.success(`Step ${currentStep}/${totalSteps}: Unit data uploaded`);

    toast.success("All data has been successfully uploaded to Supabase");
    return true;
  } catch (error: any) {
    console.error("Error populating Supabase data:", error);
    toast.error(`Error during step ${currentStep}/${totalSteps}: ${error.message}`);
    return false;
  }
};

/**
 * Upload existing keyword definitions to Supabase
 */
const populateKeywords = async () => {
  const keywords = Object.entries(keywordDefinitions).map(([name, description]) => ({
    name,
    description,
  }));

  // Process in batches to avoid overloading the API
  const batchSize = 20;
  for (let i = 0; i < keywords.length; i += batchSize) {
    const batch = keywords.slice(i, i + batchSize);
    const { error } = await supabase.from("unit_keywords").upsert(
      batch,
      { onConflict: "name" }
    );

    if (error) throw error;
    
    // Small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return true;
};

/**
 * Upload existing special rule definitions to Supabase
 */
const populateSpecialRules = async () => {
  const specialRules = Object.entries(specialRuleDefinitions).map(([name, description]) => ({
    name,
    description,
  }));

  // Process in batches
  const batchSize = 20;
  for (let i = 0; i < specialRules.length; i += batchSize) {
    const batch = specialRules.slice(i, i + batchSize);
    const { error } = await supabase.from("special_rules").upsert(
      batch,
      { onConflict: "name" }
    );

    if (error) throw error;
    
    // Small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return true;
};

/**
 * Upload existing characteristic definitions to Supabase
 */
const populateCharacteristics = async () => {
  const characteristics = Object.entries(characteristicDefinitions).map(([name, description]) => ({
    name,
    description,
  }));

  // Process in batches
  const batchSize = 20;
  for (let i = 0; i < characteristics.length; i += batchSize) {
    const batch = characteristics.slice(i, i + batchSize);
    const { error } = await supabase.from("unit_characteristics").upsert(
      batch,
      { onConflict: "name" }
    );

    if (error) throw error;
    
    // Small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return true;
};

/**
 * Upload existing unit data to Supabase
 */
const populateUnitData = async () => {
  // Convert units to the format expected by the unit_data table
  const unitData = units.map(unit => {
    // Extract keywords as strings
    const keywords = unit.keywords.map(kw => 
      typeof kw === 'string' ? kw : kw.name
    );

    return {
      id: unit.id,
      name: unit.name,
      description: "", // No description in the current data model
      faction: unit.faction,
      type: getUnitType(unit.keywords),
      points: unit.pointsCost,
      characteristics: { 
        availability: unit.availability,
        command: unit.command || null,
        highCommand: unit.highCommand || false
      },
      keywords,
      special_rules: unit.specialRules || [],
      options: []
    };
  });

  // Process in batches
  const batchSize = 10;
  for (let i = 0; i < unitData.length; i += batchSize) {
    const batch = unitData.slice(i, i + batchSize);
    const { error } = await supabase.from("unit_data").upsert(
      batch,
      { onConflict: "id" }
    );

    if (error) throw error;
    
    // Small delay to prevent rate limiting
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  return true;
};

/**
 * Determine the unit type based on keywords
 */
const getUnitType = (keywords: any[]): string => {
  const keywordNames = keywords.map(k => typeof k === 'string' ? k : k.name);
  
  if (keywordNames.includes("Character")) {
    return "Character";
  } else if (keywordNames.some(k => ["Cavalry", "Mounted"].includes(k))) {
    return "Cavalry";
  } else if (keywordNames.includes("Infantry")) {
    return "Infantry";
  } else if (keywordNames.includes("Beast")) {
    return "Beast";
  } else if (keywordNames.includes("Construct")) {
    return "Construct";
  }
  
  return "Infantry"; // Default type
};
