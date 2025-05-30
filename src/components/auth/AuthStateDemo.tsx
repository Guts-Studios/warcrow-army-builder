
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Clock, XCircle } from 'lucide-react';

const AuthStateDemo = () => {
  const { isLoading, isAuthenticated, authReady } = useAuth();
  const [simulatedDelay, setSimulatedDelay] = useState(false);
  const [dataFetched, setDataFetched] = useState(false);

  // Simulate delayed auth resolution
  const simulateAuthDelay = () => {
    setSimulatedDelay(true);
    setDataFetched(false);
    
    setTimeout(() => {
      setSimulatedDelay(false);
      console.log("🧪 [AuthStateDemo] Simulated auth delay completed");
    }, 3000);
  };

  // Simulate data fetching when auth is ready
  useEffect(() => {
    if (authReady && !simulatedDelay) {
      console.log("🧪 [AuthStateDemo] Auth ready detected, simulating data fetch");
      setDataFetched(true);
    } else {
      setDataFetched(false);
    }
  }, [authReady, simulatedDelay]);

  const getStatusIcon = () => {
    if (isLoading || simulatedDelay) return <Clock className="h-5 w-5 text-yellow-500 animate-spin" />;
    if (authReady) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusText = () => {
    if (simulatedDelay) return "Simulating auth delay...";
    if (isLoading) return "Loading auth state...";
    if (authReady) return "Auth ready - data can be fetched";
    return "Auth not ready";
  };

  return (
    <Card className="w-full max-w-md mx-auto border-warcrow-gold/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-warcrow-gold">
          {getStatusIcon()}
          Auth State Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Auth Loading:</span>
            <span className={isLoading ? "text-yellow-500" : "text-green-500"}>
              {isLoading.toString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Authenticated:</span>
            <span className={isAuthenticated ? "text-green-500" : "text-red-500"}>
              {isAuthenticated?.toString() || "null"}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Auth Ready:</span>
            <span className={authReady ? "text-green-500" : "text-red-500"}>
              {authReady.toString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Data Fetched:</span>
            <span className={dataFetched ? "text-green-500" : "text-red-500"}>
              {dataFetched.toString()}
            </span>
          </div>
        </div>
        
        <div className="pt-2 border-t border-warcrow-gold/20">
          <p className="text-sm text-warcrow-text/70 mb-2">{getStatusText()}</p>
          <Button 
            onClick={simulateAuthDelay}
            disabled={simulatedDelay}
            className="w-full"
            variant="outline"
          >
            {simulatedDelay ? "Simulating..." : "Simulate Auth Delay"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthStateDemo;
