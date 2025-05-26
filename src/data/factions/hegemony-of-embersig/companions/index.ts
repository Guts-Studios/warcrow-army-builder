
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigCompanions: Unit[] = [
  // MK-OS Automata - Companion to Trabor Slepmund
  {
    id: "mk-os-automata",
    name: "MK-OS Automata",
    faction: "hegemony-of-embersig",
    faction_id: "hegemony-of-embersig",
    pointsCost: 0,
    availability: 3,
    highCommand: false,
    command: 0,
    keywords: [
      { name: "Construct", description: "" },
      { name: "Companion", description: "" }
    ],
    specialRules: [],
    companion: "trabor_slepmund",
    imageUrl: "/art/card/mk-os_automata_card.jpg"
  }
];
