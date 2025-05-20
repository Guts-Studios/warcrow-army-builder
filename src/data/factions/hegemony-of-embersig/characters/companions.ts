
import { Unit } from "@/types/army";

export const hegemonyOfEmbersigCompanions: Unit[] = [
  {
    id: "mk-os-automata",
    name: "MK-OS Automata",
    faction: "hegemony-of-embersig",
    pointsCost: 0,
    availability: 3,
    command: 0,
    keywords: [],
    highCommand: false,
    imageUrl: "/art/card/mk-os_automata_card.jpg",
    // Note: This unit is a companion to Trabor Slepmund
    // We'll document this in comments since the Unit type doesn't support a "companion" field
  }
];
