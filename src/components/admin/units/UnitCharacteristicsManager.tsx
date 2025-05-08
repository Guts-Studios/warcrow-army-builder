import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Languages, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { batchTranslate } from "@/utils/translation/batchTranslate";

// Define the interface for the characteristics
export interface CharacteristicItem {
  id: string;
  name: string;
  description: string;
  description_es?: string;
  description_fr?: string;
  created_at?: string;
  updated_at?: string;
}

const UnitCharacteristicsManager: React.FC = () => {
  const [characteristics, setCharacteristics] = useState<CharacteristicItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCharacteristic, setSelectedCharacteristic] = useState<CharacteristicItem | null>(null);
  const { language } = useLanguage();
  
  useEffect(() => {
    fetchCharacteristics();
  }, []);
  
  const fetchCharacteristics = async () => {
    setIsLoading(true);
    try {
      // Use the newly created unit_characteristics table
      const { data, error } = await supabase
        .from('unit_characteristics')
        .select('*')
        .order('name');
        
      if (error) throw error;
      
      setCharacteristics(data as CharacteristicItem[]);
    } catch (error: any) {
      console.error("Error fetching characteristics:", error);
      toast.error(`Failed to load characteristics: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('unit_characteristics')
        .insert({ 
          name, 
          description 
        });
        
      if (error) throw error;
      
      toast.success("Characteristic created successfully");
      setOpen(false);
      setName('');
      setDescription('');
      fetchCharacteristics();
    } catch (error: any) {
      console.error("Error creating characteristic:", error);
      toast.error(`Failed to create characteristic: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (characteristic: CharacteristicItem) => {
    setSelectedCharacteristic(characteristic);
    setName(characteristic.name);
    setDescription(characteristic.description);
    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (!selectedCharacteristic) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('unit_characteristics')
        .update({ 
          name, 
          description 
        })
        .eq('id', selectedCharacteristic.id);
        
      if (error) throw error;
      
      toast.success("Characteristic updated successfully");
      setEditOpen(false);
      setName('');
      setDescription('');
      setSelectedCharacteristic(null);
      fetchCharacteristics();
    } catch (error: any) {
      console.error("Error updating characteristic:", error);
      toast.error(`Failed to update characteristic: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('unit_characteristics')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success("Characteristic deleted successfully");
      fetchCharacteristics();
    } catch (error: any) {
      console.error("Error deleting characteristic:", error);
      toast.error(`Failed to delete characteristic: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async () => {
    if (!selectedCharacteristic) return;

    setIsLoading(true);
    try {
      // Translate using batchTranslate
      const itemsToTranslate = [{
        id: selectedCharacteristic.id,
        key: 'description',
        source: selectedCharacteristic.description
      }];
      
      const translatedItems = await batchTranslate(itemsToTranslate, language, true, 'unit_characteristics');
      
      if (translatedItems && translatedItems.length > 0) {
        toast.success("Characteristic translated successfully");
        fetchCharacteristics();
      } else {
        toast.error("Translation failed");
      }
    } catch (error: any) {
      console.error("Error translating characteristic:", error);
      toast.error(`Translation failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-4 space-y-4 border border-warcrow-gold/30 shadow-sm bg-black">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-warcrow-gold">Unit Characteristics</h2>
        <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="border-warcrow-gold/30 text-warcrow-gold hover:border-warcrow-gold/50">
          <Plus className="h-4 w-4 mr-2" />
          Add Characteristic
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow className="bg-black/30">
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {characteristics.map((characteristic) => (
            <TableRow key={characteristic.id}>
              <TableCell className="font-medium">{characteristic.name}</TableCell>
              <TableCell className="text-warcrow-text/80">{characteristic.description}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => handleEdit(characteristic)} className="text-warcrow-gold hover:bg-warcrow-accent/10">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(characteristic.id)} className="text-red-500 hover:bg-warcrow-accent/10">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    setSelectedCharacteristic(characteristic);
                    handleTranslate();
                  }} 
                  className="text-warcrow-gold hover:bg-warcrow-accent/10"
                >
                  <Languages className="h-4 w-4 mr-2" />
                  Translate
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black border border-warcrow-gold/30">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">Create Characteristic</DialogTitle>
            <DialogDescription className="text-warcrow-text">
              Add a new unit characteristic to the database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-warcrow-text">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 border-warcrow-gold/30 bg-black text-warcrow-text" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-warcrow-text">
                Description
              </Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 border-warcrow-gold/30 bg-black text-warcrow-text" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="border-warcrow-gold/30 text-warcrow-gold hover:border-warcrow-gold/50">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleCreate} disabled={isLoading} className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black">
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[425px] bg-black border border-warcrow-gold/30">
          <DialogHeader>
            <DialogTitle className="text-warcrow-gold">Edit Characteristic</DialogTitle>
            <DialogDescription className="text-warcrow-text">
              Edit an existing unit characteristic in the database.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right text-warcrow-text">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3 border-warcrow-gold/30 bg-black text-warcrow-text" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right text-warcrow-text">
                Description
              </Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3 border-warcrow-gold/30 bg-black text-warcrow-text" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" className="border-warcrow-gold/30 text-warcrow-gold hover:border-warcrow-gold/50">Cancel</Button>
            </DialogClose>
            <Button type="submit" onClick={handleUpdate} disabled={isLoading} className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black">
              Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default UnitCharacteristicsManager;
