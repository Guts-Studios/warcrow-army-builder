
import React, { useState, useEffect } from "react";

interface NumericInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  hexadecimal?: boolean;
}

export const NumericInput: React.FC<NumericInputProps> = ({
  value,
  onChange,
  placeholder,
  className = "",
  hexadecimal = false,
}) => {
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    if (hexadecimal) {
      // Allow only hexadecimal characters
      if (/^[0-9A-Fa-f]*$/.test(newValue)) {
        setInternalValue(newValue);
        onChange(newValue);
      }
    } else {
      // Allow only numbers
      if (/^[0-9]*$/.test(newValue)) {
        setInternalValue(newValue);
        onChange(newValue);
      }
    }
  };

  return (
    <input
      type="text"
      value={internalValue}
      onChange={handleChange}
      placeholder={placeholder}
      className={`p-2 bg-black/60 border border-warcrow-gold/40 rounded text-warcrow-text focus:border-warcrow-gold/80 focus:outline-none ${className}`}
    />
  );
};
