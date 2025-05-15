
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
  
  if (portraitUrl.includes('/art/card/')) {
    // Replace the directory path
    portraitImageUrl = portraitUrl.replace('/art/card/', '/art/portrait/');
    
    // Handle different filename extensions and patterns
    if (portraitUrl.endsWith('_card.jpg')) {
      portraitImageUrl = portraitImageUrl.replace('_card.jpg', '_portrait.jpg');
    } else if (portraitUrl.endsWith('_card.png')) {
      portraitImageUrl = portraitImageUrl.replace('_card.png', '_portrait.jpg'); 
    } else if (portraitUrl.endsWith('_card_sp.jpg') || portraitUrl.endsWith('_card_fr.jpg')) {
      // Handle localized versions
      portraitImageUrl = portraitImageUrl
        .replace('_card_sp.jpg', '_portrait.jpg')
        .replace('_card_fr.jpg', '_portrait.jpg');
    } else if (portraitUrl.endsWith('.jpg') || portraitUrl.endsWith('.png')) {
      // Extract base name without extension for more complex transformations
      const baseName = portraitUrl.substring(0, portraitUrl.lastIndexOf('.'));
      const baseNameWithoutDir = baseName.substring(baseName.lastIndexOf('/') + 1);
      
      // Create portrait URL path
      portraitImageUrl = `${portraitUrl.substring(0, portraitUrl.lastIndexOf('/'))}/portrait/${baseNameWithoutDir.replace('_card', '')}_portrait.jpg`;
    }
  }

  console.log('Original URL:', portraitUrl);
  console.log('Portrait URL:', portraitImageUrl);

  return (
    <Avatar className="h-8 w-8 md:h-8 md:w-8 flex-shrink-0">
      <AvatarImage 
        src={portraitImageUrl} 
        alt={name} 
        className="object-cover"
        onError={() => setImageError(true)}
      />
      <AvatarFallback className="bg-warcrow-background text-warcrow-muted text-xs">
        {name.split(' ').map(word => word[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarPortrait;
