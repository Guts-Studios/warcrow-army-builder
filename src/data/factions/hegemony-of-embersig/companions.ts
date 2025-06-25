
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigCompanions: Unit[] = [
  {
    id: "mk-os-automata",
    name: "MK-OS Automata",
    name_es: "MK-OS Automata",
    pointsCost: 0,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [],
    highCommand: false,
    availability: 3,
    companion: "trabor slepmund",
    tournamentLegal: false,
    imageUrl: "/art/card/mk-os_automata_card.jpg"
  },
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
    imageUrl: "/art/card/amelia_hellbroth_card.jpg"
  },
  {
    id: "vercana",
    name: "Vercana",
    name_es: "Vercana",
    pointsCost: 30,
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    keywords: [
      { name: "Character", description: "" },
      { name: "Human", description: "" },
      { name: "Mercenary", description: "" },
      { name: "Ambusher", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Place (5)"],
    tournamentLegal: false,
    imageUrl: "/art/card/vercana_card.jpg"
  }
];
