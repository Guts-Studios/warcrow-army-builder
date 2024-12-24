import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Save, FilePlus, Trash2 } from "lucide-react";
import { SavedList } from "@/types/army";
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
import { useState } from "react";

interface ListManagementProps {
  listName: string;
  currentListName: string | null;
  onListNameChange: (name: string) => void;
  onSaveList: () => void;
  onLoadList: (list: SavedList) => void;
  onNewList: () => void;
  savedLists: SavedList[];
  selectedFaction: string;
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
}: ListManagementProps) => {
  const [listToDelete, setListToDelete] = useState<string | null>(null);

  const handleDeleteList = (listId: string) => {
    const updatedLists = savedLists.filter((list) => list.id !== listId);
    localStorage.setItem("armyLists", JSON.stringify(updatedLists));
    window.location.reload();
  };

  return (
    <div className="space-y-4">
      {/* Desktop Layout */}
      <div className="hidden md:flex flex-col gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="Enter list name"
            value={listName}
            onChange={(e) => onListNameChange(e.target.value)}
            className="bg-warcrow-background text-warcrow-text border-warcrow-accent focus:border-warcrow-gold"
          />
          <Button
            onClick={onSaveList}
            className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black whitespace-nowrap"
          >
            <Save className="h-4 w-4 mr-2" />
            Save List
          </Button>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            onClick={onNewList}
            variant="outline"
            className="bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background transition-colors"
          >
            <FilePlus className="h-4 w-4 mr-2" />
            New List
          </Button>
          <div className="flex-1 ml-4">
            <p className="text-warcrow-text mb-1">Current List:</p>
            <p className="text-warcrow-gold font-semibold">
              {currentListName || "New List"}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col gap-4 md:hidden">
        <div className="flex gap-2">
          <Input
            placeholder="Enter list name"
            value={listName}
            onChange={(e) => onListNameChange(e.target.value)}
            className="bg-warcrow-background text-warcrow-text border-warcrow-accent focus:border-warcrow-gold"
          />
          <Button
            onClick={onSaveList}
            className="bg-warcrow-gold hover:bg-warcrow-gold/80 text-black whitespace-nowrap"
          >
            <Save className="h-4 w-4 mr-2" />
            Save List
          </Button>
        </div>

        <div className="flex flex-col gap-2 bg-warcrow-accent rounded-lg p-4">
          <Button
            onClick={onNewList}
            variant="outline"
            className="bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background transition-colors whitespace-nowrap w-full"
          >
            <FilePlus className="h-4 w-4 mr-2" />
            New List
          </Button>
          <div>
            <p className="text-warcrow-text mb-1">Current List:</p>
            <p className="text-warcrow-gold font-semibold">
              {currentListName || "New List"}
            </p>
          </div>
        </div>
      </div>

      {savedLists.length > 0 && (
        <div className="bg-warcrow-accent rounded-lg p-4 mb-4">
          <h3 className="text-lg font-semibold text-warcrow-gold mb-2">
            Saved Lists
          </h3>
          <div className="space-y-2">
            {savedLists
              .filter((list) => list.faction === selectedFaction)
              .map((list) => (
                <div
                  key={list.id}
                  className="flex items-center justify-between bg-warcrow-background p-2 rounded"
                >
                  <span className="text-warcrow-text">{list.name}</span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => onLoadList(list)}
                      variant="outline"
                      className="bg-warcrow-background border-warcrow-gold text-warcrow-gold hover:bg-warcrow-gold hover:text-warcrow-background transition-colors"
                    >
                      Load
                    </Button>
                    <Button
                      onClick={() => setListToDelete(list.id)}
                      variant="outline"
                      className="bg-warcrow-background border-red-500 text-red-500 hover:bg-red-500 hover:text-warcrow-background transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

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