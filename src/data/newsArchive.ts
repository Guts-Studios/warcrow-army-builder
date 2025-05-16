
import { translations } from "@/i18n/translations";
import { fetchNewsItems } from "@/utils/newsUtils";

export type NewsItem = {
  id: string;
  date: string;
  key: string; // Key in translations object
};

// This will be populated from the database on initial load
export let newsItems: NewsItem[] = [];

// Initialize news items from database
export const initializeNewsItems = async () => {
  try {
    console.log("Initializing news items from database...");
    const items = await fetchNewsItems();
    console.log(`Fetched ${items.length} news items from database`);
    newsItems = items;
    return items;
  } catch (error) {
    console.error("Error initializing news items:", error);
    // Return empty array on error to avoid undefined
    return [];
  }
};

// Function to add a new news item locally (after DB update)
export const addNewsItem = (id: string, date: string, key: string) => {
  // Add news item to the beginning of the array (newest first)
  newsItems.unshift({
    id,
    date,
    key
  });
};

// Function to update an existing news item locally (after DB update)
export const updateNewsItemInArchive = (id: string, date: string, key: string) => {
  const index = newsItems.findIndex(item => item.id === id);
  if (index !== -1) {
    newsItems[index] = {
      id,
      date,
      key
    };
    return true;
  }
  return false;
};

// Function to delete a news item locally (after DB delete)
export const deleteNewsItemFromArchive = (id: string) => {
  const index = newsItems.findIndex(item => item.id === id);
  if (index !== -1) {
    newsItems.splice(index, 1);
    return true;
  }
  return false;
};
