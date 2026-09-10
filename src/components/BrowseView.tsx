import { Film, Tv, Star, Play } from "lucide-react";
import type { ContentItem } from "@/types";
import Poster from "@/components/Poster";

interface BrowseViewProps {
  title: string;
  filterType: "movie" | "tv";
  items: ContentItem[];
  onSelect: (item: ContentItem) => void;
  watchlistIds: Set<string>;
}

export default function BrowseView({
  title,
  items,
  onSelect,
}: BrowseViewProps) {
  return (
    <div className="pt-24 pb-12 px-4 md:px-8 lg:px-12">
      <h1 className="text-white text-2xl md:text-3xl font-bold mb-6">{title}</h1>

      {items.length === 0 ? (
        <p className="text-gray-400">No titles found.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-lg overflow-hidden bg-[#141414] cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/80"
              onClick={() => onSelect(item)}
            >
              <div className="aspect-[2/3] relative">
                <Poster
                  title={item.title}
                  poster={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="bg-black/70 backdrop-blur-sm text-yellow-400 text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-current" />
                    {item.rating}
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className="bg-red-600/90 text-white text-[10px] font-bold uppercase px-1.5 py-0.5 rounded flex items-center gap-1">
                    {item.type === "movie" ? (
                      <Film className="w-3 h-3" />
                    ) : (
                      <Tv className="w-3 h-3" />
                    )}
                    {item.type === "movie" ? "Movie" : "TV"}
                  </span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                  <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-6 h-6 fill-black text-black" />
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <h3 className="text-white text-sm font-bold truncate mb-0.5">
                    {item.title}
                  </h3>
                  <p className="text-gray-300 text-xs">
                    {item.year} · {item.duration}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
