
import { Unit } from "@/types/army";

export const scionsOfYaldabaothTroops: Unit[] = [
  {
    id: "anointed",
    name: "Anointed",
    pointsCost: 50,
    faction: "scions-of-yaldabaoth",
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Darkminded", description: "Darkminded trait" },
      { name: "Elite", description: "Elite unit" }
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
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Red Cap", description: "Red Cap race" }
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
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Darkminded", description: "Darkminded trait" },
      { name: "Elite", description: "Elite unit" }
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
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Dead Flesh", description: "Dead unit type" },
      { name: "Risen", description: "Reanimated unit" },
      { name: "Elf", description: "Elf race" }
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
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Red Cap", description: "Red Cap race" }
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
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Dead Flesh", description: "Dead unit type" },
      { name: "Risen", description: "Reanimated unit" },
      { name: "Human", description: "Human race" }
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
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Darkminded", description: "Darkminded trait" }
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
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Darkminded", description: "Darkminded trait" }
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
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Living Flesh", description: "Living unit type" },
      { name: "Elf", description: "Elf race" },
      { name: "Darkminded", description: "Darkminded trait" }
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
    keywords: [
      { name: "Infantry", description: "Infantry unit type" },
      { name: "Dead Flesh", description: "Dead unit type" },
      { name: "Risen", description: "Reanimated unit" },
      { name: "Golem", description: "Artificial construct" }
    ],
    highCommand: false,
    availability: 2,
    specialRules: ["Vulnerable", "Frightened"],
    imageUrl: "/art/card/osseous_card.jpg"
  }
];
