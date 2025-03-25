
import { SavedList } from "@/types/army";

/**
 * Encodes a list into a URL-safe string
 */
export const encodeListToUrl = (list: SavedList): string => {
  // Convert list to a serialized string
  const listData = JSON.stringify({
    name: list.name,
    faction: list.faction,
    units: list.units,
    created_at: list.created_at
  });
  
  // Encode to Base64 and make URL safe
  const encodedData = btoa(listData)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
  
  return encodedData;
};

/**
 * Decodes a URL-safe string back into a list
 */
export const decodeUrlToList = (encodedUrl: string): SavedList | null => {
  try {
    // Restore proper Base64 format
    const sanitizedData = encodedUrl
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Decode from Base64
    const jsonString = atob(sanitizedData);
    const listData = JSON.parse(jsonString);
    
    // Create a temporary ID if none exists
    const tempList: SavedList = {
      id: `temp-${Date.now()}`,
      name: listData.name,
      faction: listData.faction,
      units: listData.units,
      created_at: listData.created_at || new Date().toISOString()
    };
    
    return tempList;
  } catch (error) {
    console.error("Failed to decode list data:", error);
    return null;
  }
};

/**
 * Generates a full shareable URL for a list
 */
export const generateShareableLink = (list: SavedList): string => {
  const encodedList = encodeListToUrl(list);
  const baseUrl = window.location.origin;
  return `${baseUrl}/shared-list/${encodedList}`;
};
