import { Play, Info, Star, Bookmark, Check } from "lucide-react";
import type { ContentItem } from "@/types";

interface HeroProps {
  item: ContentItem;
  onPlay: () => void;
  onMoreInfo: () => void;
  inWatchlist: boolean;
  onToggleWatchlist: () => void;
}

export default function Hero({
  item,
  onPlay,
  onMoreInfo,
  inWatchlist,
  onToggleWatchlist,
}: HeroProps) {
  return (
    <section className="relative h-[90vh] min-h-[600px] w-full overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0">
        <img
          src={item.backdrop}
          alt={item.title}
          className="w-full h-full object-cover scale-105"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end md:items-center px-4 md:px-8 lg:px-12 pb-20 md:pb-0">
        <div className="max-w-2xl pt-20">
          {/* Badge */}
          <div className="flex items-center gap-3 mb-4 animate-[fadeInUp_0.6s_ease]">
            <span className="bg-red-600 text-white text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded">
              {item.type === "movie" ? "Movie" : "Series"}
            </span>
            <span className="flex items-center gap-1 text-yellow-400">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm font-semibold">{item.rating}</span>
            </span>
            <span className="text-gray-300 text-sm">{item.year}</span>
            <span className="text-gray-300 text-sm">{item.duration}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-4 animate-[fadeInUp_0.7s_ease] drop-shadow-2xl">
            {item.title}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap items-center gap-2 mb-4 animate-[fadeInUp_0.8s_ease]">
            {item.genres.map((genre) => (
              <span
                key={genre}
                className="text-sm text-gray-300 border border-white/20 rounded-full px-3 py-0.5"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-6 max-w-xl line-clamp-3 animate-[fadeInUp_0.9s_ease] drop-shadow-lg">
            {item.description}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 animate-[fadeInUp_1s_ease]">
            <button
              onClick={onPlay}
              className="flex items-center gap-2 bg-white text-black font-bold px-6 md:px-8 py-3 rounded-md hover:bg-white/80 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              <Play className="w-5 h-5 fill-current" />
              Play
            </button>
            <button
              onClick={onMoreInfo}
              className="flex items-center gap-2 bg-white/20 text-white font-bold px-6 md:px-8 py-3 rounded-md hover:bg-white/30 transition-all backdrop-blur-sm"
            >
              <Info className="w-5 h-5" />
              More Info
            </button>
            <button
              onClick={onToggleWatchlist}
              className="flex items-center justify-center w-12 h-12 bg-black/50 border-2 border-white/40 text-white rounded-full hover:border-white transition-all backdrop-blur-sm"
              title={inWatchlist ? "Remove from My List" : "Add to My List"}
            >
              {inWatchlist ? (
                <Check className="w-5 h-5" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Age rating tag */}
      <div className="absolute right-0 bottom-20 md:bottom-32 hidden md:flex items-center bg-black/40 border-l-4 border-white pl-4 pr-8 py-1 text-white text-sm">
        {item.type === "movie" ? "Movie" : "TV"}
      </div>
    </section>
  );
}
