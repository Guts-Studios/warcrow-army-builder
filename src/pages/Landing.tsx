
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Landing = () => {
  const { isAuthenticated, isWabAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-warcrow-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-warcrow-gold text-center text-3xl">
              Welcome to Warcrow Army Builder
            </CardTitle>
            <CardDescription className="text-center text-lg">
              Build and manage your Warcrow armies with ease
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/builder">Start Building</Link>
              </Button>
              
              {isAuthenticated && (
                <Button asChild variant="outline" size="lg">
                  <Link to="/profile">My Profile</Link>
                </Button>
              )}
              
              {!isAuthenticated && (
                <Button asChild variant="outline" size="lg">
                  <Link to="/login">Sign In</Link>
                </Button>
              )}
            </div>
            
            {isWabAdmin && (
              <div className="pt-4 border-t">
                <Button asChild variant="secondary">
                  <Link to="/admin">Admin Dashboard</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Landing;
