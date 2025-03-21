
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
  command?: {
    normal: number;
    charge: number;
  };
}

export interface SavedList {
  id: string;
  name: string;
  faction: string;
  units: SelectedUnit[];
  created_at: string;
  user_id?: string;
  wab_id?: string; // Add WAB ID to SavedList type
}
