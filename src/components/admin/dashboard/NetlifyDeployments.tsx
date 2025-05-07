
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle, Clock, XCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface DeploymentStatus {
  id: string;
  site_name: string;
  created_at: string;
  state: string;
  deploy_url: string;
  commit_message?: string;
  branch?: string;
  error_message?: string;
  author?: string;
  deploy_time?: string;
}

const NetlifyDeployments: React.FC = () => {
  const [deployments, setDeployments] = useState<DeploymentStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchDeployments = async () => {
    try {
      setRefreshing(true);
      // This would typically be a Supabase function call
      // Here we're mocking the response for demonstration
      // In a real implementation, you would fetch data from the Netlify API
      
      // Simulated API response
      const mockDeployments: DeploymentStatus[] = [
        {
          id: 'deploy-123',
          site_name: 'warcrowarmy.com',
          created_at: new Date().toISOString(),
          state: 'building',
          deploy_url: 'https://main--warcrow-army-builder.netlify.app',
          commit_message: 'feat: Add deployment management page',
          branch: 'main@235c160',
          author: 'lovable-dev[bot]'
        },
        {
          id: 'deploy-122',
          site_name: 'warcrowarmy.com',
          created_at: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          state: 'ready',
          deploy_url: 'https://deploy-preview--warcrow-army-builder.netlify.app',
          commit_message: 'Add Netlify deployments module',
          branch: 'main@2b00e5d',
          author: 'lovable-dev[bot]',
          deploy_time: '1m 17s'
        },
        {
          id: 'deploy-121',
          site_name: 'warcrowarmy.com',
          created_at: new Date(Date.now() - 2400000).toISOString(), // 40 minutes ago
          state: 'ready',
          deploy_url: 'https://main--warcrow-army-builder.netlify.app',
          commit_message: 'Added all Spanish cards',
          branch: 'main@b15bed5',
          author: 'jayroi',
          deploy_time: '1m 1s'
        },
        {
          id: 'deploy-120',
          site_name: 'warcrowarmy.com',
          created_at: new Date(Date.now() - 2700000).toISOString(), // 45 minutes ago
          state: 'ready',
          deploy_url: 'https://main--warcrow-army-builder.netlify.app',
          commit_message: 'Refactor code',
          branch: 'main@10878b8',
          author: 'lovable-dev[bot]'
        }
      ];

      // In production, replace with actual API call
      // const { data, error } = await supabase.functions.invoke('get-netlify-deployments');
      // if (error) throw new Error(error.message);
      
      setDeployments(mockDeployments);
      
      // Check for failed deployments and show a toast
      const failedDeployment = mockDeployments.find(d => d.state === 'error');
      if (failedDeployment) {
        toast.error(`Deployment failed: ${failedDeployment.error_message || 'Unknown error'}`, {
          description: `Branch: ${failedDeployment.branch}`,
        });
      }

    } catch (err) {
      console.error('Error fetching deployments:', err);
      setError('Failed to fetch deployment data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDeployments();
    // Refresh every 2 minutes
    const intervalId = setInterval(fetchDeployments, 120000);
    
    return () => clearInterval(intervalId);
  }, []);

  const handleRefresh = () => {
    fetchDeployments();
    toast.success("Refreshing deployment data");
  };

  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'ready':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'building':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return "Today at " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusBadge = (state: string) => {
    switch (state) {
      case 'ready':
        return <Badge className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge className="bg-red-500">Failed</Badge>;
      case 'building':
        return <Badge className="bg-yellow-500">Building</Badge>;
      default:
        return <Badge className="bg-gray-500">{state}</Badge>;
    }
  };

  const getDeploymentTitle = (deployment: DeploymentStatus) => {
    if (deployment.state === 'building') {
      return `${deployment.site_name}: Production: ${deployment.branch} building`;
    }
    return `${deployment.site_name}: Production: ${deployment.branch} completed`;
  };

  if (loading && !refreshing) {
    return (
      <Card className="bg-black/50 border border-warcrow-gold/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-warcrow-gold">Netlify Deployments</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="h-8 w-8 p-0"
            disabled={true}
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-4 bg-warcrow-gold/20 rounded w-3/4 mx-auto"></div>
              <div className="h-4 bg-warcrow-gold/20 rounded w-1/2 mx-auto"></div>
              <div className="h-4 bg-warcrow-gold/20 rounded w-2/3 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-black/50 border border-warcrow-gold/30">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-warcrow-gold">Netlify Deployments</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRefresh}
            className="h-8 w-8 p-0"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-400">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/50 border border-warcrow-gold/30">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-warcrow-gold">Netlify Deployments</CardTitle>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span className="sr-only">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-warcrow-gold mb-2">Builds</p>
          {deployments.length === 0 ? (
            <p className="text-center text-gray-400 py-2">No deployments found</p>
          ) : (
            deployments.map(deployment => (
              <div 
                key={deployment.id}
                className="border border-warcrow-gold/20 rounded-md p-3 hover:bg-warcrow-gold/5 transition-colors"
              >
                <div className="flex items-center mb-1">
                  {getStatusIcon(deployment.state)}
                  <span className="ml-2 font-medium text-warcrow-gold">
                    {getDeploymentTitle(deployment)}
                  </span>
                </div>
                
                <div className="pl-6 text-sm text-gray-300 mb-1">
                  {deployment.commit_message && (
                    <p className="truncate">By {deployment.author}: {deployment.commit_message}</p>
                  )}
                </div>
                
                <div className="pl-6 flex items-center justify-between text-xs text-gray-400">
                  <span>{formatDate(deployment.created_at)}</span>
                  {deployment.deploy_time && (
                    <span>Deployed in {deployment.deploy_time}</span>
                  )}
                </div>

                <div className="pl-6 mt-1 text-xs">
                  <a 
                    href={deployment.deploy_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Build details
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NetlifyDeployments;
