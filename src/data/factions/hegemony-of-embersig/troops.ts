
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigTroops: Unit[] = [
  {
    id: "black-legion-bucklermen",
    name: "Black Legion Bucklermen",
    name_es: "Bucklermen de la Legión Negra",
    pointsCost: 95,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Ghent", description: "Members of the Ghent faction, known for their technological prowess." }
    ],
    highCommand: false,
    availability: 2,
    command: 6,
    imageUrl: "/art/card/black-legion-bucklermen_card.jpg"
  },
  {
    id: "black-legion-arquebusiers",
    name: "Black Legion Arquebusiers",
    name_es: "Arcabuceros de la Legión Negra",
    pointsCost: 115,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Ghent", description: "Members of the Ghent faction, known for their technological prowess." }
    ],
    highCommand: false,
    availability: 2,
    command: 6,
    imageUrl: "/art/card/black-legion-arquebusiers_card.jpg"
  },
  {
    id: "mk-os-automata",
    name: "Mk-Os Automata",
    name_es: "Autómata MK-OS",
    pointsCost: 125,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Construct", description: "An artificial being or mechanical creation." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Ghent", description: "Members of the Ghent faction, known for their technological prowess." },
      { name: "Fearless", description: "" }
    ],
    highCommand: false,
    availability: 1,
    imageUrl: "/art/card/mk-os-automata_card.jpg"
  }
];
