
export interface Player {
  name: string;
  faction: string;
  points: number;
  objectivePoints: number;
  score?: number;
}

export interface Mission {
  id: string;
  title: string;
  details: string;
}
