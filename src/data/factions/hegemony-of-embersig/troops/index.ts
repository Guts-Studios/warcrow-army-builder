
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigTroops: Unit[] = [
  {
    id: "black-legion-arquebusiers",
    name: "Black Legion Arquebusiers",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 3,
    command: 0,
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Human", description: "" },
      { name: "Ranged", description: "" }
    ],
    specialRules: ["Precise"],
    imageUrl: "/art/card/black_legion_arquebusiers_card.jpg"
  },
  {
    id: "black-legion-bucklermen",
    name: "Black Legion Bucklermen",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 35,
    availability: 3,
    command: 0,
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Human", description: "" },
      { name: "Shield", description: "" }
    ],
    specialRules: ["Defensive"],
    imageUrl: "/art/card/black_legion_bucklermen_card.jpg"
  },
  {
    id: "aggressors",
    name: "Aggressors",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 30,
    availability: 3,
    command: 0,
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Aggressive"],
    imageUrl: "/art/card/aggressors_card.jpg"
  },
  {
    id: "bulwarks",
    name: "Bulwarks",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 3,
    command: 0,
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Human", description: "" },
      { name: "Heavy", description: "" }
    ],
    specialRules: ["Sturdy"],
    imageUrl: "/art/card/bulwarks_card.jpg"
  },
  {
    id: "pioneers",
    name: "Pioneers",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 3,
    command: 0,
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Human", description: "" },
      { name: "Engineer", description: "" }
    ],
    specialRules: ["Builder"],
    imageUrl: "/art/card/pioneers_card.jpg"
  },
  {
    id: "black-angels",
    name: "Black Angels",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 50,
    availability: 2,
    command: 1,
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Human", description: "" },
      { name: "Elite", description: "" }
    ],
    specialRules: ["Fearless", "Elite"],
    imageUrl: "/art/card/black_angels_card.jpg"
  }
];
