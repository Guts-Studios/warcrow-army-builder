
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigHighCommand: Unit[] = [
  {
    id: "amelia-hellbroth",
    name: "Amelia Hellbroth",
    name_es: "Amelia Hellbroth",
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
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Vulnerable", "Disarmed"],
    tournamentLegal: false,
    imageUrl: "/art/card/amelia-hellbroth_card.jpg"
  },
  {
    id: "dragoslav-bjelogric-drago-the-anvil",
    name: "Dragoslav Bjelogríc, Drago the Anvil",
    name_es: "Dragoslav Bjelogríc, Drago El Yunque",
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
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Vulnerable", "Elite", "Bloodlust (Varank)", "Repeat a Die"],
    tournamentLegal: true,
    imageUrl: "/art/card/dragoslav-bjelogric-drago-the-anvil_card.jpg"
  },
  {
    id: "hetman",
    name: "Hetman",
    name_es: "Hetman",
    pointsCost: 25,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Human", description: "" },
      { name: "Join (Infantry)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: [],
    tournamentLegal: true,
    imageUrl: "/art/card/hetman_card.jpg"
  },
  {
    id: "mounted-hetman",
    name: "Mounted Hetman",
    name_es: "Hetman Montado",
    pointsCost: 40,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Cavalry", description: "" },
      { name: "Character", description: "" },
      { name: "High Command", description: "" },
      { name: "Human", description: "" },
      { name: "Join (Cavalry)", description: "" }
    ],
    highCommand: true,
    availability: 1,
    command: 2,
    specialRules: [],
    tournamentLegal: true,
    imageUrl: "/art/card/mounted-hetman_card.jpg"
  }
];
