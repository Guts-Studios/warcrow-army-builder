import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

interface Activity {
  id: string;
  timestamp: string;
  message: string;
}

interface FriendActivityFeedProps {
  userId: string;
  className?: string;
}

export const FriendActivityFeed: React.FC<FriendActivityFeedProps> = ({ userId, className }) => {
  const [activityFeed, setActivityFeed] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityFeed = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulate fetching data from an API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockActivity: Activity[] = [
        { id: '1', timestamp: '2024-07-15T10:00:00', message: 'Played a game' },
        { id: '2', timestamp: '2024-07-14T18:30:00', message: 'Added a new friend' },
        { id: '3', timestamp: '2024-07-13T22:45:00', message: 'Updated profile settings' },
      ];
      
      setActivityFeed(mockActivity);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch activity feed');
      toast.error(`Failed to fetch activity feed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchActivityFeed();
    }
  }, [userId]);

  const refreshFeed = () => {
    fetchActivityFeed();
  };

  return (
    <div className={`bg-black/50 backdrop-filter backdrop-blur-sm rounded-lg p-4 border border-warcrow-gold/10 h-full flex flex-col ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-warcrow-gold font-medium">Friend Activity</h3>
        <Button
          onClick={refreshFeed}
          variant="outline"
          size="sm"
          className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10"
        >
          <RefreshCw className="h-3 w-3 mr-1" />
          Refresh
        </Button>
      </div>

      {isLoading && <div className="text-warcrow-text">Loading activity...</div>}
      {error && <div className="text-red-500">Error: {error}</div>}

      <ul className="space-y-2 overflow-auto h-full">
        {activityFeed.map(activity => (
          <li key={activity.id} className="text-warcrow-text/80">
            <span className="text-sm">{activity.message}</span>
            <div className="text-xs text-warcrow-text/50">{activity.timestamp}</div>
          </li>
        ))}
        {activityFeed.length === 0 && !isLoading && !error && (
          <li className="text-warcrow-text/50">No activity to display.</li>
        )}
      </ul>
    </div>
  );
};
