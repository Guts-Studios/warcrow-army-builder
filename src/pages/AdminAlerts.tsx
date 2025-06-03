
import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AdminOnly } from "@/utils/adminUtils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const AdminAlerts = () => {
  const navigate = useNavigate();
  const { isWabAdmin, isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Since there's no alerts table in the database, we'll simulate loading
    // In a real implementation, you would need to create an alerts table first
    setLoading(true);
    setTimeout(() => {
      setAlerts([]); // No alerts to show since table doesn't exist
      setLoading(false);
    }, 1000);
  }, []);

  const dismissAlert = async (id: string) => {
    // Placeholder function - would need alerts table to implement
    console.log("Would dismiss alert with id:", id);
    setAlerts(alerts.filter(alert => alert.id !== id));
  };

  return (
    <AdminOnly 
      isAuthenticated={isAuthenticated} 
      isWabAdmin={isWabAdmin} 
      fallback={null}
    >
      <div className="min-h-screen bg-warcrow-background text-warcrow-text p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/admin')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-warcrow-gold">Admin Alerts</h1>
            </div>
          </div>

          {loading ? (
            <div className="text-center">Loading alerts...</div>
          ) : (
            <div className="space-y-4">
              <Alert className="bg-blue-900/50 border-blue-600">
                <Bell className="h-4 w-4" />
                <AlertDescription className="text-blue-200">
                  Alert system is not yet configured. The alerts table needs to be created in the database to enable this functionality.
                </AlertDescription>
              </Alert>
              
              {alerts.length === 0 ? (
                <Alert className="bg-green-900/50 border-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-green-200">
                    No active alerts.
                  </AlertDescription>
                </Alert>
              ) : (
                alerts.map((alert) => (
                  <Card key={alert.id} className="bg-black/50 border border-warcrow-gold/30">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {alert.type === 'error' ? (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        ) : (
                          <Bell className="h-4 w-4 text-yellow-500" />
                        )}
                        <span>{alert.title}</span>
                      </CardTitle>
                      <CardDescription className="text-gray-400">{new Date(alert.created_at).toLocaleString()}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">{alert.message}</p>
                      <Button 
                        variant="destructive"
                        size="sm"
                        onClick={() => dismissAlert(alert.id)}
                        className="mt-4"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Dismiss
                      </Button>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </AdminOnly>
  );
};

export default AdminAlerts;
