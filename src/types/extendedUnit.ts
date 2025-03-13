
export interface ExtendedStats {
  MOV: string;
  W: number;
  WP: number | string;
  MOR: number | string;
  AVB: number;
}

export interface Switch {
  value: string;
  effect: string;
}

export interface Attack {
  members: string;
  modifier?: string;
  dice: string[];
  switches?: Switch[];
}

export interface Defense {
  modifier?: string;
  dice: string[];
  switches?: Switch[];
}

export interface Abilities {
  skill?: string;
  passive?: string;
  command?: string;
}

export interface ExtendedUnit {
  id: string;
  name: string;
  cost: number;
  stats: ExtendedStats;
  type: string;
  keywords?: string[];
  attacks: Attack[];
  defenses: Defense[];
  abilities: Abilities;
  imageUrl?: string;
}
