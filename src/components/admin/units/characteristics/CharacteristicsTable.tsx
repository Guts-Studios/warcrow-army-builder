
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTranslateKeyword } from "@/utils/translation/useTranslateKeyword";

interface CharacteristicItem {
  id?: string;
  name: string;
  name_es?: string;
  name_fr?: string;
  description: string;
  description_es?: string;
  description_fr?: string;
}

interface CharacteristicsTableProps {
  characteristics: CharacteristicItem[];
  isLoading: boolean;
  startEditing: (characteristic: CharacteristicItem) => void;
}

const CharacteristicsTable: React.FC<CharacteristicsTableProps> = ({ 
  characteristics, 
  isLoading,
  startEditing
}) => {
  const { language } = useLanguage();
  const { translateCharacteristic } = useTranslateKeyword();

  return (
    <div className="rounded border border-warcrow-gold/30 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-warcrow-accent hover:bg-warcrow-accent/90">
            <TableHead className="text-warcrow-gold">Characteristic</TableHead>
            <TableHead className="text-warcrow-gold">Description</TableHead>
            <TableHead className="text-warcrow-gold">Spanish Name</TableHead>
            <TableHead className="text-warcrow-gold">Spanish Desc</TableHead>
            <TableHead className="text-warcrow-gold">French Name</TableHead>
            <TableHead className="text-warcrow-gold">French Desc</TableHead>
            <TableHead className="text-warcrow-gold w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-warcrow-text/70">Loading...</TableCell>
            </TableRow>
          ) : characteristics.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-warcrow-text/70">No characteristics found</TableCell>
            </TableRow>
          ) : (
            characteristics.map((characteristic) => (
              <TableRow key={characteristic.id} className="hover:bg-warcrow-accent/5">
                <TableCell className="font-medium text-warcrow-text">
                  {language !== 'en' 
                    ? translateCharacteristic(characteristic.name, language) || characteristic.name
                    : characteristic.name}
                </TableCell>
                <TableCell className="max-w-xs truncate text-warcrow-text">{characteristic.description}</TableCell>
                <TableCell className={`text-warcrow-text ${(!characteristic.name_es || characteristic.name_es === characteristic.name) ? 'text-red-500' : ''}`}>
                  {characteristic.name_es ? (characteristic.name_es === characteristic.name ? '=' : '✓') : '—'}
                </TableCell>
                <TableCell className="text-warcrow-text">
                  {characteristic.description_es ? '✓' : '—'}
                </TableCell>
                <TableCell className={`text-warcrow-text ${(!characteristic.name_fr || characteristic.name_fr === characteristic.name) ? 'text-red-500' : ''}`}>
                  {characteristic.name_fr ? (characteristic.name_fr === characteristic.name ? '=' : '✓') : '—'}
                </TableCell>
                <TableCell className="text-warcrow-text">
                  {characteristic.description_fr ? '✓' : '—'}
                </TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => startEditing(characteristic)}
                  >
                    <Pencil className="h-4 w-4 text-warcrow-gold" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CharacteristicsTable;
