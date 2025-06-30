
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigCharacters: Unit[] = [
  {
    id: "corporal",
    name: "Corporal",
    name_es: "Cabo",
    pointsCost: 45,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Ghent", description: "Members of the Ghent faction, known for their technological prowess." },
      { name: "Join", description: "The ability to attach to and join other units on the battlefield." }
    ],
    highCommand: false,
    availability: 0,
    command: 7,
    companion: "Infantry Human Ghent",
    imageUrl: "/art/card/corporal_card.jpg"
  },
  {
    id: "gunnery-corporal",
    name: "Gunnery Corporal",
    name_es: "Cabo Artillero",
    pointsCost: 50,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Ghent", description: "Members of the Ghent faction, known for their technological prowess." },
      { name: "Join", description: "The ability to attach to and join other units on the battlefield." }
    ],
    highCommand: false,
    availability: 0,
    command: 7,
    companion: "Infantry Human Ghent",
    imageUrl: "/art/card/gunnery-corporal_card.jpg"
  },
  {
    id: "engineer",
    name: "Engineer",
    name_es: "Ingeniero",
    pointsCost: 60,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Ghent", description: "Members of the Ghent faction, known for their technological prowess." },
      { name: "Join", description: "The ability to attach to and join other units on the battlefield." }
    ],
    highCommand: false,
    availability: 0,
    command: 6,
    companion: "Construct Ghent",
    imageUrl: "/art/card/engineer_card.jpg"
  }
];
