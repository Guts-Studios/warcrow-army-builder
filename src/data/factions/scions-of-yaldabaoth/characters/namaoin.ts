import { Unit } from "@/types/army";

export const namaoin: Unit = {
  id: "namaoin",
  name: "Namaoin",
  name_es: "Namaoin",
  pointsCost: 30,
  faction: "scions-of-yaldabaoth",
  faction_id: "scions-of-yaldabaoth",
  keywords: [
    { name: "Character", description: "" },
    { name: "Darkminded", description: "" },
    { name: "Elf", description: "" },
    { name: "Fog", description: "" },
    { name: "Ambusher", description: "" },
    { name: "Dispel (BLK BLK)", description: "" },
    { name: "Spellcaster", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Vulnerable", "Frightened", "Impassable"],
  tournamentLegal: true,
  imageUrl: "/art/card/namaoin_card.jpg"
};