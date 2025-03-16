
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarPortraitProps {
  portraitUrl: string | undefined;
  name: string;
}

const AvatarPortrait = ({ portraitUrl, name }: AvatarPortraitProps) => {
  // Early return if no portrait URL is provided
  if (!portraitUrl) {
    return (
      <Avatar className="h-8 w-8 md:h-8 md:w-8 flex-shrink-0">
        <AvatarFallback className="bg-warcrow-background text-warcrow-muted text-xs">
          {name.split(' ').map(word => word[0]).join('')}
        </AvatarFallback>
      </Avatar>
    );
  }

  // Convert card URL to portrait URL by changing both the directory and filename
  let portraitImageUrl = portraitUrl;
  
  // If the URL contains '/art/card/', replace it with '/art/portrait/'
  if (portraitUrl.includes('/art/card/')) {
    portraitImageUrl = portraitUrl.replace('/art/card/', '/art/portrait/');
    
    // Handle both .jpg and .png extensions
    if (portraitUrl.endsWith('_card.jpg')) {
      portraitImageUrl = portraitImageUrl.replace('_card.jpg', '_portrait.jpg');
    } else if (portraitUrl.endsWith('_card.png')) {
      portraitImageUrl = portraitImageUrl.replace('_card.png', '_portrait.png');
    }
  }
  
  // Debug log to see the actual path
  console.log('Portrait path:', {
    originalUrl: portraitUrl,
    convertedUrl: portraitImageUrl
  });

  return (
    <Avatar className="h-8 w-8 md:h-8 md:w-8 flex-shrink-0">
      <AvatarImage 
        src={portraitImageUrl} 
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
