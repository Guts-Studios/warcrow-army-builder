
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigHighCommand: Unit[] = [
  // Hetman
  {
    id: "hetman",
    name: "Hetman",
    faction: "hegemony-of-embersig",
    pointsCost: 25,
    availability: 1,
    highCommand: true,
    command: 3,
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Join (Infantry)"],
    imageUrl: "/art/card/hetman_card.jpg"
  },
  // Dragoslav Bjelogríc, Drago the Anvil
  {
    id: "dragoslav_bjelogrc_drago_the_anvil",
    name: "Dragoslav Bjelogríc, Drago the Anvil",
    faction: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    highCommand: true,
    command: 3,
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Bloodlust (Varank)", "Elite", "Join (Bucklermen | Bulwark)"],
    imageUrl: "/art/card/dragoslav_bjelogrc_drago_the_anvil_card.jpg"
  },
  // Amelia Hellbroth
  {
    id: "amelia_hellbroth",
    name: "Amelia Hellbroth",
    faction: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    highCommand: true,
    command: 3,
    keywords: [
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "High Command", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Elite", "Join (Infantry)"],
    imageUrl: "/art/card/amelia_hellbroth_card.jpg"
  },
  // Nadezhda Lazard, Champion of Embersig - Update the points cost to match CSV data
  {
    id: "nadezhda_lazard_champion_of_embersig",
    name: "Nadezhda Lazard, Champion of Embersig",
    faction: "hegemony-of-embersig",
    pointsCost: 30, // Updated from 275 to 30 to match the reference CSV data
    availability: 1,
    highCommand: true,
    command: 2,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" }
    ],
    specialRules: ["Join (Infantry)"],
    imageUrl: "/art/card/nadezhda_lazard_champion_of_embersig_card.jpg"
  }
];
