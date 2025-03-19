
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, Check, X, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeIn } from '@/lib/animations';
import { toast } from 'sonner';
import { Unit } from '@/types/game';
import { Textarea } from '@/components/ui/textarea';

interface ListMetadata {
  title?: string;
  faction?: string;
  commandPoints?: string;
  totalPoints?: string;
}

interface ListUploaderProps {
  playerId: string;
  onListUpload: (playerId: string, listContent: string, parsedUnits?: Unit[], listMetadata?: ListMetadata) => void;
  hasUploadedList: boolean;
}

const ListUploader: React.FC<ListUploaderProps> = ({ 
  playerId, 
  onListUpload,
  hasUploadedList
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [listText, setListText] = useState<string>('');
  const [isManualInput, setIsManualInput] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const parseList = (content: string): { units: Unit[], metadata: ListMetadata } => {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const units: Unit[] = [];
    const metadata: ListMetadata = {};
    
    if (lines.length > 0) {
      metadata.title = lines[0];
    }
    
    if (lines.length > 1) {
      metadata.faction = lines[1];
    }
    
    let foundCp = false;
    let foundPoints = false;
    
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i];
      
      const cpRegex = /(?:command\s*points?|cp)[\s:]*(\d+)/i;
      const cpMatch = line.match(cpRegex);
      
      if (!foundCp && (cpMatch || 
          line.toLowerCase().includes('command point') || 
          line.toLowerCase().includes(' cp ') ||
          line.match(/\bcp:?\s*\d+\b/i))) {
        
        if (cpMatch && cpMatch[1]) {
          metadata.commandPoints = cpMatch[1] + " CP";
        } else {
          let cpText = line;
          cpText = cpText.replace(/^.*?(\d+\s*(?:command\s*points?|cp))/i, '$1');
          cpText = cpText.replace(/(\d+\s*(?:command\s*points?|cp)).*$/i, '$1');
          cpText = cpText.replace(/(\d+)\s*(?:command\s*points?|cp)/i, '$1 CP');
          
          metadata.commandPoints = cpText;
        }
        
        foundCp = true;
        continue;
      }
      
      if (!foundPoints && 
          ((line.toLowerCase().includes('total') && line.toLowerCase().includes('point')) || 
           (line.toLowerCase().includes('pts') && line.toLowerCase().includes('total')) ||
           line.match(/\d+\s*(?:pts|points)\s*$/i))) {
        metadata.totalPoints = line;
        foundPoints = true;
        continue;
      }
      
      if (line.length < 3 || line.toUpperCase() === line && line.length < 8 || 
          line.includes('POINTS:') || line.includes('TOTAL:') ||
          line.includes('====') || line.includes('----') ||
          line.match(/^[+\-*•=]+$/) || line.match(/^\d+\.$/) ||
          line.toLowerCase() === 'units' || line.toLowerCase() === 'unit' ||
          line.match(/^(infantry|cavalry|artillery|monsters|heroes|characters)$/i)) {
        continue;
      }
      
      let unitName = line;
      
      unitName = unitName.replace(/\s+\d+\s*(?:pts|points|pt)/i, '');
      
      unitName = unitName.replace(/\s*\(.*?\)\s*/g, ' ');
      
      unitName = unitName.replace(/^\s*(?:\d+[.)]\s*|[•\-+*]\s*|\[\s*\d+\s*\]\s*)/g, '');
      
      unitName = unitName.replace(/[.:,;]+$/, '').trim();
      
      if (unitName && unitName.length >= 3) {
        if (unitName.length > 50) {
          unitName = unitName.substring(0, 47) + '...';
        }
        
        units.push({
          id: `unit-${playerId}-${i}`,
          name: unitName,
          player: playerId
        });
      }
    }
    
    return { units, metadata };
  };

  const processFile = (file: File) => {
    if (file.type !== 'text/plain' && 
        file.type !== 'application/json' && 
        !file.name.endsWith('.txt') && 
        !file.name.endsWith('.json')) {
      toast.error('Please upload a text or JSON file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const content = e.target.result.toString();
        setListText(content);
        
        const { units, metadata } = parseList(content);
        console.log('Parsed units:', units);
        console.log('Parsed metadata:', metadata);
        
        onListUpload(playerId, content, units, metadata);
        toast.success(`List uploaded successfully! Found ${units.length} units.`);
      }
    };
    reader.readAsText(file);
  };

  const handleManualSubmit = () => {
    if (listText.trim().length === 0) {
      toast.error('Please enter your list details');
      return;
    }
    
    const { units, metadata } = parseList(listText);
    
    onListUpload(playerId, listText, units, metadata);
    setIsManualInput(false);
    toast.success(`List saved successfully! Found ${units.length} units.`);
  };

  if (hasUploadedList && !isManualInput) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-green-800">List Uploaded</h3>
            <p className="text-xs text-green-600">Your army list has been saved</p>
          </div>
        </div>
        <button 
          onClick={() => setIsManualInput(true)}
          className="text-sm text-green-700 hover:text-green-800 underline flex items-center gap-1"
        >
          <Pencil className="w-3 h-3" />
          Edit
        </button>
      </motion.div>
    );
  }

  if (isManualInput) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className="border rounded-lg p-4 space-y-4"
      >
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Enter Army List</h3>
          <button
            onClick={() => setIsManualInput(false)}
            className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <Textarea
          value={listText}
          onChange={(e) => setListText(e.target.value)}
          className="w-full h-40 p-3 border rounded-md text-sm font-mono"
          placeholder="Paste or type your army list here..."
        />
        <div className="flex justify-end">
          <button
            onClick={handleManualSubmit}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium"
          >
            Save List
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-center transition-colors",
          isDragging ? "border-primary/70 bg-primary/5" : "border-muted hover:border-muted-foreground/50"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
          <Upload className="w-6 h-6 text-secondary-foreground/70" />
        </div>
        <h3 className="font-medium mb-1">Upload Army List</h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-xs">
          Drag and drop your list file or click to browse
        </p>
        <label className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium cursor-pointer">
          Select File
          <input
            type="file"
            className="hidden"
            accept=".txt,.json"
            onChange={handleFileInput}
          />
        </label>
        <p className="text-xs text-muted-foreground mt-3">
          Supports .txt and .json files
        </p>
      </div>
      <div className="flex justify-center">
        <button
          onClick={() => setIsManualInput(true)}
          className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <File className="w-4 h-4" />
          <span>Enter list manually</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ListUploader;
