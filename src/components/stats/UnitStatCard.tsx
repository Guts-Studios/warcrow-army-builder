
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
  { symbol: '🟠', fontChar: 'q', color: '#F97316' }, // Orange symbol
  { symbol: '🟢', fontChar: '9', color: '#00b300' }, // Green symbol
  { symbol: '⚫', fontChar: '7', color: '#000000' }, // Black symbol
  { symbol: '🔵', fontChar: '8', color: '#3b82f6' }, // Blue symbol - updated to a softer blue
  { symbol: '🟡', fontChar: '0', color: '#fbbf24' }, // Yellow symbol with a warm, readable yellow color
  { symbol: '⭐', fontChar: '1', color: '#ffd700' }, // Star symbol with gold/yellow color
  // Add more symbols here in the future as needed
];

// Helper function to replace special symbols with Warcrow font characters
const replaceSymbols = (text: string | undefined): React.ReactNode => {
  if (!text) return null;
  
  // Start with the original text
  let currentNode: React.ReactNode = text;
  
  // Process each symbol configuration in order
  symbolConfigs.forEach(config => {
    if (typeof currentNode === 'string') {
      if (!currentNode.includes(config.symbol)) return;
      
      const parts = currentNode.split(config.symbol);
      if (parts.length === 1) return; // No symbols to replace
      
      // Create an array of nodes with proper symbol replacements
      const nodes: React.ReactNode[] = [];
      parts.forEach((part, i) => {
        if (i > 0) {
          nodes.push(
            <span key={`symbol-${config.symbol}-${i}`} className="Warcrow-Family font-warcrow" style={{ color: config.color, fontSize: '1.125rem' }}>
              {config.fontChar}
            </span>
          );
        }
        if (part) {
          nodes.push(part);
        }
      });
      
      currentNode = <>{nodes}</>;
    } 
    // If it's already a React element, we need to process its children
    else if (React.isValidElement(currentNode)) {
      const element = currentNode as React.ReactElement;
      
      // Process children if they exist
      const children = React.Children.toArray(element.props.children);
      const newChildren = children.map(child => {
        if (typeof child === 'string' && child.includes(config.symbol)) {
          return replaceSymbols(child);
        }
        return child;
      });
      
      // Clone the element with new children
      currentNode = React.cloneElement(
        element,
        { key: `processed-${config.symbol}` },
        ...newChildren
      );
    }
    // Handle array of nodes (from previous replacements)
    else if (Array.isArray(currentNode)) {
      currentNode = currentNode.map((node, index) => {
        if (typeof node === 'string' && node.includes(config.symbol)) {
          return replaceSymbols(node);
        }
        return node;
      });
    }
  });
  
  return currentNode;
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
