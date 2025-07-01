import { useState } from "react";
import { Session } from "@supabase/supabase-js";

interface ArmyBuilderProps {
  session: Session | null;
}

const ArmyBuilderSimple = ({ session }: ArmyBuilderProps) => {
  return (
    <div className="space-y-4 md:space-y-8 px-2 md:px-4">
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold text-warcrow-gold mb-4">Army Builder Loading...</h2>
        <p className="text-warcrow-muted">Please wait while we load the army builder.</p>
      </div>
    </div>
  );
};

export default ArmyBuilderSimple;