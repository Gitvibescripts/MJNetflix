import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Star, Plus, Check } from "lucide-react";
import type { ContentItem } from "@/types";
import Poster from "@/components/Poster";

interface ContentRowProps {
  title: string;
  items: ContentItem[];
  onSelect: (item: ContentItem) => void;
  watchlistIds: Set<string>;
  onToggleWatchlist: (item: ContentItem) => void;
}

export default function ContentRow({
  title,
  items,
  onSelect,
  watchlistIds,
  onToggleWatchlist,
}: ContentRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 8);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 8);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [items]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.8;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (items.length === 0) return null;

  return (
    <div className="relative group/row mb-8 md:mb-12">
      <h2 className="text-white text-lg md:text-2xl font-bold mb-3 px-4 md:px-8 lg:px-12">
        {title}
      </h2>

      <div className="relative">
        {/* Scroll buttons */}
        {canScrollLeft && (
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-0 bottom-0 z-20 w-10 md:w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 z-20 w-10 md:w-12 flex items-center justify-center bg-black/50 opacity-0 group-hover/row:opacity-100 transition-opacity hover:bg-black/70"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-2 md:gap-3 overflow-x-auto scroll-smooth px-4 md:px-8 lg:px-12 pb-4 scrollbar-hide"
        >
          {items.map((item) => {
            const inList = watchlistIds.has(item.id);
            return (
              <div
                key={item.id}
                className="relative shrink-0 w-[140px] sm:w-[170px] md:w-[200px] lg:w-[220px] aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group/card transition-all duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-black/80"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelect(item)}
              >
                <Poster
                  title={item.title}
                  poster={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* Top badge */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-current" />
                    {item.rating}
                  </span>
                </div>

                {/* Type badge */}
                <div className="absolute top-2 right-2">
                  <span className="bg-red-600/90 text-white text-[10px] font-bold uppercase px-1.5 py-0.5 rounded">
                    {item.type === "movie" ? "Movie" : "TV"}
                  </span>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white text-sm font-bold truncate mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-xs">
                    {item.year} · {item.duration}
                  </p>
                </div>

                {/* Hover overlay */}
                <div
                  className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 transition-opacity duration-200 ${
                    hoveredId === item.id ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelect(item);
                    }}
                    className="flex items-center gap-1.5 bg-white text-black text-sm font-bold px-4 py-2 rounded-md hover:bg-white/80 transition-colors"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    Play
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWatchlist(item);
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-black/60 border-2 border-white/50 text-white rounded-full hover:border-white transition-colors"
                  >
                    {inList ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
