
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigHighCommand: Unit[] = [
  {
    id: "strategos",
    name: "Strategos",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 40,
    availability: 1,
    command: 2,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "High Command", description: "" }
    ],
    specialRules: ["Leadership"],
    highCommand: true,
    imageUrl: "/art/card/strategos_card.jpg"
  },
  {
    id: "lady-telia",
    name: "Lady Télia",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 60,
    availability: 1,
    command: 3,
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "High Command", description: "" },
      { name: "Noble", description: "" }
    ],
    specialRules: ["Inspiring", "Noble"],
    highCommand: true,
    imageUrl: "/art/card/lady_telia_card.jpg"
  }
];
