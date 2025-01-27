import * as React from 'react';
import { Session } from '@supabase/supabase-js';
import ExampleUsage from '../ExampleUsage';

interface ArmyBuilderProps {
  session: Session | null;
}

export const ArmyBuilder: React.FC<ArmyBuilderProps> = ({ session }) => {
  return (
    <div className="space-y-6">
      <ExampleUsage />
      {/* Additional army builder functionality will go here */}
    </div>
  );
};

export default ArmyBuilder;