
import { useLanguage } from '@/contexts/LanguageContext';

export const generateCardUrl = (unitName: string, language: string = 'en'): string => {
  console.log(`Generating card URL for: ${unitName}, language: ${language}`);
  
  // Special cases mapping for units with non-standard naming
  const specialCases: Record<string, string> = {
    "Lady Télia": "lady_telia",
    "Lady Telia": "lady_telia",
    "Dragoslav Bjelogrc": "dragoslav_bjelogrc_drago_the_anvil",
    "Mk-Os Automata": "mk-os_automata",
    "MK-OS Automata": "mk-os_automata",
    "Battle-Scarred": "battle-scarred",
    "Battle Scarred": "battle-scarred",
    "Eskold The Executioner": "eskold_the_executioner",
    "Njord The Merciless": "njord_the_merciless",
    "Marhael The Refused": "marhael_the_refused",
    "Ahlwardt, Ice Bear": "ahlwardt_ice_bear",
    "Nadezhda Lazard, Champion of Embersig": "nadezhda_lazard_champion_of_embersig",
    "Dragoslav Bjelogríc, Drago the Anvil": "dragoslav_bjelogrc_drago_the_anvil",
    "Lioslaith Coic Caledhee": "lioslaith_coic_caledhee",
    "Ynyr Dara Lainn": "ynyr_dara_lainn",
    "Tattoist": "tattoist"
  };
  
  // Check for special case mapping
  let baseNameForUrl = specialCases[unitName];
  
  // If no special mapping, create URL-friendly name from unit name
  if (!baseNameForUrl) {
    baseNameForUrl = unitName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[-]/g, '_')
      .replace(/[']/g, '')
      .replace(/[^a-z0-9_]/g, '');
  }
  
  // Always use language suffixes to match your file structure
  const langSuffix = language === 'es' ? '_sp' : (language === 'fr' ? '_fr' : '_en');
  const fullUrl = `/art/card/${baseNameForUrl}_card${langSuffix}.jpg`;
  
  console.log(`Generated card URL: ${fullUrl}`);
  return fullUrl;
};

export const generatePortraitUrl = (unitName: string): string => {
  console.log(`Generating portrait URL for: ${unitName}`);
  
  // Special cases mapping for units with non-standard naming
  const specialCases: Record<string, string> = {
    "Lady Télia": "lady_telia",
    "Lady Telia": "lady_telia",
    "Dragoslav Bjelogrc": "dragoslav_bjelogrc_drago_the_anvil", 
    "Mk-Os Automata": "mk-os_automata",
    "MK-OS Automata": "mk-os_automata",
    "Battle-Scarred": "battle-scarred",
    "Battle Scarred": "battle-scarred",
    "Eskold The Executioner": "eskold_the_executioner",
    "Njord The Merciless": "njord_the_merciless",
    "Marhael The Refused": "marhael_the_refused",
    "Ahlwardt, Ice Bear": "ahlwardt_ice_bear",
    "Nadezhda Lazard, Champion of Embersig": "nadezhda_lazard_champion_of_embersig",
    "Dragoslav Bjelogríc, Drago the Anvil": "dragoslav_bjelogrc_drago_the_anvil",
    "Lioslaith Coic Caledhee": "lioslaith_coic_caledhee",
    "Ynyr Dara Lainn": "ynyr_dara_lainn",
    "Tattoist": "tattoist"
  };
  
  // Check for special case mapping
  let baseNameForUrl = specialCases[unitName];
  
  // If no special mapping, create URL-friendly name from unit name
  if (!baseNameForUrl) {
    baseNameForUrl = unitName
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[-]/g, '_')
      .replace(/[']/g, '')
      .replace(/[^a-z0-9_]/g, '');
  }
  
  // Portraits don't have language suffixes
  const fullUrl = `/art/portrait/${baseNameForUrl}_portrait.jpg`;
  
  console.log(`Generated portrait URL: ${fullUrl}`);
  return fullUrl;
};
