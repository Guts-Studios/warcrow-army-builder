
import * as React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { factions } from "@/data/factions";
import { hegemonyCharacters } from "@/data/factions/hegemony/characters";
import { northernTribesCharacters } from "@/data/factions/northern-tribes/characters";
import { scionsOfYaldabaothCharacters } from "@/data/factions/scions-of-yaldabaoth/characters";
import { syenannCharacters } from "@/data/factions/syenann/characters";
import { characteristicDefinitions } from "@/data/characteristicDefinitions";
import { Badge } from "@/components/ui/badge";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const CharacterReferences = () => {
  const charactersByFaction = {
    "hegemony-of-embersig": hegemonyCharacters,
    "northern-tribes": northernTribesCharacters,
    "scions-of-yaldabaoth": scionsOfYaldabaothCharacters,
    "syenann": syenannCharacters
  };

  return (
    <ScrollArea className="h-[calc(100vh-16rem)] bg-warcrow-accent/20 rounded-lg p-6">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Character References</h2>
        
        <Tabs defaultValue={factions[0].id} className="w-full">
          <TabsList className="w-full bg-black/30 mb-4 flex flex-wrap h-auto">
            {factions.map((faction) => (
              <TabsTrigger 
                key={faction.id} 
                value={faction.id}
                className="text-warcrow-text data-[state=active]:text-warcrow-gold data-[state=active]:bg-black/50"
              >
                {faction.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {factions.map((faction) => (
            <TabsContent key={faction.id} value={faction.id} className="space-y-4">
              <Card className="bg-black/20 border-warcrow-gold/30">
                <CardHeader>
                  <CardTitle className="text-warcrow-gold">{faction.name} Characters</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow className="border-warcrow-gold/30">
                        <TableHead className="text-warcrow-gold">Name</TableHead>
                        <TableHead className="text-warcrow-gold">Points</TableHead>
                        <TableHead className="text-warcrow-gold">Command</TableHead>
                        <TableHead className="text-warcrow-gold">Keywords</TableHead>
                        <TableHead className="text-warcrow-gold">Special Rules</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {charactersByFaction[faction.id].map((character) => (
                        <TableRow key={character.id} className="border-warcrow-gold/30">
                          <TableCell className="font-medium text-warcrow-text">
                            {character.name}
                            {character.highCommand && (
                              <Badge className="ml-2 bg-warcrow-gold text-black">High Command</Badge>
                            )}
                          </TableCell>
                          <TableCell>{character.pointsCost}</TableCell>
                          <TableCell>{character.command}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {character.keywords?.map((keyword, index) => (
                                <TooltipProvider key={index}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Badge 
                                        className="bg-black/50 text-warcrow-text border border-warcrow-gold/30 flex items-center gap-1 cursor-help"
                                      >
                                        {keyword.name}
                                        {characteristicDefinitions[keyword.name.split(' ')[0]] && (
                                          <InfoIcon className="h-3 w-3 text-warcrow-gold/80" />
                                        )}
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="bg-black text-warcrow-text border-warcrow-gold/50 max-w-xs">
                                      {characteristicDefinitions[keyword.name.split(' ')[0]] || keyword.description || "No description available"}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {character.specialRules?.map((rule, index) => (
                                <Badge 
                                  key={index} 
                                  className="bg-black/50 text-warcrow-text border border-warcrow-gold/30"
                                >
                                  {rule}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </ScrollArea>
  );
};
