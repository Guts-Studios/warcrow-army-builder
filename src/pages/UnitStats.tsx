
import React, { useState } from "react";
import { sampleExtendedUnits } from "@/data/extendedUnits";
import UnitStatCard from "@/components/stats/UnitStatCard";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExtendedUnit } from "@/types/extendedUnit";
import { UnitStatsHeader } from "@/components/stats/UnitStatsHeader";

const UnitStats = () => {
  const [selectedUnit, setSelectedUnit] = useState<ExtendedUnit | null>(sampleExtendedUnits[0]);

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <UnitStatsHeader />
      
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Unit Selection Column */}
          <div className="md:col-span-1 space-y-4">
            <div className="bg-black/40 rounded-lg p-4 border border-warcrow-gold/30">
              <h2 className="text-xl font-bold text-warcrow-gold mb-4">Select Unit</h2>
              <ScrollArea className="h-[60vh]">
                <div className="space-y-2 pr-4">
                  {sampleExtendedUnits.map((unit) => (
                    <Button
                      key={unit.id}
                      variant="outline"
                      className={`w-full justify-start ${
                        selectedUnit?.id === unit.id 
                          ? "bg-warcrow-gold/20 border-warcrow-gold text-warcrow-gold" 
                          : "bg-black/60 border-warcrow-gold/30 text-warcrow-text hover:bg-warcrow-gold/10 hover:text-warcrow-gold"
                      }`}
                      onClick={() => setSelectedUnit(unit)}
                    >
                      {unit.name}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* Unit Stat Card Column */}
          <div className="md:col-span-2">
            {selectedUnit ? (
              <UnitStatCard unit={selectedUnit} />
            ) : (
              <div className="bg-black/40 rounded-lg p-8 border border-warcrow-gold/30 text-center">
                <p className="text-warcrow-gold">Select a unit to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitStats;
