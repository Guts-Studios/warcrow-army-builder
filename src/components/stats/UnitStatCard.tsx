
import React from "react";
import { ExtendedUnit } from "@/types/extendedUnit";
import { Card, CardContent } from "@/components/ui/card";

interface UnitStatCardProps {
  unit: ExtendedUnit;
}

const UnitStatCard = ({ unit }: UnitStatCardProps) => {
  return (
    <Card className="bg-warcrow-background border-2 border-warcrow-gold/50 rounded-lg shadow-lg max-w-lg mx-auto overflow-hidden">
      <div className="bg-black p-4 border-b border-warcrow-gold/50">
        <h2 className="text-xl font-bold text-center text-warcrow-gold">{unit.name}</h2>
        <div className="flex justify-between mt-2">
          <p className="text-warcrow-text"><strong className="text-warcrow-gold">COST:</strong> {unit.cost}</p>
          <p className="text-warcrow-text"><strong className="text-warcrow-gold">Type:</strong> {unit.type}</p>
        </div>
      </div>

      <CardContent className="p-4 space-y-4">
        {/* Stats */}
        <div>
          <h3 className="font-bold text-lg text-warcrow-gold border-b border-warcrow-gold/30 pb-1 mb-2">Stats</h3>
          <div className="grid grid-cols-5 text-center gap-2">
            {Object.entries(unit.stats).map(([key, value]) => (
              <div key={key} className="bg-black/60 p-2 rounded-md">
                <strong className="text-warcrow-gold">{key}</strong>
                <p className="text-warcrow-text">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords if available */}
        {unit.keywords && unit.keywords.length > 0 && (
          <div>
            <h3 className="font-bold text-lg text-warcrow-gold border-b border-warcrow-gold/30 pb-1 mb-2">Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {unit.keywords.map((keyword, idx) => (
                <span key={idx} className="bg-black/60 text-warcrow-text px-2 py-1 rounded-md text-sm">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Attacks */}
        <div>
          <h3 className="font-bold text-lg text-warcrow-gold border-b border-warcrow-gold/30 pb-1 mb-2">Attacks</h3>
          {unit.attacks.map((attack, index) => (
            <div key={index} className="bg-black/60 p-3 rounded-md my-2 border-l-4 border-red-700">
              <div className="flex flex-wrap justify-between items-center">
                <p className="text-warcrow-text"><strong className="text-warcrow-gold">Members:</strong> {attack.members}</p>
                {attack.modifier && (
                  <p className="text-warcrow-text"><strong className="text-warcrow-gold">Modifier:</strong> {attack.modifier}</p>
                )}
              </div>
              <p className="text-warcrow-text mt-1"><strong className="text-warcrow-gold">Dice:</strong> {attack.dice.join(" ")}</p>
              
              {attack.switches && attack.switches.length > 0 && (
                <div className="mt-2">
                  <strong className="text-warcrow-gold">Switches:</strong>
                  {attack.switches.map((sw, i) => (
                    <p key={i} className="text-warcrow-text text-sm ml-4 mt-1">
                      <span className="text-warcrow-gold">{sw.value}:</span> {sw.effect}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Defenses */}
        <div>
          <h3 className="font-bold text-lg text-warcrow-gold border-b border-warcrow-gold/30 pb-1 mb-2">Defenses</h3>
          {unit.defenses.map((def, index) => (
            <div key={index} className="bg-black/60 p-3 rounded-md my-2 border-l-4 border-blue-700">
              {def.modifier && (
                <p className="text-warcrow-text"><strong className="text-warcrow-gold">Modifier:</strong> {def.modifier}</p>
              )}
              <p className="text-warcrow-text"><strong className="text-warcrow-gold">Dice:</strong> {def.dice.join(" ")}</p>
              
              {def.switches && def.switches.length > 0 && (
                <div className="mt-2">
                  <strong className="text-warcrow-gold">Switches:</strong>
                  {def.switches.map((sw, i) => (
                    <p key={i} className="text-warcrow-text text-sm ml-4 mt-1">
                      <span className="text-warcrow-gold">{sw.value}:</span> {sw.effect}
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Abilities */}
        <div className="bg-black/60 p-3 rounded-md my-2 border-l-4 border-amber-600">
          <h3 className="font-bold text-lg text-warcrow-gold border-b border-warcrow-gold/30 pb-1 mb-2">Abilities</h3>
          {unit.abilities.skill && (
            <p className="text-warcrow-text mt-2">
              <strong className="text-warcrow-gold">Skill:</strong> {unit.abilities.skill}
            </p>
          )}
          {unit.abilities.passive && (
            <p className="text-warcrow-text mt-2">
              <strong className="text-warcrow-gold">Passive:</strong> {unit.abilities.passive}
            </p>
          )}
          {unit.abilities.command && (
            <p className="text-warcrow-text mt-2">
              <strong className="text-warcrow-gold">Command:</strong> {unit.abilities.command}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UnitStatCard;
