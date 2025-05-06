
import React, { useRef, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bold, Italic, Underline, Highlighter, PaintBucket } from 'lucide-react';

interface ColorTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  id?: string;
}

interface ColorOption {
  name: string;
  color: string;
}

const colorOptions: ColorOption[] = [
  { name: 'Default', color: 'inherit' },
  { name: 'Gold', color: '#ffd700' },
  { name: 'Red', color: '#ea384c' },
  { name: 'Green', color: '#10b981' },
  { name: 'Blue', color: '#0ea5e9' },
  { name: 'Purple', color: '#8b5cf6' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Pink', color: '#ec4899' },
  { name: 'Gray', color: '#9f9ea1' },
];

export const ColorTextEditor: React.FC<ColorTextEditorProps> = ({
  value,
  onChange,
  placeholder,
  rows = 8,
  className = '',
  id,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedColor, setSelectedColor] = useState<string>('inherit');

  const getSelectedText = (): { text: string, start: number, end: number } => {
    if (!textareaRef.current) return { text: '', start: 0, end: 0 };
    
    const start = textareaRef.current.selectionStart;
    const end = textareaRef.current.selectionEnd;
    const text = value.substring(start, end);
    
    return { text, start, end };
  };

  const applyFormatting = (format: string) => {
    if (!textareaRef.current) return;
    
    const { text, start, end } = getSelectedText();
    if (!text) return;
    
    let formattedText = '';
    
    switch (format) {
      case 'bold':
        formattedText = `<strong>${text}</strong>`;
        break;
      case 'italic':
        formattedText = `<em>${text}</em>`;
        break;
      case 'underline':
        formattedText = `<u>${text}</u>`;
        break;
      case 'highlight':
        formattedText = `<mark>${text}</mark>`;
        break;
      case 'color':
        if (selectedColor === 'inherit') {
          formattedText = text; // Remove color formatting
        } else {
          formattedText = `<span style="color:${selectedColor}">${text}</span>`;
        }
        break;
      default:
        formattedText = text;
    }
    
    const newValue = value.substring(0, start) + formattedText + value.substring(end);
    onChange(newValue);
    
    // Reset focus to the textarea after applying formatting
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(start, start + formattedText.length);
      }
    }, 0);
  };

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    applyFormatting('color');
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-1 p-1 bg-black/30 rounded border border-warcrow-gold/20">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-warcrow-text"
          onClick={() => applyFormatting('bold')}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-warcrow-text"
          onClick={() => applyFormatting('italic')}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-warcrow-text"
          onClick={() => applyFormatting('underline')}
          title="Underline"
        >
          <Underline className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-warcrow-text"
          onClick={() => applyFormatting('highlight')}
          title="Highlight"
        >
          <Highlighter className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-warcrow-text"
              title="Text Color"
            >
              <PaintBucket className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0">
            <ScrollArea className="h-[200px]">
              <div className="p-2 grid grid-cols-3 gap-1">
                {colorOptions.map((option) => (
                  <Button
                    key={option.name}
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="flex items-center justify-start gap-2 px-2 py-1 h-auto"
                    onClick={() => handleColorSelect(option.color)}
                  >
                    <div
                      className="w-4 h-4 rounded-full border border-gray-300"
                      style={{ backgroundColor: option.color === 'inherit' ? 'transparent' : option.color }}
                    />
                    <span 
                      className="text-xs" 
                      style={{ color: option.color === 'inherit' ? 'inherit' : option.color }}
                    >
                      {option.name}
                    </span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>
      </div>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full border border-warcrow-gold/30 bg-black text-warcrow-text focus:border-warcrow-gold rounded-md p-2 ${className}`}
      />
    </div>
  );
};
