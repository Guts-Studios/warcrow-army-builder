export interface Keyword {
  name: string;
  description: string;
}

export interface Unit {
  id: string;
  name: string;
  pointsCost: number;
  faction: string;
  availability: number;
  keywords: Keyword[];
}

export interface Faction {
  id: string;
  name: string;
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