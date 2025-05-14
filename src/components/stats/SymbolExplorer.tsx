
// This file now re-exports UnitExplorer instead of providing a dummy component
import React from 'react';
import UnitExplorer from './unit-explorer';

const SymbolExplorer: React.FC = () => {
  return <UnitExplorer />;
};

export default SymbolExplorer;
