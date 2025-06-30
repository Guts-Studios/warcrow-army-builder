
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigCompanions: Unit[] = [
  {
    id: "aide",
    name: "Aide",
    name_es: "Ayudante",
    pointsCost: 15,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Companion", description: "A unit that must be assigned to a specific character or unit type." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Ghent", description: "Members of the Ghent faction, known for their technological prowess." }
    ],
    highCommand: false,
    availability: 0,
    type: "companion",
    imageUrl: "/art/card/aide_card.jpg"
  }
];
