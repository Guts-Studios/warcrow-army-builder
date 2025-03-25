
import { createContext, useContext, ReactNode } from "react";
import { SavedList } from "@/types/army";
import { ProfileFormData } from "@/types/profile";

interface ProfileContextType {
  profile: any;
  formData: ProfileFormData;
  isEditing: boolean;
  isLoading: boolean;
  updateProfile: any;
  setIsEditing: (value: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleAvatarUpdate: (url: string) => void;
  handleListSelect: (list: SavedList) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileDataProvider");
  }
  return context;
};

export default ProfileContext;
