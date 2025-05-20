
import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTranslateKeyword } from '@/utils/translationUtils';
import { useProfileSession } from '@/hooks/useProfileSession';

interface AvatarPortraitProps {
  portraitUrl: string | undefined;
  name: string;
  fallback?: string;
}

const AvatarPortrait: React.FC<AvatarPortraitProps> = ({
  portraitUrl,
  name,
  fallback
}) => {
  const [imageError, setImageError] = useState(false);
  const [fallbackAttempted, setFallbackAttempted] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const { language } = useLanguage();
  const { translateUnitName } = useTranslateKeyword();
  const { isPreview } = useProfileSession();
  
  // Display properly translated name when available
  const displayName = language === 'en' ? name : translateUnitName(name, language);
  
  // Generate and set portrait URL when component mounts or dependencies change
  useEffect(() => {
    setImageError(false);
    setFallbackAttempted(false);
    
    let imageUrl: string;
    
    // Special handling for Lady Télia
    if (name.includes("Lady Télia") || name.includes("Lady Telia")) {
      imageUrl = "/art/portrait/lady_telia_portrait.jpg";
    } else {
      imageUrl = generatePortraitUrl();
    }
    
    console.log(`[AvatarPortrait] Initial portrait URL for ${name}: ${imageUrl}`);
    setCurrentUrl(imageUrl);
  }, [name, portraitUrl, language, isPreview]);
  
  // Generate portrait URL based on unit name - always using English names for consistency
  const generatePortraitUrl = () => {
    if (!portraitUrl) {
      // Clean up the name for URL generation - handle special characters and accents
      const cleanName = name
        .toLowerCase()
        .replace(/\s+/g, '_')         // Replace spaces with underscores
        .replace(/[^\w-]/g, '')       // Remove special characters (except underscores and hyphens)
        .replace(/ć/g, 'c')           // Replace ć with c
        .replace(/í/g, 'i')           // Replace í with i
        .replace(/á/g, 'a')           // Replace á with a
        .replace(/é/g, 'e');          // Replace é with e
      
      return `/art/portrait/${cleanName}_portrait.jpg`;
    }
    
    // Special case for Lady Télia
    if (portraitUrl.includes('lady_telia')) {
      return '/art/portrait/lady_telia_portrait.jpg';
    }
    
    // Check if URL is a UUID-based URL
    if (portraitUrl && (portraitUrl.length > 60 || portraitUrl.includes('uuid'))) {
      // Try to use the name instead
      const cleanName = name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w-]/g, '')
        .replace(/é|è|ê|ë/g, 'e')
        .replace(/á|à|â|ä/g, 'a')
        .replace(/í|ì|î|ï/g, 'i')
        .replace(/ó|ò|ô|ö/g, 'o')
        .replace(/ú|ù|û|ü/g, 'u');
      
      return `/art/portrait/${cleanName}_portrait.jpg`;
    }
    
    // If URL provided but not in portrait format, convert card URL to portrait URL
    if (portraitUrl.includes('/art/card/')) {
      // Replace the directory path
      let portraitImageUrl = portraitUrl.replace('/art/card/', '/art/portrait/');
      
      // Handle different filename extensions and patterns
      // Always use the English base name (without language suffix)
      if (portraitUrl.endsWith('_card.jpg') || portraitUrl.endsWith('_card_en.jpg')) {
        portraitImageUrl = portraitImageUrl.replace('_card.jpg', '_portrait.jpg').replace('_card_en.jpg', '_portrait.jpg');
      } else if (portraitUrl.endsWith('_card.png')) {
        portraitImageUrl = portraitImageUrl.replace('_card.png', '_portrait.jpg'); 
      } else if (portraitUrl.endsWith('_card_sp.jpg') || portraitUrl.endsWith('_card_fr.jpg')) {
        // Remove language suffixes for portrait URLs to always use English version
        portraitImageUrl = portraitImageUrl
          .replace('_card_sp.jpg', '_portrait.jpg')
          .replace('_card_fr.jpg', '_portrait.jpg');
      } else if (portraitUrl.endsWith('.jpg')) {
        // For files without _card suffix, just replace with _portrait
        portraitImageUrl = portraitImageUrl.replace('.jpg', '_portrait.jpg');
      }
      
      return portraitImageUrl;
    }
    
    // Special handling for Northern Tribes units
    const isNorthernTribesUnit = name.toLowerCase().includes('northern') || 
                               name.toLowerCase().includes('tribe') ||
                               (portraitUrl && portraitUrl.toLowerCase().includes('northern'));
                               
    if (isNorthernTribesUnit) {
      // Try to normalize the URL pattern
      const cleanName = name
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w-]/g, '');
        
      return `/art/portrait/northern_tribes_${cleanName}_portrait.jpg`;
    }
    
    // If it's already a portrait URL or doesn't match our patterns, return as is
    return portraitUrl;
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error(`Portrait image failed to load for ${name}:`, currentUrl);
    
    // If first attempt failed but we haven't tried a fallback yet, try a different naming pattern
    if (!fallbackAttempted && currentUrl) {
      setFallbackAttempted(true);
      
      // Try a simpler filename structure
      const simpleNameId = name.split(' ')[0].toLowerCase();
      const fallbackUrl = `/art/portrait/${simpleNameId}_portrait.jpg`;
      
      if (fallbackUrl !== currentUrl) {
        console.log(`[AvatarPortrait] Trying alternative portrait URL: ${fallbackUrl}`);
        setCurrentUrl(fallbackUrl);
        return; // Don't set error state yet
      }
    }
    
    // For Northern Tribes units, try an extra special case pattern
    const isNorthernTribesUnit = name.toLowerCase().includes('northern') || 
                               name.toLowerCase().includes('tribe');
                               
    if (fallbackAttempted && isNorthernTribesUnit) {
      const tribesFallbackName = name.toLowerCase().replace(/[^\w]/g, '');
      const tribesUrl = `/art/portrait/northern_tribes_${tribesFallbackName}_portrait.jpg`;
      console.log(`[AvatarPortrait] Trying special Northern Tribes URL pattern: ${tribesUrl}`);
      setCurrentUrl(tribesUrl);
      return;
    }
    
    // If all fallbacks tried, show error state
    setImageError(true);
  };

  return (
    <Avatar className="h-8 w-8 md:h-8 md:w-8 flex-shrink-0">
      {!imageError && currentUrl && (
        <AvatarImage 
          src={currentUrl} 
          alt={displayName} 
          className="object-cover"
          onError={handleImageError}
        />
      )}
      <AvatarFallback className="bg-warcrow-background text-warcrow-muted text-xs">
        {fallback || displayName.split(' ').map(word => word[0]).join('')}
      </AvatarFallback>
    </Avatar>
  );
};

export default AvatarPortrait;
