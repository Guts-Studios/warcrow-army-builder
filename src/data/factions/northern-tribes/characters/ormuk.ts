
import { Unit } from "@/types/army";

export const ormuk: Unit = {
  id: "ormuk",
  name: "Ormuk",
  name_es: "Ormuk",
  pointsCost: 35,
  faction: "northern-tribes",
  faction_id: "northern-tribes",
  keywords: [
    { name: "Character", description: "" },
    { name: "Colossal Company", description: "" },
    { name: "Orc", description: "" },
    { name: "Bloodlust", description: "" },
    { name: "Dispel (BLK)", description: "" },
    { name: "Elite", description: "" },
    { name: "Fearless", description: "" },
    { name: "Raging", description: "" }
  ],
  highCommand: false,
  availability: 1,
  command: 1,
  specialRules: [],
  tournamentLegal: false,
  imageUrl: "/art/card/ormuk_card.jpg"
};
