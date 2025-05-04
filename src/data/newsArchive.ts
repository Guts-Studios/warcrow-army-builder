
import { translations } from "@/i18n/translations";

export type NewsItem = {
  id: string;
  date: string;
  key: string; // Key in translations object
};

// Store news items in reverse chronological order (newest first)
export const newsItems: NewsItem[] = [
  {
    id: "news-embersig-profiles",
    date: "2025-04-15",
    key: "recentNews",
  },
  {
    id: "news-play-mode-dice",
    date: "2025-03-28",
    key: "previousNews",
  },
  // Add more news items as they come in
];
