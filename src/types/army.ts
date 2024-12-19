export interface Unit {
  id: string;
  name: string;
  pointsCost: number;
  faction: string;
  description: string;
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