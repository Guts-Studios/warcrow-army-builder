export interface Unit {
  id: string;
  name: string;
  name_es?: string; // Spanish name
  name_fr?: string; // French name
  faction: string;
  faction_id?: string;
  pointsCost: number;
  availability: number;
  command?: number;
  keywords: Array<{ name: string; description?: string } | string>;
  specialRules?: string[];
  highCommand?: boolean;
  imageUrl?: string;
  companion?: string; // ID of the unit this is a companion to
  type?: string; // Unit type from CSV (troop, character, etc.)
  tournamentLegal?: boolean; // Tournament legal status
  // CSV mapping fields
  characteristics?: string[]; // For CSV characteristics that aren't keywords
  csvKeywords?: string[]; // Raw CSV keywords before processing
}

export interface SelectedUnit extends Unit {
  quantity: number;
}

export interface SavedList {
  id: string;
  name: string;
  faction: string;
  units: SelectedUnit[];
  user_id?: string;
  created_at: string;
  wab_id?: string;
}

export interface Faction {
  id: string;
  name: string;
  name_es?: string;
  name_fr?: string;
}

export interface ApiUnit {
  id: string;
  name: string;
  name_es?: string;
  name_fr?: string;
  faction: string;
  faction_id?: string;
  faction_display?: string;
  points: number;
  keywords: string[];
  special_rules: string[];
  characteristics: {
    availability: number;
    command: number;
    highCommand: boolean;
    imageUrl?: string;
  };
  type: string;
}

export interface Keyword {
  name: string;
  description?: string;
}

export type SortOption = "points-asc" | "points-desc" | "name-asc" | "name-desc";

// CSV Processing Types
export interface CsvUnitRow {
  'Unit Name'?: string; // For backwards compatibility
  'Unit Name EN': string;
  'Unit Name SP'?: string;
  'Unit Type': string;
  Faction: string;
  'Faction ID'?: string;
  'faction_id'?: string;
  Command: string;
  AVB: string;
  Characteristics: string;
  Keywords: string;
  'High Command': string;
  'Points Cost': string;
  'Special Rules': string;
  'Tournament Legal'?: string;
  Companion?: string;
}

export interface ProcessedCsvUnit {
  id: string;
  name: string;
  name_es?: string;
  faction: string;
  faction_id?: string;
  type: string;
  pointsCost: number;
  availability: number;
  command?: number;
  characteristics: string[];
  keywords: string[];
  highCommand: boolean;
  specialRules: string[];
  companion?: string;
  tournamentLegal?: boolean;
}
