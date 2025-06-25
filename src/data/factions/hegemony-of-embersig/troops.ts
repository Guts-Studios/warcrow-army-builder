
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigTroops: Unit[] = [
  {
    id: "aggressors",
    name: "Aggressors",
    name_es: "Acometedores",
    pointsCost: 40,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Cancel a symbol", "Disarmed", "Shove (2)", "Displace (4)"],
    tournamentLegal: true,
    imageUrl: "/art/card/aggressors_card.jpg"
  },
  {
    id: "black-angels",
    name: "Black Angels",
    name_es: "Angeles Negros",
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
    specialRules: ["Intimidating (2)"],
    tournamentLegal: true,
    imageUrl: "/art/card/black_angels_card.jpg"
  },
  {
    id: "black-legion-arquebusiers",
    name: "Black Legion Arquebusiers",
    name_es: "Arcabuceros De La Legion Negra",
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
    specialRules: ["Frightened"],
    tournamentLegal: true,
    imageUrl: "/art/card/black_legion_arquebusiers_card.jpg"
  },
  {
    id: "black-legion-bucklermen",
    name: "Black Legion Bucklermen",
    name_es: "Rodeleros De La Legion Negra",
    pointsCost: 20,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "" },
      { name: "Infantry", description: "" }
    ],
    highCommand: false,
    availability: 3,
    tournamentLegal: true,
    imageUrl: "/art/card/black_legion_bucklermen_card.jpg"
  },
  {
    id: "bulwarks",
    name: "Bulwarks",
    name_es: "Baluartes",
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
    specialRules: ["Shove (3)"],
    tournamentLegal: true,
    imageUrl: "/art/card/bulwarks_card.jpg"
  },
  {
    id: "pioneers",
    name: "Pioneers",
    name_es: "Pioneros",
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
    specialRules: ["Shove (3)", "Disarmed", "Trap", "Slowed"],
    tournamentLegal: true,
    imageUrl: "/art/card/pioneers_card.jpg"
  }
];
