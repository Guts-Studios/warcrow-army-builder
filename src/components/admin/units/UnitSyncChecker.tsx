
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { findMissingUnits, generateFactionFileContent } from '@/utils/unitSyncUtility';
import { ApiUnit } from '@/types/army';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Clipboard, FilePen, AlertCircle, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UnitSyncChecker() {
  const [selectedFaction, setSelectedFaction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    onlyInDatabase: ApiUnit[];
    onlyInLocalData: any[];
    inBoth: Array<{ db: ApiUnit; local: any }>;
  } | null>(null);
  const [generatedCode, setGeneratedCode] = useState<{
    troopsFile: string;
    charactersFile: string;
    highCommandFile: string;
    mainFile: string;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<'compare' | 'generate'>('compare');

  const handleCheckSync = async () => {
    if (!selectedFaction) {
      toast.error('Please select a faction');
      return;
    }

    setIsLoading(true);
    try {
      const data = await findMissingUnits(selectedFaction);
      setResults(data);
    } catch (error: any) {
      toast.error(`Error checking units: ${error.message}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCode = async () => {
    if (!selectedFaction) {
      toast.error('Please select a faction');
      return;
    }

    setIsLoading(true);
    try {
      const code = await generateFactionFileContent(selectedFaction);
      setGeneratedCode(code as any);
      setActiveTab('generate');
    } catch (error: any) {
      toast.error(`Error generating code: ${error.message}`);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        toast.success(`Copied ${label} to clipboard`);
      },
      () => {
        toast.error('Failed to copy to clipboard');
      }
    );
  };

  return (
    <Card className="bg-warcrow-background border-warcrow-gold/30">
      <CardHeader>
        <CardTitle className="text-warcrow-gold">Unit Sync Checker</CardTitle>
        <CardDescription>
          Compare local unit data with Supabase database to find discrepancies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Select value={selectedFaction} onValueChange={setSelectedFaction}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Select faction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="northern-tribes">Northern Tribes</SelectItem>
                <SelectItem value="hegemony-of-embersig">Hegemony of Embersig</SelectItem>
                <SelectItem value="scions-of-yaldabaoth">Scions of Yaldabaoth</SelectItem>
                <SelectItem value="syenann">Syenann</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={handleCheckSync}
                disabled={isLoading || !selectedFaction}
                className="flex-1 sm:flex-none"
              >
                {isLoading && activeTab === 'compare' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FilePen className="h-4 w-4 mr-2" />
                )}
                Compare Data
              </Button>
              <Button
                onClick={handleGenerateCode}
                disabled={isLoading || !selectedFaction} 
                className="flex-1 sm:flex-none"
              >
                {isLoading && activeTab === 'generate' ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Clipboard className="h-4 w-4 mr-2" />
                )}
                Generate Code
              </Button>
            </div>
          </div>

          {/* Tabs for results and generated code */}
          <div className="flex border-b border-warcrow-gold/30">
            <button
              className={`px-4 py-2 ${
                activeTab === 'compare'
                  ? 'text-warcrow-gold border-b-2 border-warcrow-gold'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('compare')}
            >
              Comparison Results
            </button>
            <button
              className={`px-4 py-2 ${
                activeTab === 'generate'
                  ? 'text-warcrow-gold border-b-2 border-warcrow-gold'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab('generate')}
            >
              Generated Code
            </button>
          </div>

          {/* Tab content */}
          {activeTab === 'compare' && results && (
            <div className="space-y-6">
              {/* Missing in local data */}
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-amber-500" />
                  Units only in database ({results.onlyInDatabase.length})
                </h3>
                {results.onlyInDatabase.length > 0 ? (
                  <ScrollArea className="h-56 border rounded-md p-2">
                    {results.onlyInDatabase.map((unit) => (
                      <div 
                        key={unit.id} 
                        className="p-2 border-b last:border-0 flex justify-between items-center"
                      >
                        <div>
                          {unit.name}{' '}
                          <Badge variant="outline" className="ml-2">
                            {unit.points} pts
                          </Badge>
                        </div>
                        <Badge variant="destructive">Missing in local</Badge>
                      </div>
                    ))}
                  </ScrollArea>
                ) : (
                  <Alert className="bg-green-900/20 border-green-900/50">
                    <Check className="h-4 w-4 text-green-500" />
                    <AlertTitle>All good!</AlertTitle>
                    <AlertDescription>
                      No units are missing from your local data
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Missing in database */}
              <div>
                <h3 className="text-lg font-medium mb-2 flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 text-blue-500" />
                  Units only in local data ({results.onlyInLocalData.length})
                </h3>
                {results.onlyInLocalData.length > 0 ? (
                  <ScrollArea className="h-56 border rounded-md p-2">
                    {results.onlyInLocalData.map((unit) => (
                      <div 
                        key={unit.id} 
                        className="p-2 border-b last:border-0 flex justify-between items-center"
                      >
                        <div>
                          {unit.name}{' '}
                          <Badge variant="outline" className="ml-2">
                            {unit.pointsCost} pts
                          </Badge>
                        </div>
                        <Badge className="bg-blue-700">Missing in database</Badge>
                      </div>
                    ))}
                  </ScrollArea>
                ) : (
                  <Alert className="bg-green-900/20 border-green-900/50">
                    <Check className="h-4 w-4 text-green-500" />
                    <AlertTitle>All good!</AlertTitle>
                    <AlertDescription>
                      No units are missing from the database
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {activeTab === 'generate' && generatedCode && (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Troops File</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(generatedCode.troopsFile, 'troops file')}
                  >
                    <Clipboard className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <ScrollArea className="h-56 border rounded-md p-2 bg-black/20 font-mono text-sm">
                  <pre>{generatedCode.troopsFile}</pre>
                </ScrollArea>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Characters File</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(generatedCode.charactersFile, 'characters file')}
                  >
                    <Clipboard className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <ScrollArea className="h-56 border rounded-md p-2 bg-black/20 font-mono text-sm">
                  <pre>{generatedCode.charactersFile}</pre>
                </ScrollArea>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">High Command File</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(generatedCode.highCommandFile, 'high command file')}
                  >
                    <Clipboard className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <ScrollArea className="h-56 border rounded-md p-2 bg-black/20 font-mono text-sm">
                  <pre>{generatedCode.highCommandFile}</pre>
                </ScrollArea>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium">Main Faction File</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => copyToClipboard(generatedCode.mainFile, 'main faction file')}
                  >
                    <Clipboard className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <ScrollArea className="h-56 border rounded-md p-2 bg-black/20 font-mono text-sm">
                  <pre>{generatedCode.mainFile}</pre>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
