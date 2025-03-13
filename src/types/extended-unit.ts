
import { Unit } from "./army";

export interface ExtendedUnitStats {
  mov: string;
  w: string | number;
  wp: string | number;
  mor: string | number;
  avb: number;
  characteristics: string[];
  members: string;
  conquest: string | number;
}

export interface DiceRoll {
  modifier?: string; // Changed from required to optional
  diceColors: string;
  switchValue?: string;
  switch1?: string;
  switchValue2?: string;
  switch2?: string;
  switchValue3?: string;
  switch3?: string;
}

export interface UnitProfile {
  range?: string;
  ranged?: DiceRoll;
  attack: DiceRoll;
  defense: DiceRoll;
}

export interface UnitAbility {
  name: string;
  description: string;
}

export interface ExtendedUnit extends Unit {
  stats: ExtendedUnitStats;
  profile1: UnitProfile;
  profile2?: UnitProfile;
  skills: UnitAbility[];
  commands: UnitAbility[];
  passives: UnitAbility[];
}
