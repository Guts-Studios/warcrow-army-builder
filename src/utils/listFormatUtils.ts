
import { SelectedUnit, SavedList } from "@/types/army";
import { factions } from "@/data/factions";

export const getFactionName = (factionId: string): string => {
  const factionData = factions.find(f => f.id === factionId);
  return factionData?.name || "Unknown Faction";
};

export const generateListText = (selectedUnits: SelectedUnit[], listName: string | null, faction: string, language: string = 'en'): string => {
  const sortedUnits = [...selectedUnits].sort((a, b) => {
    if (a.highCommand && !b.highCommand) return -1;
    if (!a.highCommand && b.highCommand) return 1;
    return 0;
  });

  const factionName = getFactionName(faction);
  
  // Get the appropriate unit name based on language
  const getUnitName = (unit: SelectedUnit) => {
    if (language === 'es' && unit.name_es) {
      return unit.name_es;
    }
    if (language === 'fr' && unit.name_fr) {
      return unit.name_fr;
    }
    return unit.name;
  };

  const listText = `${listName || "Untitled List"}\nFaction: ${factionName}\n\n${sortedUnits
    .map((unit) => {
      const unitName = getUnitName(unit);
      const highCommandLabel = unit.highCommand ? " [High Command]" : "";
      const commandPoints = unit.command ? ` (${unit.command} CP)` : "";
      const tournamentStatus = unit.tournamentLegal === false ? 
        (language === 'es' ? " [No Legal para Torneo]" : " [Not Tournament Legal]") : "";
      return `${unitName}${highCommandLabel}${commandPoints}${tournamentStatus} x${unit.quantity} (${unit.pointsCost * unit.quantity} pts)`;
    })
    .join("\n")}`;

  const totalPoints = selectedUnits.reduce(
    (total, unit) => total + unit.pointsCost * unit.quantity,
    0
  );

  const totalCommand = selectedUnits.reduce(
    (total, unit) => total + ((unit.command || 0) * unit.quantity),
    0
  );

  const commandLabel = language === 'es' ? "Puntos de Comando Totales" : "Total Command Points";
  const pointsLabel = language === 'es' ? "Puntos Totales" : "Total Points";

  return `${listText}\n\n${commandLabel}: ${totalCommand}\n${pointsLabel}: ${totalPoints}`;
};

export const filterUnitsForCourtesy = (units: SelectedUnit[]): SelectedUnit[] => {
  return units.filter(unit => {
    const hasHiddenKeyword = Array.isArray(unit.keywords) && unit.keywords.some(keyword => {
      if (typeof keyword === 'string') {
        return keyword.toLowerCase() === 'scout' || keyword.toLowerCase() === 'ambusher';
      } else if (keyword && typeof keyword === 'object' && 'name' in keyword) {
        const keywordObj = keyword as { name: string };
        return keywordObj.name.toLowerCase() === 'scout' || keywordObj.name.toLowerCase() === 'ambusher';
      }
      return false;
    });
    return !hasHiddenKeyword;
  });
};
