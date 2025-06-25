
import { useAuth } from "@/components/auth/AuthProvider";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ManualCacheButton } from "@/components/cache/ManualCacheButton";
import { PerformanceOptimizer } from "@/components/performance/PerformanceOptimizer";

const Account = () => {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-warcrow-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Account Access</CardTitle>
            <CardDescription>Please log in to access your account.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warcrow-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-warcrow-gold">Account Settings</CardTitle>
            <CardDescription>Manage your account and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-warcrow-text mb-2">User Information</h3>
              <p className="text-warcrow-muted">Email: {user.email}</p>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleSignOut} variant="outline">
                Sign Out
              </Button>
              <ManualCacheButton />
            </div>
          </CardContent>
        </Card>

        <PerformanceOptimizer />
      </div>
    </div>
  );
};

export default Account;
