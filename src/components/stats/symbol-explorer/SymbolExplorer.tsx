
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SymbolGrid } from "./SymbolGrid";
import { SymbolDetails } from "./SymbolDetails";
import { GameSymbol } from "@/components/stats/GameSymbol";
import { Plus, Check } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SymbolConfig {
  symbol: string;
  fontChar: string;
  color: string;
}

const symbolConfigs: SymbolConfig[] = [
  { symbol: '🔴', fontChar: 'w', color: '#FF3850' }, // Red symbol
  { symbol: '🟠', fontChar: 'q', color: '#FF8C00' }, // Orange symbol
  { symbol: '🟢', fontChar: '9', color: '#22C55E' }, // Green symbol
  { symbol: '⚫', fontChar: '7', color: '#000000' }, // Black symbol
  { symbol: '🔵', fontChar: '8', color: '#3B82F6' }, // Blue symbol
  { symbol: '🟡', fontChar: '0', color: '#FACC15' }, // Yellow symbol
  { symbol: '⭐', fontChar: '1', color: '#FFD700' }, // Star symbol
];

const SymbolExplorer: React.FC = () => {
  const [fontSize, setFontSize] = useState<number>(48);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSymbolConfig, setSelectedSymbolConfig] = useState<SymbolConfig | null>(null);
  const [symbols, setSymbols] = useState<SymbolConfig[]>(symbolConfigs);
  const [showAddForm, setShowAddForm] = useState(false);

  // Form setup for creating new symbols
  const form = useForm({
    defaultValues: {
      symbol: "",
      fontChar: "",
      color: "#FFFFFF",
    },
  });

  const filteredSymbols = searchQuery
    ? symbols.filter((config) => {
        return (
          config.symbol.includes(searchQuery) || 
          config.fontChar.includes(searchQuery) ||
          config.color.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : symbols;

  useEffect(() => {
    if (symbols.length > 0 && !selectedSymbolConfig) {
      setSelectedSymbolConfig(symbols[0]);
    }
  }, [selectedSymbolConfig, symbols]);

  const handleAddSymbol = (values: SymbolConfig) => {
    // Check if the fontChar already exists
    if (symbols.some(s => s.fontChar === values.fontChar)) {
      toast.error("A symbol with this font character already exists!");
      return;
    }

    // Add the new symbol
    const newSymbols = [...symbols, values];
    setSymbols(newSymbols);
    setSelectedSymbolConfig(values);
    setShowAddForm(false);
    toast.success("New symbol added successfully!");
    form.reset();
  };

  return (
    <div className="space-y-6 bg-black p-6 rounded-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <h2 className="text-xl font-semibold text-warcrow-gold">Game Symbol Explorer</h2>
        <div className="relative w-full sm:w-64">
          <Input
            type="text"
            placeholder="Search symbols..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/40 border border-warcrow-gold/30 text-white focus:border-warcrow-gold"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-warcrow-text/90 text-sm font-medium">
                Available Game Symbols <span className="text-warcrow-text/60 text-xs font-normal">({filteredSymbols.length} symbols)</span>
              </h3>
              <Button 
                size="sm" 
                variant="outline" 
                className={`
                  ${showAddForm 
                    ? "bg-warcrow-gold/20 border-warcrow-gold text-warcrow-gold" 
                    : "bg-black/40 border-warcrow-gold/30 text-warcrow-text hover:bg-warcrow-gold/10"}
                `}
                onClick={() => setShowAddForm(!showAddForm)}
              >
                {showAddForm ? <Check className="h-4 w-4 mr-1" /> : <Plus className="h-4 w-4 mr-1" />}
                {showAddForm ? "Close Form" : "Add Symbol"}
              </Button>
            </div>
            
            {showAddForm && (
              <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20 mb-4">
                <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Create New Symbol</h4>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleAddSymbol)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="symbol"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-warcrow-text">Emoji Symbol</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="🔵" 
                                {...field} 
                                className="bg-black/60 border-warcrow-gold/30 text-warcrow-gold"
                                required
                              />
                            </FormControl>
                            <FormDescription className="text-warcrow-text/50 text-xs">
                              Emoji to represent this symbol
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="fontChar"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-warcrow-text">Font Character</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="a" 
                                {...field} 
                                className="bg-black/60 border-warcrow-gold/30 text-warcrow-gold"
                                maxLength={1}
                                required
                              />
                            </FormControl>
                            <FormDescription className="text-warcrow-text/50 text-xs">
                              Single character from Warcrow font
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="color"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-warcrow-text">Color</FormLabel>
                            <div className="flex space-x-2">
                              <FormControl>
                                <Input 
                                  type="color" 
                                  {...field} 
                                  className="w-12 h-10 p-1 bg-transparent"
                                />
                              </FormControl>
                              <Input 
                                type="text" 
                                value={field.value} 
                                onChange={field.onChange}
                                className="flex-1 bg-black/60 border-warcrow-gold/30 text-warcrow-gold"
                              />
                            </div>
                            <FormDescription className="text-warcrow-text/50 text-xs">
                              Symbol color in hex format
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="bg-warcrow-gold/20 border border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold/30"
                      >
                        Add Symbol
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>
            )}
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {filteredSymbols.map((config, index) => (
                <div
                  key={index}
                  className={`
                    p-3 rounded-md border transition-all cursor-pointer flex flex-col items-center
                    bg-[#F1F0FB] border-gray-300
                    ${selectedSymbolConfig === config 
                      ? "ring-2 ring-warcrow-gold" 
                      : "hover:bg-gray-200"}
                  `}
                  onClick={() => setSelectedSymbolConfig(config)}
                >
                  <div className="mb-2 flex items-center justify-center">
                    <span 
                      className="Warcrow-Family font-warcrow"
                      style={{ 
                        fontSize: `${fontSize}px`,
                        color: config.color
                      }}
                    >
                      {config.fontChar}
                    </span>
                  </div>
                  <div className="text-xs text-black text-center">{config.symbol}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div>
          {selectedSymbolConfig ? (
            <div className="bg-black/40 p-6 rounded-lg border border-warcrow-gold/30">
              <h3 className="text-warcrow-gold text-lg mb-4 font-medium">Symbol Details</h3>
              
              <div className="space-y-4">
                <div 
                  className="bg-[#F1F0FB] p-8 rounded-md border border-gray-300 flex items-center justify-center mb-4"
                  style={{ fontSize: `${fontSize * 1.5}px` }}
                >
                  <span 
                    className="Warcrow-Family font-warcrow"
                    style={{ color: selectedSymbolConfig.color }}
                  >
                    {selectedSymbolConfig.fontChar}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm text-warcrow-text/90 block mb-2">
                    Font Size
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {[24, 36, 48, 60, 72].map((size) => (
                      <Button 
                        key={size}
                        size="sm"
                        variant="outline"
                        onClick={() => setFontSize(size)}
                        className={`
                          ${fontSize === size 
                            ? "bg-warcrow-gold/20 border-warcrow-gold text-warcrow-gold" 
                            : "bg-black/40 border-warcrow-gold/30 text-warcrow-text hover:bg-warcrow-gold/10"}
                        `}
                      >
                        {size}px
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20">
                  <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Symbol Configuration</h4>
                  <div className="space-y-2 text-warcrow-text">
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-warcrow-text/60">Symbol:</span>
                      <span className="text-warcrow-gold col-span-2">{selectedSymbolConfig.symbol}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-warcrow-text/60">Font Character:</span>
                      <span className="text-warcrow-gold col-span-2">{selectedSymbolConfig.fontChar}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <span className="text-warcrow-text/60">Color:</span>
                      <span className="text-warcrow-gold col-span-2" style={{display: 'flex', alignItems: 'center'}}>
                        {selectedSymbolConfig.color}
                        <span className="inline-block w-4 h-4 ml-2 rounded-full" style={{backgroundColor: selectedSymbolConfig.color}}></span>
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 p-4 rounded-lg border border-warcrow-gold/20">
                  <h4 className="text-warcrow-gold/90 text-sm mb-3 font-medium">Usage Code</h4>
                  <div className="space-y-2">
                    <pre className="bg-black/60 p-3 rounded text-warcrow-gold block overflow-x-auto text-xs whitespace-pre-wrap">
                      {`{ symbol: '${selectedSymbolConfig.symbol}', fontChar: '${selectedSymbolConfig.fontChar}', color: '${selectedSymbolConfig.color}' },`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-black/40 p-8 rounded-lg border border-warcrow-gold/30 text-center">
              <p className="text-warcrow-text/80">Select a symbol to see details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SymbolExplorer;
