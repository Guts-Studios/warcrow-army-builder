
import { useState, useCallback } from 'react';
import { auditUnits, compareUnitById } from '@/utils/unitAudit';
import { toast } from 'sonner';

/**
 * Hook to provide unit auditing functionality
 * For development/administration use only
 */
export const useUnitAudit = () => {
  const [auditResults, setAuditResults] = useState<any>(null);
  const [isAuditing, setIsAuditing] = useState(false);
  
  const runAudit = useCallback(() => {
    setIsAuditing(true);
    try {
      const results = auditUnits();
      setAuditResults(results);
      toast.success("Unit audit complete", {
        description: `Found ${results.suspiciousUnits.length} units with potential issues`
      });
    } catch (error) {
      console.error("Error during unit audit:", error);
      toast.error("Unit audit failed", {
        description: "Check console for details"
      });
    } finally {
      setIsAuditing(false);
    }
  }, []);
  
  const checkUnitById = useCallback((unitId: string) => {
    try {
      const result = compareUnitById(unitId);
      toast.info(`Checked unit ${unitId}`, {
        description: Array.isArray(result) ? 
          `Found ${result.length} instances` : 
          `Found one instance: ${result?.name}`
      });
      return result;
    } catch (error) {
      console.error(`Error checking unit ${unitId}:`, error);
      toast.error("Unit check failed", {
        description: "Check console for details"
      });
      return null;
    }
  }, []);

  return {
    runAudit,
    checkUnitById,
    auditResults,
    isAuditing
  };
};

export default useUnitAudit;
