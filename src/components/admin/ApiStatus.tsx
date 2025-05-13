import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoaderIcon, CheckCircle2, AlertCircle, XCircle, InfoIcon, BarChart } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { checkPatreonApiStatus, getPatreonCampaignUrl } from "@/utils/patreonUtils";

type ApiStatus = 'operational' | 'degraded' | 'down' | 'unknown';

interface ApiStatusItem {
  name: string;
  status: ApiStatus;
  latency?: number;
  lastChecked: Date;
}

interface DeepLUsageStats {
  character_count: number;
  character_limit: number;
}

const ApiStatus: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingUsage, setIsLoadingUsage] = useState<boolean>(false);
  const [apiStatuses, setApiStatuses] = useState<ApiStatusItem[]>([
    {
      name: 'DeepL Translation API',
      status: 'unknown',
      lastChecked: new Date()
    },
    {
      name: 'Supabase Database',
      status: 'unknown',
      lastChecked: new Date()
    },
    {
      name: 'Netlify Deployment API',
      status: 'unknown',
      lastChecked: new Date()
    },
    {
      name: 'Patreon API',
      status: 'unknown',
      lastChecked: new Date()
    }
  ]);
  const [deepLUsage, setDeepLUsage] = useState<DeepLUsageStats | null>(null);

  // Test DeepL API connection
  const testDeepLApi = async () => {
    try {
      const startTime = performance.now();
      
      const { data, error } = await supabase.functions.invoke("deepl-translate", {
        body: {
          texts: ["Quick test of DeepL API connection"],
          targetLanguage: "ES",
          formality: "default"
        }
      });
      
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      if (error) {
        throw error;
      }
      
      return {
        status: data && data.translations ? 'operational' as ApiStatus : 'degraded' as ApiStatus,
        latency
      };
    } catch (error) {
      console.error("DeepL API test failed:", error);
      return { status: 'down' as ApiStatus };
    }
  };

  // Fetch DeepL usage statistics
  const fetchDeepLUsage = async () => {
    setIsLoadingUsage(true);
    try {
      const { data, error } = await supabase.functions.invoke("deepl-usage-stats", {});
      
      if (error) {
        console.error("Error fetching DeepL usage stats:", error);
        return null;
      }
      
      setDeepLUsage(data as DeepLUsageStats);
      return data;
    } catch (error) {
      console.error("Failed to fetch DeepL usage:", error);
      return null;
    } finally {
      setIsLoadingUsage(false);
    }
  };

  // Test Supabase connection
  const testSupabaseConnection = async () => {
    try {
      const startTime = performance.now();
      
      // Simple query to test database connection
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      if (error) {
        throw error;
      }
      
      return {
        status: 'operational' as ApiStatus,
        latency
      };
    } catch (error) {
      console.error("Supabase connection test failed:", error);
      return { status: 'down' as ApiStatus };
    }
  };

  // Test Netlify API connection
  const testNetlifyConnection = async () => {
    try {
      const startTime = performance.now();
      
      // Using our existing edge function to check Netlify API
      const { data, error } = await supabase.functions.invoke("get-netlify-deployments", {});
      
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      if (error) {
        throw error;
      }
      
      return {
        status: 'operational' as ApiStatus,
        latency
      };
    } catch (error) {
      console.error("Netlify API test failed:", error);
      return { status: 'down' as ApiStatus };
    }
  };

  // Test Patreon API connection
  const testPatreonConnection = async () => {
    try {
      const startTime = performance.now();
      
      const result = await checkPatreonApiStatus();
      
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      return {
        status: result.status === 'operational' ? 'operational' as ApiStatus : 'down' as ApiStatus,
        latency
      };
    } catch (error) {
      console.error("Patreon API test failed:", error);
      return { status: 'down' as ApiStatus };
    }
  };

  // Refresh all API statuses
  const refreshApiStatuses = async () => {
    setIsLoading(true);
    
    try {
      // Run all tests in parallel
      const [deepLStatus, supabaseStatus, netlifyStatus, patreonStatus] = await Promise.all([
        testDeepLApi(),
        testSupabaseConnection(),
        testNetlifyConnection(),
        testPatreonConnection()
      ]);
      
      const now = new Date();
      
      setApiStatuses([
        {
          name: 'DeepL Translation API',
          status: deepLStatus.status,
          latency: deepLStatus.latency,
          lastChecked: now
        },
        {
          name: 'Supabase Database',
          status: supabaseStatus.status,
          latency: supabaseStatus.latency,
          lastChecked: now
        },
        {
          name: 'Netlify Deployment API',
          status: netlifyStatus.status,
          latency: netlifyStatus.latency,
          lastChecked: now
        },
        {
          name: 'Patreon API',
          status: patreonStatus.status,
          latency: patreonStatus.latency,
          lastChecked: now
        }
      ]);
      
      // Also update DeepL usage stats
      fetchDeepLUsage();
      
      toast.success("API status check complete");
    } catch (error) {
      console.error("Error checking API statuses:", error);
      toast.error("Failed to check one or more API statuses");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial check on component mount
  useEffect(() => {
    refreshApiStatuses();
  }, []);

  // Helper to render status badge
  const renderStatusBadge = (status: ApiStatus) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-600 hover:bg-green-600/90"><CheckCircle2 className="h-3 w-3 mr-1" /> Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-600 hover:bg-yellow-600/90"><AlertCircle className="h-3 w-3 mr-1" /> Degraded</Badge>;
      case 'down':
        return <Badge className="bg-red-600 hover:bg-red-600/90"><XCircle className="h-3 w-3 mr-1" /> Down</Badge>;
      default:
        return <Badge className="bg-slate-600 hover:bg-slate-600/90"><InfoIcon className="h-3 w-3 mr-1" /> Unknown</Badge>;
    }
  };

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  // Format numbers with commas
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <Card className="border border-warcrow-gold/40 shadow-sm bg-black">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg text-warcrow-gold">API Status</CardTitle>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshApiStatuses} 
            disabled={isLoading}
            className="border-warcrow-gold/30 text-warcrow-gold"
          >
            {isLoading ? <LoaderIcon className="h-4 w-4 mr-2 animate-spin" /> : <LoaderIcon className="h-4 w-4 mr-2" />}
            Refresh
          </Button>
        </div>
        <p className="text-warcrow-text/80 text-sm">
          Monitor the status and performance of integrated API services
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apiStatuses.map((api, index) => (
            <div key={index} className="border border-warcrow-gold/20 rounded-md p-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-warcrow-text">{api.name}</h3>
                {renderStatusBadge(api.status)}
              </div>
              <div className="flex justify-between mt-2 text-sm text-warcrow-text/80">
                <span>Last checked: {formatTime(api.lastChecked)}</span>
                {api.latency && <span>Latency: {api.latency}ms</span>}
              </div>
              
              {api.name === 'DeepL Translation API' && deepLUsage && (
                <div className="mt-3 pt-3 border-t border-warcrow-gold/10">
                  <div className="flex justify-between mb-1 text-sm">
                    <span className="text-warcrow-text/80">Character usage:</span>
                    <span className="text-warcrow-gold/80">
                      {formatNumber(deepLUsage.character_count)} / {formatNumber(deepLUsage.character_limit)}
                    </span>
                  </div>
                  <Progress 
                    value={(deepLUsage.character_count / deepLUsage.character_limit) * 100}
                    className="h-1.5 bg-warcrow-gold/20"
                  />
                  <div className="flex justify-end mt-1">
                    <span className="text-xs text-warcrow-text/70">
                      {((deepLUsage.character_count / deepLUsage.character_limit) * 100).toFixed(1)}% used
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          <div className="flex gap-4">
            <Button
              onClick={fetchDeepLUsage}
              disabled={isLoadingUsage}
              variant="outline"
              size="sm"
              className="flex-1 border-warcrow-gold/30 text-warcrow-gold"
            >
              {isLoadingUsage ? (
                <>
                  <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />
                  Updating DeepL Usage...
                </>
              ) : (
                <>
                  <BarChart className="mr-2 h-4 w-4" />
                  Update DeepL Usage
                </>
              )}
            </Button>
            
            <Button
              onClick={() => window.open(getPatreonCampaignUrl(), '_blank')}
              variant="outline"
              size="sm"
              className="border-warcrow-gold/30 text-warcrow-gold"
            >
              View Patreon Page
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiStatus;
