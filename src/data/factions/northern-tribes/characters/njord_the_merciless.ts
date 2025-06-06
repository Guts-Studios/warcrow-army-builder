
import { Unit } from "@/types/army";

export const njord_the_merciless: Unit = {
  id: "njord_the_merciless",
  name: "Njord, The Merciless",
  pointsCost: 40,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Character", description: "" },
    { name: "Varank", description: "" },
    { name: "Beserker Rage", description: "" },
    { name: "Join (Infantry Varank)", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 2,
  specialRules: ["Frightened", "Raging", "Fearless"],
  imageUrl: "/art/card/njord_the_merciless_card.jpg"
};
