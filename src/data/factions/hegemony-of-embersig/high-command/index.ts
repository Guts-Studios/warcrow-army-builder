
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigHighCommand: Unit[] = [
  {
    id: "grand-captain",
    name: "Grand Captain",
    name_es: "Gran Capitán",
    pointsCost: 110,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Ghent", description: "Members of the Ghent faction, known for their technological prowess." },
      { name: "High Command", description: "Characters with this characteristic automatically become your commander when included in your company." },
      { name: "Join", description: "The ability to attach to and join other units on the battlefield." }
    ],
    highCommand: true,
    availability: 0,
    command: 8,
    companion: "Infantry Human Ghent",
    imageUrl: "/art/card/grand-captain_card.jpg"
  },
  {
    id: "nadezhda-lazard-champion-of-embersig",
    name: "Nadezhda Lazard, Champion of Embersig",
    name_es: "Nadezhda Lazard, Campeona de Embersig",
    pointsCost: 135,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." },
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Infantry", description: "Ground-based troops that form the backbone of most armies." },
      { name: "Ghent", description: "Members of the Ghent faction, known for their technological prowess." },
      { name: "High Command", description: "Characters with this characteristic automatically become your commander when included in your company." },
      { name: "Join", description: "The ability to attach to and join other units on the battlefield." }
    ],
    highCommand: true,
    availability: 0,
    command: 9,
    specialRules: ["Inspiring Presence", "Tactical Genius"],
    companion: "Infantry Human Ghent",
    tournamentLegal: true,
    imageUrl: "/art/card/nadezhda-lazard-champion-of-embersig_card.jpg"
  }
];
