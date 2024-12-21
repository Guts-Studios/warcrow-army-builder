export interface Keyword {
  name: string;
  description: string;
}

export interface Unit {
  id: string;
  name: string;
  pointsCost: number;
  faction: string;
  keywords: Keyword[];
  highCommand: boolean;
  availability: number;
  imageUrl?: string;
}

export interface SelectedUnit extends Unit {
  quantity: number;
}

export interface SavedList {
  id: string;
  name: string;
  faction: string;
  units: SelectedUnit[];
}

export interface Faction {
  id: string;
  name: string;
}

export type SortOption = "points-asc" | "points-desc" | "name-asc" | "name-desc";