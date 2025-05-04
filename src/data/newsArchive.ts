
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
