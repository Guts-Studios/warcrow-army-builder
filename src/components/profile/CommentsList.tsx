
import { ProfileComment } from "@/types/comments";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useProfileSession } from "@/hooks/useProfileSession";
import { formatDistanceToNow } from "date-fns";

interface CommentsListProps {
  comments: ProfileComment[];
  isLoading: boolean;
  onDeleteComment: (commentId: string) => Promise<boolean>;
}

export const CommentsList = ({ comments, isLoading, onDeleteComment }: CommentsListProps) => {
  const { userId } = useProfileSession();
  
  if (isLoading) {
    return <div className="py-4 text-center text-warcrow-text/50">Loading comments...</div>;
  }
  
  if (comments.length === 0) {
    return <div className="py-4 text-center text-warcrow-text/50">No comments yet. Be the first to leave a comment!</div>;
  }
  
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="p-3 bg-black/30 rounded-md border border-warcrow-gold/10">
          <div className="flex items-start gap-3">
            <ProfileAvatar
              avatarUrl={comment.author_avatar_url || null}
              username={comment.author_username || "User"}
              isEditing={false}
              onAvatarUpdate={() => {}}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-medium text-warcrow-gold">{comment.author_username || "Unknown User"}</span>
                  <span className="text-xs text-warcrow-text/50 ml-2">
                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                  </span>
                </div>
                {userId === comment.author_id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteComment(comment.id)}
                    className="h-7 w-7 p-0 text-warcrow-text/50 hover:text-red-400 hover:bg-black/30"
                    title="Delete comment"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <p className="mt-1 text-warcrow-text break-words whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
