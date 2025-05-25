
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigTroops: Unit[] = [
  // Aggressors
  {
    id: "aggressors",
    name: "Aggressors",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" }
    ],
    specialRules: ["Cancel a symbol", "Disarmed", "Shove (2)", "Displace (4)"],
    imageUrl: "/art/card/aggressors_card.jpg"
  },
  // Black Legion Bucklermen
  {
    id: "black_legion_bucklermen",
    name: "Black Legion Bucklermen",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 20,
    availability: 3,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" }
    ],
    specialRules: [],
    imageUrl: "/art/card/black_legion_bucklermen_card.jpg"
  },
  // Bulwarks
  {
    id: "bulwarks",
    name: "Bulwarks",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 2,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" }
    ],
    specialRules: ["Cover (BLK)", "Immovable", "Shove (3)"],
    imageUrl: "/art/card/bulwarks_card.jpg"
  },
  // Black Legion Arquebusiers
  {
    id: "black_legion_arquebusiers",
    name: "Black Legion Arquebusiers",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 2,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" }
    ],
    specialRules: ["Cover (BLK)", "Frightened"],
    imageUrl: "/art/card/black_legion_arquebusiers_card.jpg"
  },
  // Pioneers
  {
    id: "pioneers",
    name: "Pioneers",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 1,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Dwarf", description: "" },
      { name: "Ghent", description: "" },
      { name: "Infantry", description: "" }
    ],
    specialRules: ["Dispel (BLU)", "Scout", "Shove (3)", "Disarmed", "Trap", "Slowed"],
    imageUrl: "/art/card/pioneers_card.jpg"
  },
  // Black Angels
  {
    id: "black_angels",
    name: "Black Angels",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 1,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Cavalry", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Preferred Terrain (Rugged)", "Intimidating (2)"],
    imageUrl: "/art/card/black_angels_card.jpg"
  }
];
