
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuildFailureAlertProps {
  latestFailedBuild: any;
  isWabAdmin: boolean;
  isPreview: boolean;
  shownBuildFailureId: string | null;
}

export const BuildFailureAlert = ({ 
  latestFailedBuild, 
  isWabAdmin, 
  isPreview, 
  shownBuildFailureId 
}: BuildFailureAlertProps) => {
  // Only show build failure alert if certain conditions are met
  const shouldShowBuildFailure = 
    isWabAdmin && 
    latestFailedBuild && 
    latestFailedBuild.id && 
    latestFailedBuild.id !== shownBuildFailureId && 
    latestFailedBuild.created_at && 
    (new Date().getTime() - new Date(latestFailedBuild.created_at).getTime() < 24 * 60 * 60 * 1000) &&
    (latestFailedBuild.site_name === "warcrow-army-builder" || latestFailedBuild.site_name === "warcrowarmy.com");

  // Function to handle viewing a deployment
  const handleViewDeployment = (deployUrl: string) => {
    if (deployUrl) {
      window.open(deployUrl, '_blank');
    }
  };

  if (!shouldShowBuildFailure) {
    return null;
  }

  return (
    <Alert variant="destructive" className="bg-red-900/80 border-red-600 backdrop-blur-sm">
      <AlertTriangle className="h-4 w-4 text-red-400" />
      <AlertTitle className="text-red-200">
        Latest Build Failed
      </AlertTitle>
      <AlertDescription className="text-red-300 mt-1">
        <div className="mb-2">
          <p className="mb-1">{latestFailedBuild.site_name} ({latestFailedBuild.branch})</p>
          <Button 
            variant="link" 
            className="p-0 h-auto text-blue-300 hover:text-blue-200"
            onClick={() => handleViewDeployment(latestFailedBuild.deploy_url)}
          >
            View deployment details
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};
