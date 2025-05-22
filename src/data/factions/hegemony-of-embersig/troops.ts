
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigTroops: Unit[] = [
  {
    id: "aggressors",
    name: "Aggressors",
    pointsCost: 40,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" }
    ],
    availability: 1,
    specialRules: ["Cancel a symbol", "Disarmed", "Shove (2)", "Displace (4)"],
    imageUrl: "/art/card/aggressors_card_en.jpg"
  },
  {
    id: "black-legion-bucklermen",
    name: "Black Legion Bucklermen",
    pointsCost: 20,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" }
    ],
    availability: 3,
    specialRules: [],
    imageUrl: "/art/card/black_legion_bucklermen_card_en.jpg"
  },
  {
    id: "bulwarks",
    name: "Bulwarks",
    pointsCost: 35,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Cover (BLK)", description: "" },
      { name: "Immovable", description: "" }
    ],
    availability: 2,
    specialRules: ["Shove (3)"],
    imageUrl: "/art/card/bulwarks_card_en.jpg"
  },
  {
    id: "black-legion-arquebusiers",
    name: "Black Legion Arquebusiers",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" },
      { name: "Cover (BLK)", description: "" }
    ],
    availability: 2,
    specialRules: ["Frightened"],
    imageUrl: "/art/card/black_legion_arquebusiers_card_en.jpg"
  },
  {
    id: "pioneers",
    name: "Pioneers",
    pointsCost: 35,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Dwarf", description: "" },
      { name: "Ghent", description: "" },
      { name: "Infantry", description: "" },
      { name: "Dispel (BLU)", description: "" },
      { name: "Scout", description: "" }
    ],
    availability: 1,
    specialRules: ["Shove (3)", "Disarmed", "Trap", "Slowed"],
    imageUrl: "/art/card/pioneers_card_en.jpg"
  },
  {
    id: "black-angels",
    name: "Black Angels",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Cavalry", description: "" },
      { name: "Human", description: "" },
      { name: "Preferred Terrain (Rugged)", description: "" }
    ],
    availability: 1,
    specialRules: ["Intimidating (2)"],
    imageUrl: "/art/card/black_angels_card_en.jpg"
  },
  {
    id: "strategos",
    name: "Strategos",
    pointsCost: 20,
    command: 1,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Join (Infantry)", description: "" }
    ],
    availability: 1,
    specialRules: [],
    imageUrl: "/art/card/strategos_card_en.jpg"
  },
  {
    id: "lady-telia",
    name: "Lady Télia",
    pointsCost: 25,
    command: 1,
    faction: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Elite", description: "" },
      { name: "Scout", description: "" },
      { name: "Join (Arquebusiers | Pioneers)", description: "" }
    ],
    availability: 1,
    specialRules: ["Frightened", "Aim", "Repeat a Die"],
    imageUrl: "/art/card/lady_telia_card_en.jpg"
  }
];
