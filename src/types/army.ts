export interface Unit {
  id: string;
  name: string;
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
