
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle, Clock, XCircle } from "lucide-react";
import { toast } from "sonner";

interface DeploymentStatus {
  id: string;
  site_name: string;
  created_at: string;
  state: string;
  deploy_url: string;
  commit_message?: string;
  branch?: string;
  error_message?: string;
}

const NetlifyDeployments: React.FC = () => {
  const [deployments, setDeployments] = useState<DeploymentStatus[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeployments = async () => {
      try {
        // This would typically be a Supabase function call
        // Here we're mocking the response for demonstration
        // In a real implementation, you would fetch data from the Netlify API
        
        // Simulated API response
        const mockDeployments: DeploymentStatus[] = [
          {
            id: 'deploy-123',
            site_name: 'warcrow-army-builder',
            created_at: new Date().toISOString(),
            state: 'ready',
            deploy_url: 'https://main--warcrow-army-builder.netlify.app',
            commit_message: 'Update admin dashboard',
            branch: 'main'
          },
          {
            id: 'deploy-122',
            site_name: 'warcrow-army-builder',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            state: 'error',
            deploy_url: 'https://deploy-preview--warcrow-army-builder.netlify.app',
            error_message: 'Build failed: dependency not found',
            commit_message: 'Add new component',
            branch: 'feature/new-component'
          },
          {
            id: 'deploy-121',
            site_name: 'warcrow-army-builder',
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            state: 'ready',
            deploy_url: 'https://main--warcrow-army-builder.netlify.app',
            commit_message: 'Fix styling issues',
            branch: 'main'
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
      }
    };

    fetchDeployments();
    // Refresh every 2 minutes
    const intervalId = setInterval(fetchDeployments, 120000);
    
    return () => clearInterval(intervalId);
  }, []);

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
    return date.toLocaleString();
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

  if (loading) {
    return (
      <Card className="bg-black/50 border border-warcrow-gold/30">
        <CardHeader>
          <CardTitle className="text-warcrow-gold">Netlify Deployments</CardTitle>
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
        <CardHeader>
          <CardTitle className="text-warcrow-gold">Netlify Deployments</CardTitle>
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
      <CardHeader>
        <CardTitle className="text-warcrow-gold">Netlify Deployments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {deployments.length === 0 ? (
            <p className="text-center text-gray-400 py-2">No deployments found</p>
          ) : (
            deployments.map(deployment => (
              <div 
                key={deployment.id}
                className="border border-warcrow-gold/20 rounded-md p-3 hover:bg-warcrow-gold/5 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    {getStatusIcon(deployment.state)}
                    <a 
                      href={deployment.deploy_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="ml-2 font-medium text-warcrow-gold hover:underline"
                    >
                      {deployment.branch || 'unknown'}
                    </a>
                  </div>
                  {getStatusBadge(deployment.state)}
                </div>
                
                <div className="text-sm text-gray-300 mb-1">
                  {deployment.commit_message && (
                    <p className="truncate">{deployment.commit_message}</p>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>{formatDate(deployment.created_at)}</span>
                  {deployment.error_message && (
                    <span className="text-red-400 truncate max-w-[200px]">
                      {deployment.error_message}
                    </span>
                  )}
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
