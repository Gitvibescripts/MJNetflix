import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ContentRow from "@/components/ContentRow";
import PlayerModal from "@/components/PlayerModal";
import WatchlistView from "@/components/WatchlistView";
import BrowseView from "@/components/BrowseView";
import { CATALOG, ROWS, FEATURED, CONTENT_MAP } from "@/data";
import { useWatchlist } from "@/hooks/useWatchlist";
import type { ContentItem, WatchlistItem } from "@/types";

type View = "home" | "movies" | "tv" | "watchlist";

export default function App() {
  const [view, setView] = useState<View>("home");
  const [selected, setSelected] = useState<ContentItem | null>(null);
  const { items, ids, has, toggle, remove } = useWatchlist();

  const watchlistItems = items;

  const handleNavigate = (v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePlayWatchlistItem = (w: WatchlistItem) => {
    // Try to find in catalog for full details; fall back to minimal item
    const catalogItem = CONTENT_MAP[w.id];
    if (catalogItem) {
      setSelected(catalogItem);
    } else {
      setSelected({
        id: w.id,
        title: w.title,
        type: w.type,
        embedId: w.embedId,
        year: 0,
        rating: "-",
        duration: "-",
        genres: [],
        description: "",
        poster: w.poster,
        backdrop: w.poster,
      });
    }
  };

  const movies = useMemo(
    () => CATALOG.filter((i) => i.type === "movie"),
    []
  );
  const tvShows = useMemo(
    () => CATALOG.filter((i) => i.type === "tv"),
    []
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Header
        view={view}
        onNavigate={handleNavigate}
        watchlistCount={items.length}
        onSelectContent={setSelected}
      />

      {view === "home" && (
        <>
          <Hero
            item={FEATURED}
            onPlay={() => setSelected(FEATURED)}
            onMoreInfo={() => setSelected(FEATURED)}
            inWatchlist={has(FEATURED.id)}
            onToggleWatchlist={() => toggle(FEATURED)}
          />
          <div className="relative -mt-16 md:-mt-24 z-10 pb-12">
            {ROWS.map((row) => (
              <ContentRow
                key={row.title}
                title={row.title}
                items={CATALOG.filter(row.filter)}
                onSelect={setSelected}
                watchlistIds={ids}
                onToggleWatchlist={toggle}
              />
            ))}
          </div>
        </>
      )}

      {view === "movies" && (
        <BrowseView
          title="Movies"
          filterType="movie"
          items={movies}
          onSelect={setSelected}
          watchlistIds={ids}
        />
      )}

      {view === "tv" && (
        <BrowseView
          title="TV Shows"
          filterType="tv"
          items={tvShows}
          onSelect={setSelected}
          watchlistIds={ids}
        />
      )}

      {view === "watchlist" && (
        <WatchlistView
          items={watchlistItems}
          onPlay={handlePlayWatchlistItem}
          onRemove={remove}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 px-4 md:px-8 lg:px-12 py-8 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600 text-sm">
            MJ Netflix — A demo streaming UI. Content is embedded from
            third-party sources and is not hosted on this site.
          </p>
        </div>
      </footer>

      <PlayerModal
        item={selected}
        onClose={() => setSelected(null)}
        inWatchlist={selected ? has(selected.id) : false}
        onToggleWatchlist={toggle}
      />
    </div>
  );
}
