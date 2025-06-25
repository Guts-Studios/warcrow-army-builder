
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Users, Settings, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";

const Admin = () => {
  const { isAuthenticated, isWabAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-warcrow-background flex items-center justify-center">
        <div className="animate-pulse text-warcrow-gold">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || !isWabAdmin) {
    return (
      <div className="min-h-screen bg-warcrow-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-warcrow-gold flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Admin Access Required
            </CardTitle>
            <CardDescription>You need administrator privileges to access this page.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warcrow-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-warcrow-gold flex items-center gap-2">
              <Shield className="h-6 w-6" />
              Admin Dashboard
            </CardTitle>
            <CardDescription>Manage system settings and monitor application health</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button asChild variant="outline" className="h-24 flex-col gap-2">
              <Link to="/admin/users">
                <Users className="h-8 w-8" />
                User Management
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-24 flex-col gap-2">
              <Link to="/admin/alerts">
                <AlertTriangle className="h-8 w-8" />
                System Alerts
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="h-24 flex-col gap-2">
              <Link to="/admin/settings">
                <Settings className="h-8 w-8" />
                System Settings
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
