import { useState } from "react";
import { SavedList } from "@/types/army";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import NewListButton from "./army/list-management/NewListButton";
import SaveListSection from "./army/list-management/SaveListSection";
import CurrentListDisplay from "./army/list-management/CurrentListDisplay";
import SavedListsSection from "./army/list-management/SavedListsSection";

interface ListManagementProps {
  listName: string;
  currentListName: string | null;
  onListNameChange: (name: string) => void;
  onSaveList: () => void;
  onLoadList: (list: SavedList) => void;
  onNewList: () => void;
  savedLists: SavedList[];
  selectedFaction: string;
  selectedUnits: any[]; // Using any[] for now since we don't have the type
}

const ListManagement = ({
  listName,
  currentListName,
  onListNameChange,
  onSaveList,
  onLoadList,
  onNewList,
  savedLists,
  selectedFaction,
  selectedUnits,
}: ListManagementProps) => {
  const [listToDelete, setListToDelete] = useState<string | null>(null);

  const handleDeleteList = async (listId: string) => {
    const listToRemove = savedLists.find((list) => list.id === listId);
    
    if (listToRemove?.user_id) {
      // Delete from Supabase if it's a cloud save
      const { error } = await supabase
        .from('army_lists')
        .delete()
        .eq('id', listId);

      if (error) {
        console.error('Error deleting from cloud:', error);
        toast.error("Failed to delete list from cloud");
        return;
      }
    }

    // Update local storage
    const updatedLists = savedLists.filter((list) => list.id !== listId);
    localStorage.setItem("armyLists", JSON.stringify(updatedLists));
    window.location.reload();
  };

  return (
    <div className="space-y-4 w-full">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col gap-4 w-full">
        <NewListButton onNewList={onNewList} />
        <SaveListSection
          listName={listName}
          onListNameChange={onListNameChange}
          onSaveList={onSaveList}
          selectedUnits={selectedUnits}
          selectedFaction={selectedFaction}
        />
        <CurrentListDisplay currentListName={currentListName} />
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 md:hidden w-full">
        <NewListButton onNewList={onNewList} />
        <div className="bg-warcrow-accent rounded-lg p-4 w-full">
          <SaveListSection
            listName={listName}
            onListNameChange={onListNameChange}
            onSaveList={onSaveList}
            selectedUnits={selectedUnits}
            selectedFaction={selectedFaction}
          />
          <div className="mt-2">
            <CurrentListDisplay currentListName={currentListName} />
          </div>
        </div>
      </div>

      <SavedListsSection
        savedLists={savedLists}
        selectedFaction={selectedFaction}
        onLoadList={onLoadList}
        onDeleteClick={(listId) => setListToDelete(listId)}
      />

      <AlertDialog open={!!listToDelete} onOpenChange={() => setListToDelete(null)}>
        <AlertDialogContent className="bg-warcrow-background border-warcrow-accent">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-warcrow-gold">Delete List</AlertDialogTitle>
            <AlertDialogDescription className="text-warcrow-text">
              Are you sure you want to delete this list? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-warcrow-background border-warcrow-accent text-warcrow-text hover:bg-warcrow-accent hover:text-warcrow-text"
              onClick={() => setListToDelete(null)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                if (listToDelete) {
                  handleDeleteList(listToDelete);
                }
                setListToDelete(null);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ListManagement;