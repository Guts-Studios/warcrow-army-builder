
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { purgeStorageExceptLists, clearInvalidTokens } from '@/utils/storageUtils';
import { toast } from 'sonner';

const DebugPanel = () => {
  const [showDebugButtons, setShowDebugButtons] = useState(false);
  const [showRecoveryButtons, setShowRecoveryButtons] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedDebugPreference = localStorage.getItem('warcrow_show_debug_buttons');
    if (savedDebugPreference !== null) {
      setShowDebugButtons(savedDebugPreference === 'true');
    }
    
    const savedRecoveryPreference = localStorage.getItem('warcrow_show_recovery_buttons');
    if (savedRecoveryPreference !== null) {
      setShowRecoveryButtons(savedRecoveryPreference === 'true');
    }
  }, []);

  // Save preference to localStorage when changed
  const handleToggleDebugButtons = (enabled: boolean) => {
    setShowDebugButtons(enabled);
    localStorage.setItem('warcrow_show_debug_buttons', enabled.toString());
    
    // Trigger a storage event for other components to detect this change
    window.dispatchEvent(new Event('storage'));
    
    toast.success(enabled ? "Debug buttons are now visible" : "Debug buttons are now hidden");
  };
  
  // Save recovery buttons preference
  const handleToggleRecoveryButtons = (enabled: boolean) => {
    setShowRecoveryButtons(enabled);
    localStorage.setItem('warcrow_show_recovery_buttons', enabled.toString());
    
    // Trigger a storage event for other components to detect this change
    window.dispatchEvent(new Event('storage'));
    
    toast.success(enabled ? "Recovery buttons are now visible" : "Recovery buttons are now hidden");
  };

  // Handle storage purge
  const handlePurgeStorage = () => {
    try {
      purgeStorageExceptLists();
      toast.success("Storage purged successfully (except lists and auth tokens)");
    } catch (error) {
      console.error("Error purging storage:", error);
      toast.error("Failed to purge storage");
    }
  };

  // Handle token clearing
  const handleClearTokens = async () => {
    try {
      const cleared = await clearInvalidTokens();
      toast.success(cleared ? "Invalid tokens cleared successfully" : "No invalid tokens found");
    } catch (error) {
      console.error("Error clearing tokens:", error);
      toast.error("Failed to clear invalid tokens");
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Debug Options</CardTitle>
          <CardDescription>
            Configure debug tools and visibility options
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="debug-buttons">Show Debug Buttons</Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, debug buttons will be visible on the main site
                </p>
              </div>
              <Switch 
                id="debug-buttons" 
                checked={showDebugButtons} 
                onCheckedChange={handleToggleDebugButtons}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="recovery-buttons">Show Recovery Buttons</Label>
                <p className="text-sm text-muted-foreground">
                  When enabled, recovery/troubleshooting buttons will be visible when app issues are detected
                </p>
              </div>
              <Switch 
                id="recovery-buttons" 
                checked={showRecoveryButtons} 
                onCheckedChange={handleToggleRecoveryButtons}
              />
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-medium mb-2">Debug Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="destructive"
                  onClick={handlePurgeStorage}
                >
                  Purge Storage (Keep Lists)
                </Button>
                
                <Button 
                  variant="destructive"
                  onClick={handleClearTokens}
                >
                  Clear Invalid Auth Tokens
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugPanel;
