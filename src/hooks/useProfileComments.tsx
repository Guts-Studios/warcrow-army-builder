
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ProfileComment, ProfileCommentFormData } from "@/types/comments";
import { useProfileSession } from "@/hooks/useProfileSession";
import { toast } from "sonner";

export const useProfileComments = (profileId: string | null) => {
  const [comments, setComments] = useState<ProfileComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { userId } = useProfileSession();

  // Fetch comments for this profile
  const fetchComments = async () => {
    if (!profileId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('profile_comments')
        .select(`
          id,
          author_id,
          profile_id,
          content,
          created_at,
          updated_at,
          author:profiles!profile_comments_author_id_fkey(username, avatar_url)
        `)
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Format the comments with author information
      const formattedComments = data.map(comment => ({
        ...comment,
        author_username: comment.author?.username,
        author_avatar_url: comment.author?.avatar_url,
      }));
      
      setComments(formattedComments);
    } catch (err) {
      console.error('Error fetching profile comments:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch comments'));
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new comment
  const addComment = async (formData: ProfileCommentFormData) => {
    if (!profileId || !userId) {
      toast.error('You must be logged in to post comments');
      return false;
    }
    
    if (!formData.content.trim()) {
      toast.error('Comment cannot be empty');
      return false;
    }
    
    try {
      const { data, error } = await supabase
        .from('profile_comments')
        .insert({
          author_id: userId,
          profile_id: profileId,
          content: formData.content.trim()
        })
        .select();
      
      if (error) throw error;
      
      toast.success('Comment posted successfully');
      
      // Refresh the comments list
      fetchComments();
      return true;
    } catch (err) {
      console.error('Error posting comment:', err);
      toast.error('Failed to post comment');
      return false;
    }
  };

  // Delete a comment
  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('profile_comments')
        .delete()
        .eq('id', commentId)
        .eq('author_id', userId);
      
      if (error) throw error;
      
      toast.success('Comment deleted');
      
      // Update the local comments state
      setComments(comments.filter(comment => comment.id !== commentId));
      return true;
    } catch (err) {
      console.error('Error deleting comment:', err);
      toast.error('Failed to delete comment');
      return false;
    }
  };

  // Set up realtime subscription for live comments
  useEffect(() => {
    if (!profileId) return;
    
    fetchComments();
    
    // Set up realtime subscription for comments
    const channel = supabase
      .channel('profile-comments')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'profile_comments',
        filter: `profile_id=eq.${profileId}`
      }, (payload) => {
        console.log('New comment received:', payload);
        fetchComments();
      })
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'profile_comments',
        filter: `profile_id=eq.${profileId}`
      }, (payload) => {
        console.log('Comment deleted:', payload);
        fetchComments();
      })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileId]);

  return {
    comments,
    isLoading,
    error,
    addComment,
    deleteComment,
    refreshComments: fetchComments
  };
};
