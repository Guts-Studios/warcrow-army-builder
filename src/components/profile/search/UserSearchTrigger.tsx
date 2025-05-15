
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { UserSearchDialog } from "./UserSearchDialog";

export const UserSearchTrigger = () => {
  const { t } = useLanguage();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsDialogOpen(true)}
        variant="outline"
        className="bg-warcrow-gold text-black hover:bg-warcrow-gold/80 hover:text-black border-warcrow-gold/70"
      >
        <Search className="h-4 w-4 mr-2" />
        {t('findFriends')}
      </Button>

      <UserSearchDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </>
  );
};
