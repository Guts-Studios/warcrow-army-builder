export interface Command {
  name: string;
  description: string;
}

export interface Unit {
  id: string;
  name: string;
  faction: string;
  pointsCost: number;
  availability: number;
  commands: Command[];
}

export interface Faction {
  id: string;
  name: string;
}