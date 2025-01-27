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
        className="w-64 mb-6"
      />
      <div className="w-full flex justify-center gap-4 mb-4">
        <button 
          onClick={() => navigate('/landing')} 
          className="bg-warcrow-gold text-black font-medium py-2 px-4 rounded hover:bg-warcrow-gold/80 transition-colors"
        >
          Go to Landing Page
        </button>
        <button 
          onClick={() => navigate('/rules')} 
          className="bg-warcrow-gold text-black font-medium py-2 px-4 rounded hover:bg-warcrow-gold/80 transition-colors"
        >
          Rules Reference
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