
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Plus } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface SymbolConfig {
  symbol: string;
  fontChar: string;
  color: string;
}

interface SymbolCreationFormProps {
  symbols: SymbolConfig[];
  onAddSymbol: (symbol: SymbolConfig) => void;
  showAddForm: boolean;
  setShowAddForm: (show: boolean) => void;
}

const SymbolCreationForm: React.FC<SymbolCreationFormProps> = ({
  symbols,
  onAddSymbol,
  showAddForm,
  setShowAddForm
}) => {
  // Form setup for creating new symbols
  const form = useForm({
    defaultValues: {
      symbol: "",
      fontChar: "",
      color: "#FFFFFF",
    },
  });

  const handleAddSymbol = (values: SymbolConfig) => {
    // Check if the fontChar already exists
    if (symbols.some(s => s.fontChar === values.fontChar)) {
      toast.error("A symbol with this font character already exists!");
      return;
    }

    // Add the new symbol
    onAddSymbol(values);
    form.reset();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-warcrow-text/90 text-sm font-medium">
          Available Game Symbols <span className="text-warcrow-text/60 text-xs font-normal">({symbols.length} symbols)</span>
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
    </div>
  );
};

export default SymbolCreationForm;
