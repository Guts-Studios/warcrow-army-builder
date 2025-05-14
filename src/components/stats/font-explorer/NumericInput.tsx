
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface NumericInputProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  className?: string;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  min = 0,
  max = 100,
  step = 1,
  value,
  onChange,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState(value.toString());

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const parsed = parseFloat(newValue);
    if (!isNaN(parsed)) {
      // Ensure value is within bounds
      const constrained = Math.min(Math.max(parsed, min), max);
      onChange(constrained);
    }
  };

  const handleBlur = () => {
    const parsed = parseFloat(inputValue);
    if (isNaN(parsed)) {
      // Reset to current value if invalid input
      setInputValue(value.toString());
    } else {
      // Ensure value is within bounds
      const constrained = Math.min(Math.max(parsed, min), max);
      setInputValue(constrained.toString());
      onChange(constrained);
    }
  };

  return (
    <Input
      type="text"
      value={inputValue}
      onChange={handleChange}
      onBlur={handleBlur}
      className={className}
    />
  );
};
