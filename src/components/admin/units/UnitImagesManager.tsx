
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Check, X, AlertCircle, ExternalLink, Copy, Clipboard, ClipboardCheck, Save, History } from "lucide-react";
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const UnitImagesManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterFaction, setFilterFaction] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('portraits');
  const [imageResults, setImageResults] = useState<Record<string, {exists: boolean, url: string}>>({});
  const [filteredUnits, setFilteredUnits] = useState<any[]>([]);
  const [allUnits, setAllUnits] = useState<any[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [copiedPaths, setCopiedPaths] = useState<Record<string, boolean>>({});
  const [savingResults, setSavingResults] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [validationHistory, setValidationHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<any>(null);
  const { t, language } = useLanguage();
  
  const factions = [
    { id: 'all', name: 'All Factions' },
    { id: 'hegemony-of-embersig', name: 'Hegemony' },
    { id: 'northern-tribes', name: 'Northern Tribes' },
    { id: 'scions-of-yaldabaoth', name: 'Scions of Yaldabaoth' },
    { id: 'syenann', name: 'Syenann' },
  ];

  // Load units from Supabase
  useEffect(() => {
    const fetchUnits = async () => {
      const { data, error } = await supabase
        .from('unit_data')
        .select('*');

      if (error) {
        console.error('Error fetching units:', error);
        toast.error('Failed to load units from database');
        return;
      }

      console.log(`Loaded ${data.length} units from database`);
      setAllUnits(data);
    };

    fetchUnits();
  }, []);

  useEffect(() => {
    // Filter units based on search term and selected faction
    if (allUnits.length === 0) return;
    
    let filtered = [...allUnits];
    
    if (filterFaction !== 'all') {
      filtered = filtered.filter(unit => unit.faction === filterFaction);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(unit => 
        unit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        unit.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredUnits(filtered);
  }, [searchTerm, filterFaction, allUnits]);

  // Improved function to clean unit names for file naming
  const cleanUnitName = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^\w-]/g, '')
      .replace(/ć/g, 'c')
      .replace(/í/g, 'i')
      .replace(/á/g, 'a')
      .replace(/é/g, 'e');
  };

  // Reset copy status after 2 seconds
  const resetCopyStatus = (unitId: string) => {
    setTimeout(() => {
      setCopiedPaths(prev => ({
        ...prev,
        [unitId]: false
      }));
    }, 2000);
  };

  // Enhanced image checking that handles errors properly
  const checkImageExists = async (url: string): Promise<boolean> => {
    try {
      // Use a different approach to verify image existence
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        
        // Set a timeout to handle cases where image loading hangs
        setTimeout(() => resolve(false), 3000);
      });
    } catch (error) {
      console.error(`Error checking image at ${url}:`, error);
      return false;
    }
  };

  const verifyUnitImages = async () => {
    setLoadingImages(true);
    const results: Record<string, {exists: boolean, url: string}> = {};
    let missingCount = 0;
    
    for (const unit of filteredUnits) {
      const unitId = unit.id;
      let imageUrl = '';
      
      // Special handling for units known to have issues
      const isSpecialCase = unit.name.includes('Lady Télia') || unit.name.includes('Drago');
      
      if (activeTab === 'portraits') {
        // Check portrait images
        imageUrl = `/art/portrait/${cleanUnitName(unit.name)}_portrait.jpg`;
      } else {
        // Check card images
        const baseUrl = unit.imageUrl || `/art/card/${cleanUnitName(unit.name)}_card.jpg`;
        imageUrl = baseUrl;
        
        // If checking cards and language is not English, check language-specific cards
        if (activeTab === 'cards-es' || activeTab === 'cards-fr') {
          const langSuffix = activeTab === 'cards-es' ? '_sp' : '_fr';
          if (imageUrl.endsWith('.jpg')) {
            imageUrl = imageUrl.replace('.jpg', `${langSuffix}.jpg`);
          } else if (imageUrl.endsWith('_card.jpg')) {
            imageUrl = imageUrl.replace('_card.jpg', `_card${langSuffix}.jpg`);
          }
        }
      }
      
      // Special case handling to ensure accurate results
      if (isSpecialCase) {
        console.log(`Checking special case unit: ${unit.name} with URL: ${imageUrl}`);
      }
      
      const exists = await checkImageExists(imageUrl);
      
      if (!exists) {
        missingCount++;
      }
      
      results[unitId] = {
        url: imageUrl,
        exists: exists
      };
    }
    
    setImageResults(results);
    
    // Notify the user about the verification results
    if (missingCount > 0) {
      toast.warning(`Found ${missingCount} units with missing images out of ${filteredUnits.length} total`);
    } else if (filteredUnits.length > 0) {
      toast.success(`All ${filteredUnits.length} unit images verified successfully`);
    }
    
    setLoadingImages(false);
  };

  const saveValidationResults = async () => {
    if (Object.keys(imageResults).length === 0) {
      toast.error("No validation results to save");
      return;
    }
    
    setSavingResults(true);
    
    try {
      // Count missing images
      let missingCount = 0;
      Object.values(imageResults).forEach(result => {
        if (!result.exists) missingCount++;
      });
      
      const { data, error } = await supabase
        .from('image_validations')
        .insert({
          validation_type: activeTab,
          results: imageResults,
          total_units: filteredUnits.length,
          missing_units: missingCount
        })
        .select();
        
      if (error) {
        console.error('Error saving validation results:', error);
        toast.error('Failed to save validation results');
        return;
      }
      
      toast.success('Validation results saved successfully');
      console.log('Saved validation results:', data);
    } catch (err) {
      console.error('Error in saveValidationResults:', err);
      toast.error('An error occurred while saving validation results');
    } finally {
      setSavingResults(false);
    }
  };

  const loadValidationHistory = async () => {
    setLoadingHistory(true);
    
    try {
      const { data, error } = await supabase
        .from('image_validations')
        .select('*')
        .order('validation_date', { ascending: false });
        
      if (error) {
        console.error('Error loading validation history:', error);
        toast.error('Failed to load validation history');
        return;
      }
      
      setValidationHistory(data || []);
      setHistoryOpen(true);
    } catch (err) {
      console.error('Error in loadValidationHistory:', err);
      toast.error('An error occurred while loading validation history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const viewHistoryDetails = (item: any) => {
    setSelectedHistoryItem(item);
  };

  const copyToClipboard = (text: string, unitId: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Update copy status for this specific unit
        setCopiedPaths(prev => ({
          ...prev,
          [unitId]: true
        }));
        
        toast.success("Path copied to clipboard");
        resetCopyStatus(unitId);
      })
      .catch(err => toast.error("Failed to copy: " + err));
  };

  const getImageStatus = (unit: any) => {
    if (!imageResults[unit.id]) {
      return null;
    }
    
    return imageResults[unit.id].exists ? (
      <div className="flex items-center text-green-500">
        <Check className="h-4 w-4 mr-1" /> 
        <span>Available</span>
      </div>
    ) : (
      <div className="flex items-center text-red-500">
        <X className="h-4 w-4 mr-1" /> 
        <span>Missing</span>
      </div>
    );
  };

  const getTabTitle = () => {
    switch(activeTab) {
      case 'portraits': return 'Unit Portraits';
      case 'cards': return 'Card Images (English)';
      case 'cards-es': return 'Card Images (Spanish)';
      case 'cards-fr': return 'Card Images (French)';
      default: return 'Unit Images';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const renderHistoryDialog = () => (
    <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
      <DialogContent className="sm:max-w-3xl bg-warcrow-background border-warcrow-gold/30 text-warcrow-text">
        <DialogHeader>
          <DialogTitle className="text-warcrow-gold">Validation History</DialogTitle>
        </DialogHeader>
        
        {loadingHistory ? (
          <div className="p-8 text-center">Loading history...</div>
        ) : (
          <div className="space-y-4">
            {selectedHistoryItem ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-warcrow-gold text-lg">
                    {selectedHistoryItem.validation_type === 'portraits' ? 'Portraits' : 
                      selectedHistoryItem.validation_type === 'cards' ? 'Cards (EN)' :
                      selectedHistoryItem.validation_type === 'cards-es' ? 'Cards (ES)' : 'Cards (FR)'} Validation
                  </h3>
                  <Button
                    variant="outline"
                    className="border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
                    onClick={() => setSelectedHistoryItem(null)}
                  >
                    Back to List
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm bg-black/40 p-3 rounded">
                  <div>Date: <span className="text-warcrow-gold">{formatDate(selectedHistoryItem.validation_date)}</span></div>
                  <div>Total Units: <span className="text-warcrow-gold">{selectedHistoryItem.total_units}</span></div>
                  <div>Missing Images: <span className="text-warcrow-gold">{selectedHistoryItem.missing_units}</span></div>
                  <div>Success Rate: <span className="text-warcrow-gold">
                    {Math.round(((selectedHistoryItem.total_units - selectedHistoryItem.missing_units) / selectedHistoryItem.total_units) * 100)}%
                  </span></div>
                </div>
                
                <ScrollArea className="h-[400px] rounded border border-warcrow-gold/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-black/60">
                        <TableHead>Unit ID</TableHead>
                        <TableHead>Image Path</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(selectedHistoryItem.results).map(([unitId, result]: [string, any]) => (
                        <TableRow key={unitId} className="hover:bg-warcrow-gold/5">
                          <TableCell className="font-mono text-xs">{unitId}</TableCell>
                          <TableCell className="max-w-[300px] truncate">{result.url}</TableCell>
                          <TableCell>
                            {result.exists ? (
                              <div className="flex items-center text-green-500">
                                <Check className="h-4 w-4 mr-1" /> 
                                <span>Available</span>
                              </div>
                            ) : (
                              <div className="flex items-center text-red-500">
                                <X className="h-4 w-4 mr-1" /> 
                                <span>Missing</span>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
            ) : (
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-black/60">
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Total Units</TableHead>
                      <TableHead>Missing</TableHead>
                      <TableHead>Success Rate</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {validationHistory.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4">
                          No validation history found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      validationHistory.map(item => (
                        <TableRow key={item.id} className="hover:bg-warcrow-gold/5">
                          <TableCell>{formatDate(item.validation_date)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {item.validation_type === 'portraits' ? 'Portraits' : 
                                item.validation_type === 'cards' ? 'Cards (EN)' :
                                item.validation_type === 'cards-es' ? 'Cards (ES)' : 'Cards (FR)'}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.total_units}</TableCell>
                          <TableCell>{item.missing_units}</TableCell>
                          <TableCell>
                            {Math.round(((item.total_units - item.missing_units) / item.total_units) * 100)}%
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
                              onClick={() => viewHistoryDetails(item)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold text-warcrow-gold">Unit Image Validator</h2>
        <p className="text-warcrow-text/80">
          Verify if unit portraits and card images are properly linked and available.
        </p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search units..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-black/20 border-warcrow-gold/30"
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={filterFaction} onValueChange={setFilterFaction}>
              <SelectTrigger className="bg-black/20 border-warcrow-gold/30">
                <SelectValue placeholder="Select Faction" />
              </SelectTrigger>
              <SelectContent>
                {factions.map(faction => (
                  <SelectItem key={faction.id} value={faction.id}>
                    {faction.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={verifyUnitImages}
            disabled={loadingImages}
            className="bg-warcrow-gold text-black hover:bg-warcrow-gold/90"
          >
            {loadingImages ? 'Checking Images...' : 'Verify Images'}
          </Button>
          <Button
            onClick={saveValidationResults}
            disabled={savingResults || Object.keys(imageResults).length === 0}
            className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold/10"
            variant="outline"
          >
            <Save className="h-4 w-4 mr-2" />
            {savingResults ? 'Saving...' : 'Save Results'}
          </Button>
          <Button
            onClick={loadValidationHistory}
            disabled={loadingHistory}
            className="border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold/10"
            variant="outline"
          >
            <History className="h-4 w-4 mr-2" />
            {loadingHistory ? 'Loading...' : 'View History'}
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 bg-black/50 border border-warcrow-gold/30">
            <TabsTrigger value="portraits">Portraits</TabsTrigger>
            <TabsTrigger value="cards">Cards (EN)</TabsTrigger>
            <TabsTrigger value="cards-es">Cards (ES)</TabsTrigger>
            <TabsTrigger value="cards-fr">Cards (FR)</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="pt-4">
            <Card className="bg-black/50 border-warcrow-gold/30">
              <CardHeader>
                <CardTitle>{getTabTitle()}</CardTitle>
                <CardDescription>
                  {activeTab === 'portraits' 
                    ? 'Verify portrait images used in unit cards and lists.' 
                    : 'Verify card art images used in detailed unit views.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border border-warcrow-gold/20">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-black/60">
                        <TableHead>Unit Name (ID)</TableHead>
                        <TableHead>Faction</TableHead>
                        <TableHead className="min-w-[300px]">Image Path</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUnits.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No units found. Adjust your search or faction filter.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredUnits.map(unit => (
                          <TableRow key={unit.id} className="hover:bg-warcrow-gold/5">
                            <TableCell>
                              <div>{unit.name}</div>
                              <div className="text-xs text-warcrow-text/60 font-mono mt-1">{unit.id}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {unit.faction.replace(/-/g, ' ')}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[300px] group">
                              <div className="flex items-center space-x-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div className="overflow-hidden text-ellipsis whitespace-nowrap max-w-[240px] hover:text-warcrow-gold">
                                        {imageResults[unit.id]?.url || 'Not verified'}
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="bottom" className="bg-black/90 border-warcrow-gold/20 text-warcrow-text p-2 break-all max-w-[400px]">
                                      {imageResults[unit.id]?.url || 'Not verified'}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                {imageResults[unit.id]?.url && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-warcrow-gold/70 hover:text-warcrow-gold hover:bg-warcrow-gold/10"
                                    onClick={() => copyToClipboard(imageResults[unit.id].url, unit.id)}
                                    title="Copy path to clipboard"
                                  >
                                    {copiedPaths[unit.id] ? 
                                      <ClipboardCheck className="h-4 w-4" /> : 
                                      <Clipboard className="h-4 w-4" />}
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {getImageStatus(unit) || (
                                <span className="text-warcrow-text/50">Not checked</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 border-warcrow-gold/30 text-warcrow-gold hover:bg-warcrow-gold/10"
                                onClick={() => {
                                  if (imageResults[unit.id]?.url) {
                                    window.open(imageResults[unit.id].url, '_blank');
                                  }
                                }}
                                disabled={!imageResults[unit.id]?.exists}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Card className="bg-black/50 border-warcrow-gold/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" /> 
            Image Naming Conventions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-warcrow-gold">Portrait Images:</h3>
              <p className="text-warcrow-text/80 mt-1">
                Portrait images should follow the naming convention: <code className="bg-black/30 px-1 rounded">/art/portrait/unit_name_portrait.jpg</code>
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-warcrow-gold">Card Images:</h3>
              <p className="text-warcrow-text/80 mt-1">
                Card images should follow the naming convention: <code className="bg-black/30 px-1 rounded">/art/card/unit_name_card.jpg</code>
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-warcrow-gold">Localized Card Images:</h3>
              <p className="text-warcrow-text/80 mt-1">
                Spanish: <code className="bg-black/30 px-1 rounded">/art/card/unit_name_card_sp.jpg</code><br />
                French: <code className="bg-black/30 px-1 rounded">/art/card/unit_name_card_fr.jpg</code>
              </p>
            </div>
            
            <div className="text-warcrow-text/80 bg-black/30 p-3 rounded mt-2">
              <strong>Note:</strong> Unit names in file paths should be lowercase with spaces replaced by underscores,
              and special characters removed (e.g., "Prime Warrior" becomes "prime_warrior").
            </div>
          </div>
        </CardContent>
      </Card>
      
      {renderHistoryDialog()}
    </div>
  );
};

export default UnitImagesManager;
