
import pako from 'pako';

/**
 * Compresses a string using deflate and encodes it for URL safety
 */
export const compress = (data: string): string => {
  // Convert string to Uint8Array
  const binaryString = new TextEncoder().encode(data);
  
  // Compress data
  const compressed = pako.deflate(binaryString, { level: 9 });
  
  // Convert to Base64 and make URL safe
  return btoa(String.fromCharCode.apply(null, Array.from(compressed)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Decompresses a URL-safe string back to the original data
 */
export const decompress = (compressed: string): string => {
  // Restore proper Base64 format
  const base64 = compressed
    .replace(/-/g, '+')
    .replace(/_/g, '/');
    
  // Convert Base64 to binary
  const binaryString = atob(base64);
  const charArray = new Uint8Array(binaryString.length);
  
  for (let i = 0; i < binaryString.length; i++) {
    charArray[i] = binaryString.charCodeAt(i);
  }
  
  // Decompress
  const decompressed = pako.inflate(charArray);
  
  // Convert back to string
  return new TextDecoder().decode(decompressed);
};
