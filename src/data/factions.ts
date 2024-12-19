import { Faction, Unit } from "../types/army";

export const factions: Faction[] = [
  { id: "imperium", name: "Imperium" },
  { id: "orks", name: "Orks" },
];

export const units: Unit[] = [
  {
    id: "space-marine",
    name: "Space Marine",
    faction: "imperium",
    pointsCost: 25,
    availability: 3,
    keywords: [
      { name: "Charge", description: "Move into combat" },
      { name: "Shoot", description: "Fire ranged weapons" },
    ],
  },
  {
    id: "terminator",
    name: "Terminator",
    faction: "imperium",
    pointsCost: 40,
    availability: 2,
    keywords: [
      { name: "Deep Strike", description: "Deploy anywhere" },
      { name: "Shoot", description: "Fire ranged weapons" },
    ],
  },
  {
    id: "ork-boy",
    name: "Ork Boy",
    faction: "orks",
    pointsCost: 15,
    availability: 4,
    keywords: [
      { name: "Waaagh!", description: "Charge into battle" },
      { name: "Shoot", description: "Fire crude weapons" },
    ],
  },
  {
    id: "nob",
    name: "Nob",
    faction: "orks",
    pointsCost: 30,
    availability: 2,
    keywords: [
      { name: "Lead da Boyz", description: "Command nearby Orks" },
      { name: "Krump", description: "Powerful melee attack" },
    ],
  },
];