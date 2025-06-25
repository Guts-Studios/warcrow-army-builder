
import { useAuth } from "@/components/auth/AuthProvider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

const ChangelogEditor = () => {
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
            <CardDescription>You need administrator privileges to edit the changelog.</CardDescription>
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
            <CardTitle className="text-warcrow-gold">Changelog Editor</CardTitle>
            <CardDescription>Edit and manage application changelog</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-warcrow-text">Changelog editor functionality would be implemented here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ChangelogEditor;
