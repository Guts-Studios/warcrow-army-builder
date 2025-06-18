
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigTroops: Unit[] = [
  {
    id: "aggressors",
    name: "Aggressors",
    pointsCost: 40,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Cancel a symbol", "Disarmed", "Shove (2)", "Displace (4)"],
    imageUrl: "/art/card/aggressors_card.jpg"
  },
  {
    id: "black-legion-bucklermen",
    name: "Black Legion Bucklermen",
    pointsCost: 20,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" }
    ],
    highCommand: false,
    availability: 3,
    command: 0,
    imageUrl: "/art/card/black-legion-bucklermen_card.jpg"
  },
  {
    id: "bulwarks",
    name: "Bulwarks",
    pointsCost: 35,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Cover (BLK)", description: "" },
      { name: "Immovable", description: "" }
    ],
    highCommand: false,
    availability: 2,
    command: 0,
    specialRules: ["Shove (3)"],
    imageUrl: "/art/card/bulwarks_card.jpg"
  },
  {
    id: "black-legion-arquebusiers",
    name: "Black Legion Arquebusiers",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Cover (BLK)", description: "" }
    ],
    highCommand: false,
    availability: 2,
    command: 0,
    specialRules: ["Frightened"],
    imageUrl: "/art/card/black-legion-arquebusiers_card.jpg"
  },
  {
    id: "pioneers",
    name: "Pioneers",
    pointsCost: 35,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Dwarf", description: "" },
      { name: "Ghent", description: "" },
      { name: "Infantry", description: "" },
      { name: "Dispel (BLU)", description: "" },
      { name: "Scout", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Shove (3)", "Disarmed", "Trap", "Slowed"],
    imageUrl: "/art/card/pioneers_card.jpg"
  },
  {
    id: "black-angels",
    name: "Black Angels",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Cavalry", description: "" },
      { name: "Human", description: "" },
      { name: "Preferred Terrain (Rugged)", description: "" }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Intimidating (2)"],
    imageUrl: "/art/card/black-angels_card.jpg"
  }
];
