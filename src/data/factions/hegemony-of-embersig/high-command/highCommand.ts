
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigHighCommand: Unit[] = [
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
    highCommand: true,
    availability: 1,
    command: 3,
    imageUrl: "/art/card/hetman_card.jpg"
  },
  {
    id: "mounted-hetman",
    name: "Mounted Hetman",
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
    imageUrl: "/art/card/mounted_hetman_card.jpg"
  },
  {
    id: "dragoslav-bjelogric-drago-the-anvil",
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
    highCommand: true,
    availability: 1,
    command: 3,
    specialRules: ["Vulnerable", "Elite", "Bloodlust (Varank)", "Repeat a Die"],
    imageUrl: "/art/card/dragoslav-bjelogric-drago-the-anvil_card.jpg"
  }
];

// Debug: Log the units when this module loads
console.log("[Hegemony High Command] Loaded units:", hegemonyOfEmbersigHighCommand.map(u => u.name));
