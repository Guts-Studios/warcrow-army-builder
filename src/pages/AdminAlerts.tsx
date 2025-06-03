import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { AdminOnly } from "@/utils/adminUtils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";

const AdminAlerts = () => {
  const navigate = useNavigate();
  const { isWabAdmin, isAuthenticated } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching alerts:", error);
        return;
      }

      setAlerts(data);
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = async (id: string) => {
    try {
      const { error } = await supabase
        .from('alerts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("Error dismissing alert:", error);
        return;
      }

      // Optimistically update the UI
      setAlerts(alerts.filter(alert => alert.id !== id));
    } catch (error) {
      console.error("Error dismissing alert:", error);
    }
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
