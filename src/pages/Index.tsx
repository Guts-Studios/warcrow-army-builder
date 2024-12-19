import { useState } from "react";
import FactionSelector from "@/components/FactionSelector";
import ArmyList from "@/components/ArmyList";
import { Swords } from "lucide-react"; // Adding the Swords icon as it fits the war/army theme

const Index = () => {
  const [selectedFaction, setSelectedFaction] = useState("imperium");

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <div className="container max-w-7xl mx-auto py-8 px-4">
        <div className="flex flex-col items-center mb-8">
          <Swords className="w-16 h-16 text-warcrow-gold mb-4" strokeWidth={1.5} />
          <h1 className="text-4xl font-bold text-center mb-2 text-warcrow-gold">
            Warcrow Army Builder
          </h1>
          <p className="text-center text-warcrow-muted mb-8">
            Build and manage your Warcrow army lists
          </p>
        </div>
        <FactionSelector
          selectedFaction={selectedFaction}
          onFactionChange={setSelectedFaction}
        />
        <ArmyList selectedFaction={selectedFaction} />
      </div>
    </div>
  );
};

export default Index;