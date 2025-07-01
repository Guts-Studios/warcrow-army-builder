
export interface Mission {
  id: string;
  title: string;
  details: string;
  isHomebrew: boolean;
  isOfficial?: boolean;
  communityCreator?: string;
  displayTitle?: string; // For translated titles
}

export interface Feat {
  id: string;
  name: string;
  details: string;
  displayName?: string; // For translated names
}
