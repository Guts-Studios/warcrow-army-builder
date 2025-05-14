
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
  
  // Create a wrapper function that only takes the keyword parameter
  // This matches the expected function signature in formatKeywords
  const translateKeywordWrapper = (keyword: string) => {
    return translateKeyword(keyword, 'en');
  };
  
  return (
    <div className="border rounded border-warcrow-gold/30 overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-warcrow-accent hover:bg-warcrow-accent/90">
            <TableHead className="text-warcrow-gold">{t('faction')}</TableHead>
            <TableHead className="text-warcrow-gold">{t('type')}</TableHead>
            <TableHead className="text-warcrow-gold">{t('name')}</TableHead>
            <TableHead className="text-warcrow-gold">CMD</TableHead>
            <TableHead className="text-warcrow-gold">AVB</TableHead>
            <TableHead className="text-warcrow-gold">{t('keywords')}</TableHead>
            <TableHead className="text-warcrow-gold">HC</TableHead>
            <TableHead className="text-warcrow-gold">Pts</TableHead>
            <TableHead className="text-warcrow-gold">{t('rules')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-warcrow-muted">
                {t('loading')}...
              </TableCell>
            </TableRow>
          ) : filteredUnits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-6 text-warcrow-muted">
                {t('noUnitsMatch')}
              </TableCell>
            </TableRow>
          ) : (
            filteredUnits.map((unit, index) => (
              <TableRow key={`${unit.id}-${index}`} className="hover:bg-warcrow-accent/5">
                <TableCell className="text-warcrow-text">{formatFactionName(unit.faction)}</TableCell>
                <TableCell className="text-warcrow-text">{getUnitType(unit)}</TableCell>
                <TableCell className="text-warcrow-text font-medium">{unit.name}</TableCell>
                <TableCell className="text-warcrow-text">
                  {unit.characteristics?.command || unit.command || '0'}
                </TableCell>
                <TableCell className="text-warcrow-text">
                  {unit.characteristics?.availability || unit.availability || '0'}
                </TableCell>
                <TableCell className="text-warcrow-text">{formatKeywords(unit, translateKeywordWrapper)}</TableCell>
                <TableCell className="text-warcrow-text">
                  {unit.characteristics?.highCommand || unit.highCommand ? 'Yes' : 'No'}
                </TableCell>
                <TableCell className="text-warcrow-text">{unit.points || unit.pointsCost || 0}</TableCell>
                <TableCell className="text-warcrow-text">
                  {Array.isArray(unit.special_rules) && unit.special_rules.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {unit.special_rules.map((rule: string, i: number) => (
                        <span key={i} className="text-xs">
                          {rule}
                        </span>
                      ))}
                    </div>
                  ) : unit.specialRules && unit.specialRules.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      {unit.specialRules.map((rule: string, i: number) => (
                        <span key={i} className="text-xs">
                          {rule}
                        </span>
                      ))}
                    </div>
                  ) : (
                    '-'
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
