
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigHighCommand: Unit[] = [
  {
    id: "amelia_hellbroth",
    name: "Amelia Hellbroth",
    pointsCost: 40,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "High Command", description: "" },
      { name: "Human", description: "" },
      { name: "Elite", description: "" },
      { name: "Join (Infantry)", description: "" }
    ],
    availability: 1,
    command: 3,
    specialRules: ["Vulnerable", "Disarmed"],
    highCommand: true,
    imageUrl: "/art/card/amelia_hellbroth_card_en.jpg"
  },
  {
    id: "dragoslav_bjelogric_drago_the_anvil",
    name: "Dragoslav Bjelogríc, Drago the Anvil",
    pointsCost: 40,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Human", description: "" },
      { name: "Bloodlust (Varank)", description: "" },
      { name: "Elite", description: "" },
      { name: "Join (Bucklermen)", description: "" },
      { name: "Join (Bulwark)", description: "" }
    ],
    availability: 1,
    command: 3,
    specialRules: ["Vulnerable", "Elite", "Bloodlust (Varank)", "Repeat a Die"],
    highCommand: true,
    imageUrl: "/art/card/dragoslav_bjelogrc_drago_the_anvil_card_en.jpg"
  },
  {
    id: "hetman",
    name: "Hetman",
    pointsCost: 25,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Human", description: "" },
      { name: "Join (Infantry)", description: "" }
    ],
    availability: 1,
    command: 3,
    specialRules: [],
    highCommand: true,
    imageUrl: "/art/card/hetman_card_en.jpg"
  }
];
