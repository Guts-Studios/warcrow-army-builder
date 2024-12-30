import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarPortraitProps {
  portraitUrl: string | undefined;
  name: string;
}

const AvatarPortrait = ({ portraitUrl, name }: AvatarPortraitProps) => {
  // Get the base URL without the file extension
  const baseUrl = portraitUrl?.replace('_card.jpg', '');
  // Construct the portrait URL
  const portraitImageUrl = baseUrl ? `${baseUrl}_portrait.jpg` : undefined;

  return (
    <Avatar className="h-8 w-8">
      <AvatarImage src={portraitImageUrl} alt={name} />
      <AvatarFallback className="bg-warcrow-background text-warcrow-muted text-xs">
        {name.split(' ').map(word => word[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarPortrait;