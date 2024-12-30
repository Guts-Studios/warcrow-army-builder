import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarPortraitProps {
  portraitUrl: string | undefined;
  name: string;
}

const AvatarPortrait = ({ portraitUrl, name }: AvatarPortraitProps) => {
  // Use the portrait URL directly if it exists
  return (
    <Avatar className="h-8 w-8 md:h-8 md:w-8 flex-shrink-0">
      <AvatarImage 
        src={portraitUrl} 
        alt={name} 
        className="object-cover"
      />
      <AvatarFallback className="bg-warcrow-background text-warcrow-muted text-xs">
        {name.split(' ').map(word => word[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarPortrait;