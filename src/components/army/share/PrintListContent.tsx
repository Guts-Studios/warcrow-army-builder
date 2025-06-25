
import { SelectedUnit } from "@/types/army";
import { getFactionName } from "@/utils/listFormatUtils";

interface PrintListContentProps {
  units: SelectedUnit[];
  listName: string | null;
  faction: string;
  isCourtesyList?: boolean;
  language?: string;
}

export const PrintListContent = ({ units, listName, faction, isCourtesyList, language = 'en' }: PrintListContentProps) => {
  const totalPoints = units.reduce((sum, unit) => sum + (unit.pointsCost * (unit.quantity || 1)), 0);
  const totalCommand = units.reduce((sum, unit) => sum + ((unit.command || 0) * (unit.quantity || 1)), 0);

  // Get the appropriate unit name based on language
  const getUnitName = (unit: SelectedUnit) => {
    if (language === 'es' && unit.name_es) {
      return unit.name_es;
    }
    return unit.name;
  };

  const listTypeLabel = isCourtesyList ? 
    (language === 'es' ? "Lista de Cortesía" : "Courtesy List") :
    (language === 'es' ? "Lista Completa" : "Full List");

  const factionLabel = language === 'es' ? "Facción" : "Faction";
  const createdLabel = language === 'es' ? "Creado" : "Created";
  const unitsLabel = language === 'es' ? "Unidades" : "Units";
  const commandPointsLabel = language === 'es' ? "Puntos de Comando" : "Command Points";
  const totalPointsLabel = language === 'es' ? "Puntos Totales" : "Total Points";
  const highCommandLabel = language === 'es' ? "Alto Mando" : "High Command";
  const notTournamentLegalLabel = language === 'es' ? "No Legal para Torneo" : "Not Tournament Legal";
  const courtesyNoticeLabel = language === 'es' ? 
    "Lista de Cortesía - Unidades Scout y Ambusher ocultas" :
    "Courtesy List - Scout and Ambusher units hidden";

  return `
    <html>
      <head>
        <title>${listTypeLabel} - ${listName || "Untitled List"}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 800px;
            margin: 0 auto;
          }
          h1, h2, h3 { color: #333; }
          .header {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #333;
          }
          .unit {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            border-bottom: 1px solid #eee;
          }
          .unit-name { font-weight: bold; }
          .meta {
            color: #666;
            font-style: italic;
          }
          .command {
            color: #8a6d3b;
            margin-left: 5px;
          }
          .tournament-status {
            color: #d9534f;
            margin-left: 5px;
            font-style: italic;
          }
          .totals {
            margin-top: 20px;
            padding-top: 10px;
            border-top: 2px solid #333;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 0.8em;
            color: #666;
          }
          ${isCourtesyList ? '.notice { color: #8a6d3b; margin-top: 10px; font-style: italic; }' : ''}
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${listName || "Untitled List"}</h1>
          <p>${factionLabel}: ${getFactionName(faction)}</p>
          <p class="meta">${createdLabel}: ${new Date().toLocaleDateString()}</p>
          ${isCourtesyList ? `<p class="notice">${courtesyNoticeLabel}</p>` : ''}
        </div>

        <h2>${unitsLabel}</h2>
        <div class="units">
          ${units.map(unit => `
            <div class="unit">
              <div>
                <span class="unit-name">${getUnitName(unit)}</span>
                ${unit.highCommand ? ` [${highCommandLabel}]` : ''}
                ${unit.command ? `<span class="command">(${unit.command} CP)</span>` : ''}
                ${unit.tournamentLegal === false ? `<span class="tournament-status">[${notTournamentLegalLabel}]</span>` : ''}
                ${unit.quantity > 1 ? ` ×${unit.quantity}` : ''}
              </div>
              <div>${unit.pointsCost * (unit.quantity || 1)} pts</div>
            </div>
          `).join('')}
        </div>

        <div class="totals">
          <div>${commandPointsLabel}: ${totalCommand} CP</div>
          <div>${totalPointsLabel}: ${totalPoints} pts</div>
        </div>

        <div class="footer">
          <p>Printed from Warcrow Army Builder</p>
        </div>
      </body>
    </html>
  `;
};
