import { useState, useEffect, useRef } from "react";
import { Search, Play, Bookmark, Home, Film, Tv, X } from "lucide-react";
import type { ContentItem } from "@/types";
import { CATALOG } from "@/data";

interface HeaderProps {
  view: string;
  onNavigate: (view: "home" | "movies" | "tv" | "watchlist") => void;
  watchlistCount: number;
  onSelectContent: (item: ContentItem) => void;
}

export default function Header({
  view,
  onNavigate,
  watchlistCount,
  onSelectContent,
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const results = query.trim().length
    ? CATALOG.filter((item) =>
        item.title.toLowerCase().includes(query.trim().toLowerCase())
      ).slice(0, 6)
    : [];

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "movies", label: "Movies", icon: Film },
    { id: "tv", label: "TV Shows", icon: Tv },
    { id: "watchlist", label: "My List", icon: Bookmark },
  ] as const;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || searchOpen
          ? "bg-[#0a0a0a]/95 backdrop-blur-md shadow-lg shadow-black/40"
          : "bg-gradient-to-b from-black/80 via-black/40 to-transparent"
      }`}
    >
      <div className="px-4 md:px-8 lg:px-12 h-16 flex items-center gap-4 md:gap-8">
        {/* Logo */}
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-1 shrink-0 group"
        >
          <span className="text-red-600 text-2xl font-black tracking-tighter group-hover:text-red-500 transition-colors">
            MJ
          </span>
          <span className="text-white text-2xl font-black tracking-tighter group-hover:text-gray-200 transition-colors">
            NETFLIX
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = view === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 rounded ${
                  active
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
                {item.id === "watchlist" && watchlistCount > 0 && (
                  <span className="ml-1 bg-red-600 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {watchlistCount}
                  </span>
                )}
                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-red-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Search */}
        <div className="flex-1 flex justify-end items-center gap-2">
          <div className="relative">
            <div
              className={`flex items-center transition-all duration-300 overflow-hidden ${
                searchOpen ? "w-44 sm:w-56 md:w-72" : "w-9"
              }`}
            >
              <button
                onClick={() => {
                  setSearchOpen(!searchOpen);
                  setQuery("");
                }}
                className="shrink-0 w-9 h-9 flex items-center justify-center text-white hover:text-red-500 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
              {searchOpen && (
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search titles..."
                  className="flex-1 bg-black/60 border border-white/20 text-white text-sm px-3 py-1.5 rounded-md outline-none focus:border-red-600 transition-colors min-w-0"
                />
              )}
            </div>

            {/* Search Results Dropdown */}
            {searchOpen && results.length > 0 && (
              <div className="absolute top-12 right-0 w-72 bg-[#141414] border border-white/10 rounded-lg shadow-2xl shadow-black/60 overflow-hidden max-h-[70vh] overflow-y-auto">
                {results.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectContent(item);
                      setSearchOpen(false);
                      setQuery("");
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-white/10 transition-colors text-left"
                  >
                    <img
                      src={item.poster}
                      alt={item.title}
                      className="w-10 h-14 object-cover rounded shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {item.title}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {item.type === "movie" ? "Movie" : "TV Series"} ·{" "}
                        {item.year}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {searchOpen && query.trim() && results.length === 0 && (
              <div className="absolute top-12 right-0 w-72 bg-[#141414] border border-white/10 rounded-lg shadow-2xl p-4 text-center">
                <p className="text-gray-400 text-sm">No results found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <nav className="md:hidden flex items-center justify-around border-t border-white/10 bg-[#0a0a0a]/95 backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative flex flex-col items-center gap-0.5 py-2 px-2 transition-colors ${
                active ? "text-red-500" : "text-gray-400"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.id === "watchlist" && watchlistCount > 0 && (
                <span className="absolute top-1 right-0 bg-red-600 text-white text-[8px] font-bold rounded-full min-w-[14px] h-[14px] flex items-center justify-center px-0.5">
                  {watchlistCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
