export type MediaType = "movie" | "tv";

export interface ContentItem {
  id: string;
  title: string;
  type: MediaType;
  /** IMDb id for movies (e.g. tt1300854), or TMDB/the show id for TV (e.g. 1399) */
  embedId: string;
  year: number;
  rating: string;
  duration: string;
  genres: string[];
  description: string;
  poster: string;
  backdrop: string;
  seasons?: number;
  featured?: boolean;
}

export interface ContentRow {
  title: string;
  itemIds: string[];
}

export interface WatchlistItem {
  id: string;
  title: string;
  poster: string;
  type: MediaType;
  embedId: string;
  addedAt: number;
}
