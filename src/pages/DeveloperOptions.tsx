
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const DeveloperOptions = () => {
  const { isAuthenticated, isWabAdmin } = useAuth();

  if (!isAuthenticated || !isWabAdmin) {
    return (
      <div className="min-h-screen bg-warcrow-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-warcrow-gold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Access Required
            </CardTitle>
            <CardDescription>You need administrator privileges to access developer options.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warcrow-background p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-warcrow-gold">Developer Options</CardTitle>
            <CardDescription>Advanced development and debugging tools</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-warcrow-text">Developer options would be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DeveloperOptions;
