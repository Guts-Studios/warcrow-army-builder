
export interface SelectedUnit {
  id: string;
  name: string;
  pointsCost: number;
  quantity: number;
  faction?: string;
  keywords?: string[];
  highCommand?: boolean;
  availability: number;
  imageUrl?: string;
  specialRules?: string[];
  command?: number;
}

export interface SavedList {
  id: string;
  name: string;
  faction: string;
  units: SelectedUnit[];
  created_at: string;
  user_id?: string;
  wab_id?: string;
}

export interface Unit {
  id: string;
  name: string;
  faction: string;
  pointsCost: number;
  availability: number;
  command?: number;
  keywords: Keyword[];
  specialRules?: string[];
  highCommand?: boolean;
  imageUrl?: string;
}

export interface Keyword {
  name: string;
  description?: string;
}

export interface Faction {
  id: string;
  name: string;
}

export type SortOption = "points-asc" | "points-desc" | "name-asc" | "name-desc";
