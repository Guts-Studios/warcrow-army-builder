
import { translations } from "@/i18n/translations";

export type NewsItem = {
  id: string;
  date: string;
  key: string; // Key in translations object
};

// Store news items in reverse chronological order (newest first)
export const newsItems: NewsItem[] = [
  {
    id: "news-2025-05-03",
    date: "2025-05-03",
    key: "recentNews",
  },
  {
    id: "news-2025-04-30",
    date: "2025-04-30",
    key: "previousNews",
  },
  // Add more news items as they come in
];

// Function to add a new news item
export const addNewsItem = (id: string, date: string, key: string) => {
  // Add news item to the beginning of the array (newest first)
  newsItems.unshift({
    id,
    date,
    key
  });
};

// Function to update an existing news item
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

// Function to delete a news item
export const deleteNewsItemFromArchive = (id: string) => {
  const index = newsItems.findIndex(item => item.id === id);
  if (index !== -1) {
    newsItems.splice(index, 1);
    return true;
  }
  return false;
};
