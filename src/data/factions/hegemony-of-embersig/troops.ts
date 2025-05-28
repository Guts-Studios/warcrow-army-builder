
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigTroops: Unit[] = [
  {
    id: "aggressors",
    name: "Aggressors",
    pointsCost: 40,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." }
    ],
    availability: 1,
    command: 0,
    specialRules: ["Cancel a symbol", "Disarmed", "Shove (2)", "Displace (4)"],
    highCommand: false,
    imageUrl: "/art/card/aggressors_card_en.jpg"
  },
  {
    id: "black-legion-bucklermen",
    name: "Black Legion Bucklermen",
    pointsCost: 20,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." }
    ],
    availability: 3,
    command: 0,
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/black_legion_bucklermen_card_en.jpg"
  },
  {
    id: "bulwarks",
    name: "Bulwarks",
    pointsCost: 35,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Cover (BLK)", description: "" },
      { name: "Immovable", description: "" }
    ],
    availability: 2,
    command: 0,
    specialRules: ["Shove (3)"],
    highCommand: false,
    imageUrl: "/art/card/bulwarks_card_en.jpg"
  },
  {
    id: "black-legion-arquebusiers",
    name: "Black Legion Arquebusiers",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Cover (BLK)", description: "" }
    ],
    availability: 2,
    command: 0,
    specialRules: ["Frightened"],
    highCommand: false,
    imageUrl: "/art/card/black_legion_arquebusiers_card_en.jpg"
  },
  {
    id: "pioneers",
    name: "Pioneers",
    pointsCost: 35,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Dwarf", description: "A sturdy and technically-minded race known for their craftsmanship and resilience." },
      { name: "Ghent", description: "Members of the Ghent faction, known for their technological prowess." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Dispel (BLU)", description: "" },
      { name: "Scout", description: "" }
    ],
    availability: 1,
    command: 0,
    specialRules: ["Shove (3)", "Disarmed", "Trap", "Slowed"],
    highCommand: false,
    imageUrl: "/art/card/pioneers_card_en.jpg"
  },
  {
    id: "black-angels",
    name: "Black Angels",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Cavalry", description: "Units that ride upon mounts such as horses or other creatures for rapid movement on the battlefield." },
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Preferred Terrain (Rugged)", description: "" }
    ],
    availability: 1,
    command: 0,
    specialRules: ["Intimidating (2)"],
    highCommand: false,
    imageUrl: "/art/card/black_angels_card_en.jpg"
  }
];
