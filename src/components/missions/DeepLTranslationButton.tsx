
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Languages, Download } from "lucide-react";
import { populateAllTranslationsWithDeepL } from "@/utils/populateTranslationsWithDeepL";
import { toast } from "sonner";

export const DeepLTranslationButton = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleTranslate = async () => {
    setIsTranslating(true);
    setProgress(0);
    
    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);
      
      await populateAllTranslationsWithDeepL();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      toast.success('Translations completed! JSON files have been downloaded.');
    } catch (error) {
      console.error('Translation failed:', error);
      toast.error('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
      setTimeout(() => setProgress(0), 2000);
    }
  };

  return (
    <Card className="p-4 bg-warcrow-accent border-warcrow-gold/30">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-warcrow-gold mb-2">
            DeepL Translation Generator
          </h3>
          <p className="text-sm text-warcrow-text/80">
            Generate translations for all missions and feats using DeepL API. 
            This will create JSON files that you can upload to replace the empty translation files.
          </p>
        </div>
        
        {isTranslating && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span>Translating content...</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        
        <Button
          onClick={handleTranslate}
          disabled={isTranslating}
          className="w-full bg-warcrow-gold hover:bg-warcrow-gold/80 text-black"
        >
          {isTranslating ? (
            <>
              <Languages className="mr-2 h-4 w-4 animate-pulse" />
              Translating with DeepL...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Generate Translations with DeepL
            </>
          )}
        </Button>
        
        <div className="text-xs text-warcrow-text/60">
          <p>This will generate translations for:</p>
          <ul className="list-disc list-inside mt-1 space-y-1">
            <li>12 mission details (Spanish & French)</li>
            <li>5 feat details (Spanish & French)</li>
          </ul>
          <p className="mt-2">
            The generated JSON files will be automatically downloaded. 
            Upload them to replace the existing translation files.
          </p>
        </div>
      </div>
    </Card>
  );
};
