import { Unit } from "@/types/army";

export const puppeteer: Unit = {
  id: "puppeteer",
  name: "Puppeteer",
  name_es: "Titiritera",
  pointsCost: 30,
  faction: "scions-of-yaldabaoth",
  faction_id: "scions-of-yaldabaoth",
  keywords: [
    { name: "Character", description: "" },
    { name: "Dead Flesh", description: "" },
    { name: "Darkminded", description: "" },
    { name: "Elf", description: "" },
    { name: "Dispel (BLU)", description: "" },
    { name: "Spellcaster", description: "" },
    { name: "Join (Risen)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 2,
  specialRules: ["Place (5)"],
  tournamentLegal: true,
  imageUrl: "/art/card/puppeteer_card.jpg"
};