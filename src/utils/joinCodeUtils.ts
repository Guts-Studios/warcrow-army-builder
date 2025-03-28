
/**
 * Generates a random game join code
 * @returns A 6-character alphanumeric code
 */
export const generateJoinCode = (): string => {
  // Use only uppercase letters and numbers
  const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed potentially confusing characters like 0, O, 1, I
  let code = '';
  
  // Generate a 6-character code
  for (let i = 0; i < 6; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  
  return code;
};

/**
 * Formats a game code with a space in the middle for better readability
 * @param code The raw game code
 * @returns A formatted game code (e.g., "ABC DEF")
 */
export const formatJoinCode = (code: string): string => {
  if (!code) return '';
  
  // Clean the code (remove spaces, uppercase)
  const cleanCode = code.replace(/\s/g, '').toUpperCase();
  
  if (cleanCode.length <= 3) return cleanCode;
  
  // Insert a space in the middle
  const midpoint = Math.floor(cleanCode.length / 2);
  return `${cleanCode.slice(0, midpoint)} ${cleanCode.slice(midpoint)}`;
};

/**
 * Validates if a game code has the correct format
 * @param code The game code to validate
 * @returns True if the code is valid
 */
export const validateJoinCode = (code: string): boolean => {
  if (!code) return false;
  
  // Clean the code (remove spaces)
  const cleanCode = code.replace(/\s/g, '');
  
  // Check if it's the right length and contains only allowed characters
  return cleanCode.length === 6 && /^[A-Z0-9]+$/.test(cleanCode);
};
