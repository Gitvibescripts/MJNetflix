import { useState, useEffect, useCallback } from "react";
import type { ContentItem, WatchlistItem } from "@/types";

const STORAGE_KEY = "mj-netflix-watchlist";

export function useWatchlist() {
  const [items, setItems] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  const persist = (next: WatchlistItem[]) => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  };

  const toggle = useCallback(
    (item: ContentItem) => {
      setItems((prev) => {
        const exists = prev.some((w) => w.id === item.id);
        const next = exists
          ? prev.filter((w) => w.id !== item.id)
          : [
              {
                id: item.id,
                title: item.title,
                poster: item.poster,
                type: item.type,
                embedId: item.embedId,
                addedAt: Date.now(),
              },
              ...prev,
            ];
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    []
  );

  const remove = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((w) => w.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const ids = new Set(items.map((w) => w.id));
  const has = useCallback((id: string) => ids.has(id), [ids]);

  return { items, ids, has, toggle, remove };
}
