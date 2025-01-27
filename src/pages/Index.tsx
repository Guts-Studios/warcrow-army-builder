import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FactionSelector from "@/components/FactionSelector";
import ArmyList from "@/components/ArmyList";

const Index = () => {
  const [selectedFaction, setSelectedFaction] = useState("northern-tribes");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center relative overflow-x-hidden px-4 pb-32">
      <img 
        src="https://odqyoncwqawdzhquxcmh.supabase.co/storage/v1/object/public/images/Logo.png?t=2024-12-31T22%3A06%3A03.113Z" 
        alt="Warcrow Logo" 
        className="h-20 md:h-28 mx-auto mb-6"
      />
      <div className="w-full max-w-xs flex justify-center gap-3 mb-8">
        <button 
          onClick={() => navigate('/landing')} 
          className="bg-warcrow-accent text-warcrow-text px-3 py-1.5 rounded hover:bg-warcrow-accent/80 transition-colors text-sm border border-warcrow-gold/30"
        >
          Landing Page
        </button>
        <button 
          onClick={() => navigate('/rules')} 
          className="bg-warcrow-accent text-warcrow-text px-3 py-1.5 rounded hover:bg-warcrow-accent/80 transition-colors text-sm border border-warcrow-gold/30"
        >
          Rules
        </button>
      </div>
      <FactionSelector 
        selectedFaction={selectedFaction} 
        onFactionChange={setSelectedFaction} 
      />
      <ArmyList 
        selectedFaction={selectedFaction} 
        onFactionChange={setSelectedFaction}
      />
    </div>
  );
};

export default Index;