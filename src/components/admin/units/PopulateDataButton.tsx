
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Database, Upload, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { populateSupabaseData } from "@/utils/translation/populateSupabaseData";

const PopulateDataButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handlePopulate = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const result = await populateSupabaseData();
      if (result) {
        setIsComplete(true);
        toast.success("Successfully populated database with existing data");
      }
    } catch (error: any) {
      console.error("Error populating data:", error);
      toast.error(`Failed to populate data: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isComplete ? "default" : "outline"}
      className={isComplete ? "bg-green-600 hover:bg-green-700" : "border-warcrow-gold/50 text-warcrow-gold"}
      disabled={isLoading}
      onClick={handlePopulate}
    >
      {isLoading ? (
        <>
          <Upload className="h-4 w-4 mr-2 animate-spin" />
          Uploading Data...
        </>
      ) : isComplete ? (
        <>
          <CheckCircle className="h-4 w-4 mr-2" />
          Data Populated
        </>
      ) : (
        <>
          <Database className="h-4 w-4 mr-2" />
          Populate Data from App
        </>
      )}
    </Button>
  );
};

export default PopulateDataButton;
