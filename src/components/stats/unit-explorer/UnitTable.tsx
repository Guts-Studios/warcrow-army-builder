
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTranslateKeyword } from '@/utils/translation';
import { formatFactionName, getUnitType, formatKeywords } from './utils';

interface UnitTableProps {
  filteredUnits: any[];
  t: (key: string) => string;
  isLoading?: boolean;
}

export const UnitTable: React.FC<UnitTableProps> = ({
  filteredUnits,
  t,
  isLoading = false
}) => {
  const { translateKeyword } = useTranslateKeyword();
  
  return (
    <div className="border rounded border-warcrow-gold/30 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-warcrow-accent hover:bg-warcrow-accent/90">
            <TableHead className="text-warcrow-gold">{t('faction')}</TableHead>
            <TableHead className="text-warcrow-gold">{t('type')}</TableHead>
            <TableHead className="text-warcrow-gold">{t('name')}</TableHead>
            <TableHead className="text-warcrow-gold">{t('id')}</TableHead>
            <TableHead className="text-warcrow-gold">{t('keywords')}</TableHead>
            <TableHead className="text-warcrow-gold">{t('points')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-warcrow-muted">
                {t('loading')}...
              </TableCell>
            </TableRow>
          ) : filteredUnits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-warcrow-muted">
                {t('noUnitsMatch')}
              </TableCell>
            </TableRow>
          ) : (
            filteredUnits.map((unit, index) => (
              <TableRow key={`${unit.id}-${index}`} className="hover:bg-warcrow-accent/5">
                <TableCell className="text-warcrow-text">{formatFactionName(unit.faction)}</TableCell>
                <TableCell className="text-warcrow-text">{getUnitType(unit)}</TableCell>
                <TableCell className="text-warcrow-text font-medium">{unit.name}</TableCell>
                <TableCell className="text-warcrow-text/80 text-xs">{unit.id}</TableCell>
                <TableCell className="text-warcrow-text">{formatKeywords(unit, translateKeyword)}</TableCell>
                <TableCell className="text-warcrow-text">{unit.pointsCost}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
