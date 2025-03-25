
import { useState, useEffect } from "react";
import { FriendActivityFeed } from "@/components/profile/FriendActivityFeed";
import { useProfileSession } from "@/hooks/useProfileSession";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { profileFadeIn } from "@/components/profile/animations";

const Activity = () => {
  const { userId, isAuthenticated, usePreviewData } = useProfileSession();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  
  // If not authenticated and not in preview mode, redirect to login
  useEffect(() => {
    if (!isAuthenticated && !usePreviewData) {
      navigate("/login");
    }
  }, [isAuthenticated, usePreviewData, navigate]);
  
  if (!userId) {
    return (
      <div className="min-h-screen bg-warcrow-background text-warcrow-text flex flex-col items-center justify-center">
        <div className="text-warcrow-gold text-xl mb-4">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-warcrow-background text-warcrow-text">
      <header className="bg-black/50 border-b border-warcrow-gold/20 backdrop-blur-sm">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-warcrow-gold">Activity Feed</h1>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="border-warcrow-gold/50 text-warcrow-gold hover:bg-warcrow-gold/10"
                onClick={() => navigate("/profile")}
              >
                Back to Profile
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container max-w-5xl mx-auto px-4 py-6">
        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="bg-black/30 border border-warcrow-gold/20 mb-6">
            <TabsTrigger value="all" className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold">
              All Activity
            </TabsTrigger>
            <TabsTrigger value="lists" className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold">
              List Updates
            </TabsTrigger>
            <TabsTrigger value="friends" className="data-[state=active]:bg-warcrow-gold/20 data-[state=active]:text-warcrow-gold">
              Friend Updates
            </TabsTrigger>
          </TabsList>
          
          <motion.div
            key={activeTab}
            variants={profileFadeIn}
            initial="hidden"
            animate="visible"
          >
            <TabsContent value="all" className="mt-0">
              <FriendActivityFeed userId={userId} />
            </TabsContent>
            
            <TabsContent value="lists" className="mt-0">
              <div className="bg-black/50 border border-warcrow-gold/20 rounded-lg p-6">
                <p className="text-center text-warcrow-text/70 italic">
                  Filter for list updates coming soon
                </p>
              </div>
            </TabsContent>
            
            <TabsContent value="friends" className="mt-0">
              <div className="bg-black/50 border border-warcrow-gold/20 rounded-lg p-6">
                <p className="text-center text-warcrow-text/70 italic">
                  Filter for friend updates coming soon
                </p>
              </div>
            </TabsContent>
          </motion.div>
        </Tabs>
      </main>
    </div>
  );
};

export default Activity;
