import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FactionSelector from "@/components/FactionSelector";
import ArmyList from "@/components/ArmyList";

const Index = () => {
  const [selectedFaction, setSelectedFaction] = useState("northern-tribes");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center relative overflow-x-hidden px-4 pb-32">
      <FactionSelector 
        selectedFaction={selectedFaction} 
        onFactionChange={setSelectedFaction} 
      />
      <ArmyList 
        selectedFaction={selectedFaction} 
        onFactionChange={setSelectedFaction}
      />
      <button onClick={() => navigate('/landing')} className="mt-4 bg-warcrow-gold text-black font-medium py-2 px-4 rounded">
        Go to Landing Page
      </button>
    </div>
  );
};

export default Index;