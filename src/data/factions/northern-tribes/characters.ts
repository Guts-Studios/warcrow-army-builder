
import { Unit } from "@/types/army";

export const northernTribesCharacters: Unit[] = [
  {
    id: "vercana",
    name: "Vercana",
    pointsCost: 30,
    faction: "northern-tribes",
    faction_id: "northern-tribes",
    keywords: [
      { name: "Ambusher", description: "" },
      { name: "Mercenary", description: "" },
      { name: "Character", description: "Characters are single miniature units that can join allied units to lead them, improve their capabilities, or give them unique abilities." },
      { name: "Human", description: "Members of the human race, the most numerous and adaptable species." }
    ],
    highCommand: false,
    availability: 1,
    command: 0,
    specialRules: ["Place (5)"],
    imageUrl: "/art/card/vercana_card.jpg"
  },
  {
    id: "prime-warrior",
    name: "Prime Warrior",
    faction: "northern-tribes",
    pointsCost: 30,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Join (Infantry, Orc)", description: "" },
      { name: "Raging", description: "" },
    ],
    specialRules: ["Frightened", "Vulnerable", "Slowed", "Disarmed"],
    highCommand: false,
    imageUrl: "/art/card/prime_warrior_card.jpg"
  },
  {
    id: "ormuk",
    name: "Ormuk",
    faction: "northern-tribes",
    pointsCost: 35,
    availability: 1,
    command: 1,
    keywords: [
      { name: "Character", description: "" },
      { name: "Colossal Company", description: "" },
      { name: "Orc", description: "" },
      { name: "Bloodlust", description: "" },
      { name: "Dispel (BLK)", description: "" },
      { name: "Elite", description: "" },
      { name: "Fearless", description: "" },
      { name: "Raging", description: "" },
    ],
    specialRules: [],
    highCommand: false,
    imageUrl: "/art/card/ormuk_card.jpg"
  },
  {
    id: "revenant",
    name: "Revenant",
    faction: "northern-tribes",
    pointsCost: 40,
    availability: 1,
    command: 0,
    keywords: [
      { name: "Character", description: "" },
      { name: "Orc", description: "" },
      { name: "Elite", description: "" },
      { name: "Fearless", description: "" },
      { name: "Immovable", description: "" },
      { name: "Intimidating (1)", description: "" },
    ],
    specialRules: ["Vulnerable"],
    highCommand: false,
    imageUrl: "/art/card/revenant_card.jpg"
  }
];
