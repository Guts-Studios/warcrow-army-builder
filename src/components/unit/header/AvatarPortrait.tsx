
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface AvatarPortraitProps {
  portraitUrl: string | undefined;
  name: string;
}

const AvatarPortrait = ({ portraitUrl, name }: AvatarPortraitProps) => {
  const [imageError, setImageError] = useState(false);

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
    
    // Handle different extensions
    if (portraitUrl.endsWith('_card.jpg')) {
      portraitImageUrl = portraitImageUrl.replace('_card.jpg', '_portrait.jpg');
    } else if (portraitUrl.endsWith('_card.png')) {
      portraitImageUrl = portraitImageUrl.replace('_card.png', '_portrait.jpg'); // Try jpg first for png files
    } else if (portraitUrl.endsWith('.jpg')) {
      // Handle cases where filename doesn't have "_card" pattern
      const baseName = portraitUrl.substring(0, portraitUrl.lastIndexOf('.'));
      portraitImageUrl = `${baseName.replace('/art/card/', '/art/portrait/')}_portrait.jpg`;
    } else if (portraitUrl.endsWith('.png')) {
      // Handle cases where filename doesn't have "_card" pattern
      const baseName = portraitUrl.substring(0, portraitUrl.lastIndexOf('.'));
      portraitImageUrl = `${baseName.replace('/art/card/', '/art/portrait/')}_portrait.jpg`;
    }
  }
  
  // Debug log to see the actual path
  console.log('Portrait path for ' + name + ':', {
    originalUrl: portraitUrl,
    convertedUrl: portraitImageUrl
  });

  // If we've already tried and failed to load the image, update the URL to try another extension
  if (imageError) {
    // Try the alternate extension (if jpg failed, try png and vice versa)
    if (portraitImageUrl.endsWith('.jpg')) {
      portraitImageUrl = portraitImageUrl.replace('.jpg', '.png');
    } else if (portraitImageUrl.endsWith('.png')) {
      portraitImageUrl = portraitImageUrl.replace('.png', '.jpg');
    }
  }

  return (
    <Avatar className="h-8 w-8 md:h-8 md:w-8 flex-shrink-0">
      {!imageError && (
        <AvatarImage 
          src={portraitImageUrl} 
          alt={name} 
          className="object-cover"
          onError={() => setImageError(true)}
        />
      )}
      <AvatarFallback className="bg-warcrow-background text-warcrow-muted text-xs">
        {name.split(' ').map(word => word[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarPortrait;
