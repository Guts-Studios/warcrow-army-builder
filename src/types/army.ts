export interface Unit {
  id: string;
  name: string;
  pointsCost: number;
  faction: string;
}

export type SortOption = "points-asc" | "points-desc" | "name-asc" | "name-desc";

export interface SelectedUnit extends Unit {
  quantity: number;
}

export interface SavedList {
  id: string;
  name: string;
  faction: string;
  units: SelectedUnit[];
}
