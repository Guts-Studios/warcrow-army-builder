
import React from "react";
import { ExtendedUnit, AbilityEntry } from "@/types/extendedUnit";
import { Card, CardContent } from "@/components/ui/card";
import { GameSymbol } from "./GameSymbol";

interface UnitStatCardProps {
  unit: ExtendedUnit;
}

// Symbol mapping configuration for easier additions in the future
interface SymbolConfig {
  symbol: string;
  fontChar: string;
  color: string;
}

const symbolConfigs: SymbolConfig[] = [
  { symbol: '🔴', fontChar: 'w', color: '#ea384c' }, // Red symbol
  { symbol: '🟠', fontChar: 'q', color: '#ff8c00' }, // Orange symbol
  { symbol: '🟢', fontChar: '9', color: '#00b300' }, // Green symbol
  // Add more symbols here in the future as needed
];

// Helper function to replace special symbols with Warcrow font characters
const replaceSymbols = (text: string | undefined): React.ReactNode => {
  if (!text) return null;
  
  // Start with the original text
  let result: React.ReactNode = text;
  
  // Process each symbol configuration in order
  symbolConfigs.forEach(config => {
    // If result is a string, handle it directly
    if (typeof result === 'string') {
      const parts = result.split(config.symbol);
      if (parts.length === 1) return; // No symbols to replace
      
      // Replace the string with a React fragment containing the symbol replacements
      result = (
        <>
          {parts.map((part, i) => (
            <React.Fragment key={`${config.symbol}-${i}`}>
              {i > 0 && <span className="Warcrow-Family font-warcrow" style={{ color: config.color, fontSize: '1.125rem' }}>{config.fontChar}</span>}
              {part}
            </React.Fragment>
          ))}
        </>
      );
    } 
    // If result is already a React element, traverse its children
    else if (React.isValidElement(result)) {
      result = React.cloneElement(
        result,
        { key: `processed-${config.symbol}` },
        React.Children.map(result.props.children, (child) => {
          // Only process string children
          if (typeof child === 'string' || typeof child === 'number') {
            const stringChild = String(child);
            const parts = stringChild.split(config.symbol);
            if (parts.length === 1) return child; // No symbols to replace
            
            // Replace with fragments containing symbol replacements
            return (
              <>
                {parts.map((part, i) => (
                  <React.Fragment key={`nested-${config.symbol}-${i}`}>
                    {i > 0 && <span className="Warcrow-Family font-warcrow" style={{ color: config.color, fontSize: '1.125rem' }}>{config.fontChar}</span>}
                    {part}
                  </React.Fragment>
                ))}
              </>
            );
          }
          
          // For non-string children, recursively process them if they're React elements
          if (React.isValidElement(child)) {
            return React.cloneElement(
              child as React.ReactElement<any>,
              { key: `recursive-${config.symbol}` },
              replaceSymbols(React.Children.toArray(child.props.children as React.ReactNode[]).join(''))
            );
          }
          
          return child;
        })
      );
    }
    // If result is an array (from previous replacements), process each element
    else if (Array.isArray(result)) {
      result = result.map((element, index) => {
        if (typeof element === 'string' || typeof element === 'number') {
          const stringElement = String(element);
          const parts = stringElement.split(config.symbol);
          if (parts.length === 1) return element; // No symbols to replace
          
          // Replace with fragments containing symbol replacements
          return (
            <React.Fragment key={`array-${config.symbol}-${index}`}>
              {parts.map((part, i) => (
                <React.Fragment key={`array-nested-${config.symbol}-${index}-${i}`}>
                  {i > 0 && <span className="Warcrow-Family font-warcrow" style={{ color: config.color, fontSize: '1.125rem' }}>{config.fontChar}</span>}
                  {part}
                </React.Fragment>
              ))}
            </React.Fragment>
          );
        }
        
        // For non-string elements, recurse if they're React elements
        if (React.isValidElement(element)) {
          return React.cloneElement(
            element as React.ReactElement<any>,
            { key: `array-recursive-${config.symbol}-${index}` },
            replaceSymbols(React.Children.toArray(element.props.children as React.ReactNode[]).join(''))
          );
        }
        
        return element;
      });
    }
  });
  
  return result;
};

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
                <p className="text-warcrow-text">{replaceSymbols(String(value))}</p>
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
                  {replaceSymbols(keyword)}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Profiles - includes attacks, defenses, etc. */}
        <div>
          <h3 className="font-bold text-lg text-warcrow-gold border-b border-warcrow-gold/30 pb-1 mb-2">Profiles</h3>
          {unit.profiles.map((profile, profileIndex) => (
            <div key={profileIndex} className="bg-black/60 p-3 rounded-md my-2">
              <p className="text-warcrow-gold font-medium">Members: {profile.members}</p>
              
              {/* Ranged Attack */}
              {profile.ranged && (
                <div className="border-l-4 border-amber-700 p-2 my-2">
                  <h4 className="text-warcrow-gold">Ranged Attack</h4>
                  {profile.ranged.range && (
                    <p className="text-warcrow-text"><strong className="text-warcrow-gold">Range:</strong> {profile.ranged.range}</p>
                  )}
                  {profile.ranged.modifier && (
                    <p className="text-warcrow-text"><strong className="text-warcrow-gold">Modifier:</strong> {replaceSymbols(profile.ranged.modifier)}</p>
                  )}
                  <p className="text-warcrow-text"><strong className="text-warcrow-gold">Dice:</strong> {profile.ranged.dice.map((die, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && " "}
                      {replaceSymbols(die)}
                    </React.Fragment>
                  ))}</p>
                  
                  {profile.ranged.switches && profile.ranged.switches.length > 0 && (
                    <div className="mt-1">
                      <strong className="text-warcrow-gold">Switches:</strong>
                      {profile.ranged.switches.map((sw, i) => (
                        <p key={i} className="text-warcrow-text text-sm ml-4">
                          <span className="text-warcrow-gold">{replaceSymbols(sw.value)}:</span> {replaceSymbols(sw.effect)}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {/* Melee Attack */}
              <div className="border-l-4 border-red-700 p-2 my-2">
                <h4 className="text-warcrow-gold">Melee Attack</h4>
                {profile.attack.modifier && (
                  <p className="text-warcrow-text"><strong className="text-warcrow-gold">Modifier:</strong> {replaceSymbols(profile.attack.modifier)}</p>
                )}
                <p className="text-warcrow-text"><strong className="text-warcrow-gold">Dice:</strong> {profile.attack.dice.map((die, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && " "}
                    {replaceSymbols(die)}
                  </React.Fragment>
                ))}</p>
                
                {profile.attack.switches && profile.attack.switches.length > 0 && (
                  <div className="mt-1">
                    <strong className="text-warcrow-gold">Switches:</strong>
                    {profile.attack.switches.map((sw, i) => (
                      <p key={i} className="text-warcrow-text text-sm ml-4">
                        <span className="text-warcrow-gold">{replaceSymbols(sw.value)}:</span> {replaceSymbols(sw.effect)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Defense */}
              <div className="border-l-4 border-blue-700 p-2 my-2">
                <h4 className="text-warcrow-gold">Defense</h4>
                {profile.defense.modifier && (
                  <p className="text-warcrow-text"><strong className="text-warcrow-gold">Modifier:</strong> {replaceSymbols(profile.defense.modifier)}</p>
                )}
                <p className="text-warcrow-text"><strong className="text-warcrow-gold">Dice:</strong> {profile.defense.dice.map((die, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && " "}
                    {replaceSymbols(die)}
                  </React.Fragment>
                ))}</p>
                
                {profile.defense.switches && profile.defense.switches.length > 0 && (
                  <div className="mt-1">
                    <strong className="text-warcrow-gold">Switches:</strong>
                    {profile.defense.switches.map((sw, i) => (
                      <p key={i} className="text-warcrow-text text-sm ml-4">
                        <span className="text-warcrow-gold">{replaceSymbols(sw.value)}:</span> {replaceSymbols(sw.effect)}
                      </p>
                    ))}
                  </div>
                )}
                
                {profile.defense.conquest !== undefined && (
                  <p className="text-warcrow-text"><strong className="text-warcrow-gold">Conquest:</strong> {profile.defense.conquest}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Abilities */}
        {(unit.abilities.skill?.length > 0 || unit.abilities.passive?.length > 0 || unit.abilities.command?.length > 0) && (
          <div className="bg-black/60 p-3 rounded-md my-2 border-l-4 border-amber-600">
            <h3 className="font-bold text-lg text-warcrow-gold border-b border-warcrow-gold/30 pb-1 mb-2">Abilities</h3>
            
            {unit.abilities.skill && unit.abilities.skill.length > 0 && (
              <div className="mt-2">
                <strong className="text-warcrow-gold">Skill:</strong>
                {unit.abilities.skill.map((ability, i) => (
                  <div key={i} className="ml-4 mt-1">
                    {ability.name && <strong className="text-warcrow-gold">{ability.name}:</strong>} <span className="text-warcrow-text">{replaceSymbols(ability.description)}</span>
                  </div>
                ))}
              </div>
            )}
            
            {unit.abilities.passive && unit.abilities.passive.length > 0 && (
              <div className="mt-2">
                <strong className="text-warcrow-gold">Passive:</strong>
                {unit.abilities.passive.map((ability, i) => (
                  <div key={i} className="ml-4 mt-1">
                    {ability.name && <strong className="text-warcrow-gold">{ability.name}:</strong>} <span className="text-warcrow-text">{replaceSymbols(ability.description)}</span>
                  </div>
                ))}
              </div>
            )}
            
            {unit.abilities.command && unit.abilities.command.length > 0 && (
              <div className="mt-2">
                <strong className="text-warcrow-gold">Command:</strong>
                {unit.abilities.command.map((ability, i) => (
                  <div key={i} className="ml-4 mt-1">
                    {ability.name && <strong className="text-warcrow-gold">{ability.name}:</strong>} <span className="text-warcrow-text">{replaceSymbols(ability.description)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnitStatCard;
