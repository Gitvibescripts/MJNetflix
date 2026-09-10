import { useState } from "react";
import { Play, Film, Tv, AlertCircle, Search, Zap } from "lucide-react";
import type { ContentItem, MediaType } from "@/types";

interface QuickWatchProps {
  onWatch: (item: ContentItem) => void;
}

export default function QuickWatch({ onWatch }: QuickWatchProps) {
  const [type, setType] = useState<MediaType>("movie");
  const [code, setCode] = useState("");
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [error, setError] = useState("");

  const handleWatch = () => {
    const trimmed = code.trim();
    if (!trimmed) {
      setError("Enter an IMDb code (e.g. tt1300854) or TV show ID (e.g. 1399)");
      return;
    }
    setError("");
    onWatch({
      id: "quickwatch-" + trimmed,
      title:
        type === "movie"
          ? `Quick Watch — ${trimmed}`
          : `Quick Watch — TV ${trimmed}`,
      type,
      embedId: trimmed,
      year: 0,
      rating: "-",
      duration: type === "tv" ? `${season} Seasons` : "-",
      genres: [],
      description: "",
      poster: "",
      backdrop: "",
      seasons: type === "tv" ? 50 : undefined,
    });
  };

  return (
    <div className="relative z-10 px-4 md:px-8 lg:px-12 -mt-8 mb-8">
      <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0d0d0d] border border-white/10 rounded-xl p-4 md:p-6 shadow-2xl shadow-black/60">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-white text-lg md:text-xl font-bold">
              Quick Watch
            </h2>
            <p className="text-gray-400 text-xs md:text-sm">
              Paste any IMDb or TV code and start watching instantly
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-3">
          {/* Type toggle */}
          <div className="flex bg-black/40 rounded-lg p-1 shrink-0">
            <button
              onClick={() => setType("movie")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                type === "movie"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Film className="w-4 h-4" />
              Movie
            </button>
            <button
              onClick={() => setType("tv")}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                type === "tv"
                  ? "bg-red-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Tv className="w-4 h-4" />
              TV
            </button>
          </div>

          {/* Code input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleWatch()}
              placeholder={
                type === "movie"
                  ? "Enter IMDb code — e.g. tt1300854"
                  : "Enter TV show ID — e.g. 1399"
              }
              className="w-full bg-black/40 border border-white/15 text-white pl-10 pr-4 py-2.5 rounded-lg outline-none focus:border-red-600 transition-colors font-mono text-sm"
            />
          </div>

          {/* TV season/episode (compact) */}
          {type === "tv" && (
            <div className="flex gap-2 shrink-0">
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 rounded-lg px-3 py-1">
                <span className="text-gray-500 text-xs">S</span>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={season}
                  onChange={(e) =>
                    setSeason(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-10 bg-transparent text-white text-sm outline-none text-center"
                />
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 border border-white/15 rounded-lg px-3 py-1">
                <span className="text-gray-500 text-xs">E</span>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={episode}
                  onChange={(e) =>
                    setEpisode(Math.max(1, parseInt(e.target.value) || 1))
                  }
                  className="w-10 bg-transparent text-white text-sm outline-none text-center"
                />
              </div>
            </div>
          )}

          {/* Watch button */}
          <button
            onClick={handleWatch}
            className="flex items-center justify-center gap-2 bg-red-600 text-white font-bold px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors shrink-0"
          >
            <Play className="w-4 h-4 fill-current" />
            Watch Now
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Quick examples */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-white/5">
          <span className="text-gray-500 text-xs">Try:</span>
          {[
            { label: "Iron Man 3 (tt1300854)", type: "movie" as const, code: "tt1300854" },
            { label: "Dark Knight (tt0468569)", type: "movie" as const, code: "tt0468569" },
            { label: "Game of Thrones (1399)", type: "tv" as const, code: "1399" },
            { label: "Breaking Bad (1396)", type: "tv" as const, code: "1396" },
            { label: "Stranger Things (60735)", type: "tv" as const, code: "60735" },
          ].map((ex) => (
            <button
              key={ex.code}
              onClick={() => {
                setType(ex.type);
                setCode(ex.code);
                setError("");
              }}
              className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-2.5 py-1 rounded-md font-mono transition-colors"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
