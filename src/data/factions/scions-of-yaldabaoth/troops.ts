
import { Unit } from "@/types/army";

export const scionsOfYaldabaothTroops: Unit[] = [
  {
    id: "anointed",
    name: "Anointed",
    pointsCost: 50,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elf", description: "" },
      { name: "Darkminded", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Vulnerable", "Frightened", "Preferred Terrain (Rugged)"],
    imageUrl: "/art/card/anointed_card.jpg"
  },
  {
    id: "bugbowls",
    name: "Bugbowls",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Red Cap", description: "" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Slowed", "Vulnerable"],
    imageUrl: "/art/card/bugbowls_card.jpg"
  },
  {
    id: "crucible",
    name: "Crucible",
    pointsCost: 45,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elf", description: "" },
      { name: "Darkminded", description: "" },
      { name: "Elite", description: "" }
    ],
    highCommand: false,
    availability: 1,
    specialRules: ["Vulnerable", "Frightened"],
    imageUrl: "/art/card/crucible_card.jpg"
  },
  {
    id: "echoes",
    name: "Echoes",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Dead Flesh", description: "" },
      { name: "Risen", description: "" },
      { name: "Elf", description: "" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Vulnerable", "Frightened", "Slowed"],
    imageUrl: "/art/card/echoes_card.jpg"
  },
  {
    id: "gobblers",
    name: "Gobblers",
    pointsCost: 30,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Red Cap", description: "" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Slowed"],
    imageUrl: "/art/card/gobblers_card.jpg"
  },
  {
    id: "husks",
    name: "Husks",
    pointsCost: 15,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Dead Flesh", description: "" },
      { name: "Risen", description: "" },
      { name: "Human", description: "" }
    ],
    highCommand: false,
    availability: 3,
    specialRules: ["Vulnerable", "Frightened", "Slowed", "Disarmed"],
    imageUrl: "/art/card/husks_card.jpg"
  },
  {
    id: "intact",
    name: "Intact",
    pointsCost: 35,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elf", description: "" },
      { name: "Darkminded", description: "" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Vulnerable", "Frightened"],
    imageUrl: "/art/card/intact_card.jpg"
  },
  {
    id: "marked",
    name: "Marked",
    pointsCost: 25,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elf", description: "" },
      { name: "Darkminded", description: "" }
    ],
    highCommand: false,
    availability: 3,
    specialRules: ["Vulnerable", "Frightened", "Disarmed"],
    imageUrl: "/art/card/marked_card.jpg"
  },
  {
    id: "marked-marksmen",
    name: "Marked Marksmen",
    pointsCost: 35,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Living Flesh", description: "" },
      { name: "Elf", description: "" },
      { name: "Darkminded", description: "" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Vulnerable", "Frightened"],
    imageUrl: "/art/card/marked_marksmen_card.jpg"
  },
  {
    id: "osseous",
    name: "Osseous",
    pointsCost: 35,
    faction: "scions-of-yaldabaoth",
    faction_id: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "" },
      { name: "Dead Flesh", description: "" },
      { name: "Risen", description: "" },
      { name: "Golem", description: "" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Vulnerable", "Frightened"],
    imageUrl: "/art/card/osseous_card.jpg"
  }
];
