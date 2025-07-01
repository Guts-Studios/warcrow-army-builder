import { Unit } from "@/types/army";

export const aoidos: Unit = {
  id: "aoidos",
  name: "Aoidos",
  name_es: "Aedo",
  pointsCost: 20,
  faction: "syenann",
  faction_id: "syenann",
  keywords: [
    { name: "Character", description: "" },
    { name: "Elf", description: "" },
    { name: "Nemorous", description: "" },
    { name: "Syenann", description: "" },
    { name: "Join (Infantry Synann)", description: "" },
    { name: "Spellcaster", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 0,
  specialRules: ["Vulnerable", "Slowed", "Disarmed", "Frightened"],
  tournamentLegal: true,
  imageUrl: "/art/card/aoidos_card.jpg"
};