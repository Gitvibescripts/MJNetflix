import { useState, useEffect, useRef } from "react";
import {
  X, Play, Star, Plus, Check, Calendar, Clock, Film, Tv,
  AlertCircle, Link2, ExternalLink, RefreshCw, Server,
} from "lucide-react";
import type { ContentItem, MediaType } from "@/types";

interface PlayerModalProps {
  item: ContentItem | null;
  onClose: () => void;
  inWatchlist: boolean;
  onToggleWatchlist: (item: ContentItem) => void;
}

interface SourceProvider {
  id: string;
  label: string;
  build: (type: MediaType, embedId: string, season?: number, episode?: number) => string;
}

const SOURCES: SourceProvider[] = [
  {
    id: "vidsrcme",
    label: "VidSrc.me",
    build: (type, id, s, e) =>
      type === "movie"
        ? `https://vidsrcme.ru/embed/movie/${id}`
        : `https://vidsrcme.ru/embed/tv/${id}/${s ?? 1}/${e ?? 1}`,
  },
  {
    id: "vidsrcsbs",
    label: "VidSrc.sbs",
    build: (type, id, s, e) =>
      type === "movie"
        ? `https://vidsrc.sbs/embed/movie/${id}`
        : `https://vidsrc.sbs/embed/tv/${id}/${s ?? 1}/${e ?? 1}`,
  },
  {
    id: "vidsrcxyz",
    label: "VidSrc.xyz",
    build: (type, id, s, e) =>
      type === "movie"
        ? `https://vidsrc.xyz/embed/movie/${id}`
        : `https://vidsrc.xyz/embed/tv/${id}/${s ?? 1}-${e ?? 1}`,
  },
  {
    id: "vidsrcin",
    label: "VidSrc.in",
    build: (type, id, s, e) =>
      type === "movie"
        ? `https://vidsrc.in/embed/movie/${id}`
        : `https://vidsrc.in/embed/tv/${id}/${s ?? 1}/${e ?? 1}`,
  },
  {
    id: "2embed",
    label: "2Embed.cc",
    build: (type, id, s, e) =>
      type === "movie"
        ? `https://www.2embed.cc/embed/${id}`
        : `https://www.2embed.cc/embedtv/${id}&s=${s ?? 1}&e=${e ?? 1}`,
  },
  {
    id: "embedsu",
    label: "Embed.su",
    build: (type, id, s, e) =>
      type === "movie"
        ? `https://embed.su/embed/movie/${id}`
        : `https://embed.su/embed/tv/${id}/${s ?? 1}/${e ?? 1}`,
  },
];

export default function PlayerModal({
  item,
  onClose,
  inWatchlist,
  onToggleWatchlist,
}: PlayerModalProps) {
  const [mode, setMode] = useState<"details" | "player">("details");
  const [season, setSeason] = useState(1);
  const [episode, setEpisode] = useState(1);
  const [customMode, setCustomMode] = useState(false);
  const [customType, setCustomType] = useState<MediaType>("movie");
  const [customCode, setCustomCode] = useState("");
  const [customSeason, setCustomSeason] = useState(1);
  const [customEpisode, setCustomEpisode] = useState(1);
  const [customError, setCustomError] = useState("");
  const [activeCustomItem, setActiveCustomItem] = useState<ContentItem | null>(null);
  const [sourceIdx, setSourceIdx] = useState(0);
  const [iframeKey, setIframeKey] = useState(0);
  const [iframeLoading, setIframeLoading] = useState(true);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (item) {
      setMode("details");
      setSeason(1);
      setEpisode(1);
      setCustomMode(false);
      setCustomCode("");
      setCustomError("");
      setActiveCustomItem(null);
      setSourceIdx(0);
      setIframeKey(0);
      setIframeLoading(true);
    }
  }, [item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (item) {
      document.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  // Reset loading state when source or episode changes
  useEffect(() => {
    if (mode === "player") {
      setIframeLoading(true);
    }
  }, [sourceIdx, season, episode, customSeason, customEpisode, mode, iframeKey]);

  if (!item) return null;

  const currentItem = customMode && activeCustomItem ? activeCustomItem : item;
  const activeSeason = customMode ? customSeason : season;
  const activeEpisode = customMode ? customEpisode : episode;
  const source = SOURCES[sourceIdx];
  const embedUrl = source.build(
    currentItem.type,
    currentItem.embedId,
    currentItem.type === "tv" ? activeSeason : undefined,
    currentItem.type === "tv" ? activeEpisode : undefined
  );

  const handleCustomPlay = () => {
    const code = customCode.trim();
    if (!code) {
      setCustomError("Please enter an IMDb code (e.g. tt1300854) or TV show ID");
      return;
    }
    setCustomError("");
    setActiveCustomItem({
      id: "custom-" + code,
      title:
        customType === "movie"
          ? `Custom Movie (${code})`
          : `Custom TV Show (${code})`,
      type: customType,
      embedId: code,
      year: 0,
      rating: "-",
      duration: "-",
      genres: [],
      description: "",
      poster: "",
      backdrop: "",
      seasons: customType === "tv" ? 50 : undefined,
    });
    setSourceIdx(0);
    setIframeKey((k) => k + 1);
    setMode("player");
  };

  const switchSource = (idx: number) => {
    setSourceIdx(idx);
    setIframeKey((k) => k + 1);
  };

  const reloadIframe = () => {
    setIframeKey((k) => k + 1);
  };

  const openInNewTab = () => {
    window.open(embedUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl my-0 md:my-8 bg-[#141414] md:rounded-xl overflow-hidden shadow-2xl shadow-black/80"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-10 h-10 flex items-center justify-center bg-black/70 hover:bg-black/90 text-white rounded-full transition-all hover:scale-110"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Player / Backdrop area */}
        {mode === "player" ? (
          <div className="relative bg-black w-full aspect-video">
            {iframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-10 bg-black">
                <div className="w-12 h-12 border-4 border-white/20 border-t-red-600 rounded-full animate-spin" />
                <p className="text-gray-400 text-sm">
                  Loading {source.label}...
                </p>
                <p className="text-gray-600 text-xs max-w-md text-center px-4">
                  If the video doesn't appear within a few seconds, try switching
                  sources below or open in a new tab.
                </p>
              </div>
            )}
            <iframe
              key={iframeKey}
              ref={iframeRef}
              src={embedUrl}
              className="w-full h-full"
              frameBorder={0}
              allowFullScreen
              referrerPolicy="no-referrer"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture; fullscreen"
              title={currentItem.title}
              onLoad={() => setIframeLoading(false)}
            />
          </div>
        ) : (
          <div className="relative h-[40vh] md:h-[50vh] w-full">
            <img
              src={currentItem.backdrop || currentItem.poster}
              alt={currentItem.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8">
              <h2 className="text-white text-2xl md:text-4xl font-black mb-3 drop-shadow-2xl">
                {currentItem.title}
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star className="w-4 h-4 fill-current" />
                  {currentItem.rating}
                </span>
                <span className="flex items-center gap-1 text-gray-300">
                  <Calendar className="w-4 h-4" />
                  {currentItem.year || "—"}
                </span>
                <span className="flex items-center gap-1 text-gray-300">
                  <Clock className="w-4 h-4" />
                  {currentItem.duration}
                </span>
                <span className="flex items-center gap-1 text-gray-300">
                  {currentItem.type === "movie" ? (
                    <Film className="w-4 h-4" />
                  ) : (
                    <Tv className="w-4 h-4" />
                  )}
                  {currentItem.type === "movie" ? "Movie" : "TV Series"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="p-4 md:p-8">
          {/* Action bar */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {mode === "player" ? (
              <button
                onClick={() => setMode("details")}
                className="flex items-center gap-2 bg-white/10 text-white font-semibold px-4 py-2.5 rounded-md hover:bg-white/20 transition-colors"
              >
                <X className="w-4 h-4" />
                Stop
              </button>
            ) : (
              <button
                onClick={() => {
                  setIframeKey((k) => k + 1);
                  setMode("player");
                }}
                className="flex items-center gap-2 bg-white text-black font-bold px-6 py-2.5 rounded-md hover:bg-white/80 transition-all hover:scale-105"
              >
                <Play className="w-5 h-5 fill-current" />
                Play
              </button>
            )}
            <button
              onClick={() => onToggleWatchlist(currentItem)}
              className="flex items-center justify-center w-10 h-10 bg-white/10 border-2 border-white/40 text-white rounded-full hover:border-white hover:bg-white/20 transition-all"
              title={inWatchlist ? "Remove from My List" : "Add to My List"}
            >
              {inWatchlist ? (
                <Check className="w-5 h-5" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </button>
            {/* Custom code toggle */}
            <button
              onClick={() => setCustomMode(!customMode)}
              className={`flex items-center gap-2 ml-auto font-semibold px-4 py-2.5 rounded-md transition-colors ${
                customMode
                  ? "bg-red-600 text-white"
                  : "bg-white/10 text-white hover:bg-white/20"
              }`}
            >
              <Link2 className="w-4 h-4" />
              Custom Code
            </button>
          </div>

          {/* Source switcher — only visible in player mode */}
          {mode === "player" && (
            <div className="mb-6 bg-[#0a0a0a] border border-white/10 rounded-lg p-3 md:p-4">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="flex items-center gap-1.5 text-gray-400 text-sm font-medium mr-2">
                  <Server className="w-4 h-4" />
                  Source:
                </div>
                {SOURCES.map((src, idx) => (
                  <button
                    key={src.id}
                    onClick={() => switchSource(idx)}
                    className={`text-xs font-medium px-3 py-1.5 rounded transition-colors ${
                      idx === sourceIdx
                        ? "bg-red-600 text-white"
                        : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {src.label}
                  </button>
                ))}
                <div className="flex-1" />
                <button
                  onClick={reloadIframe}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reload
                </button>
                <button
                  onClick={openInNewTab}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  New Tab
                </button>
              </div>
              {iframeLoading && (
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Not loading? Try a different source above — some providers go
                  down temporarily.
                </div>
              )}
            </div>
          )}

          {/* Custom code input */}
          {customMode && (
            <div className="mb-6 bg-[#0a0a0a] border border-white/10 rounded-lg p-4 md:p-5">
              <h3 className="text-white font-bold text-lg mb-1">
                Watch by IMDb / TV Code
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Enter an IMDb ID (e.g.{" "}
                <span className="text-gray-200 font-mono">tt1300854</span>) for
                movies or a TV show ID (e.g.{" "}
                <span className="text-gray-200 font-mono">1399</span>) for
                series. The player loads from the embed source.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                {/* Type selector */}
                <div className="flex bg-white/5 rounded-md p-1 shrink-0">
                  <button
                    onClick={() => setCustomType("movie")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      customType === "movie"
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Film className="w-4 h-4" />
                    Movie
                  </button>
                  <button
                    onClick={() => setCustomType("tv")}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded text-sm font-medium transition-colors ${
                      customType === "tv"
                        ? "bg-red-600 text-white"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Tv className="w-4 h-4" />
                    TV
                  </button>
                </div>

                {/* Code input */}
                <input
                  type="text"
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCustomPlay()}
                  placeholder={customType === "movie" ? "tt1300854" : "1399"}
                  className="flex-1 bg-white/5 border border-white/20 text-white px-4 py-2.5 rounded-md outline-none focus:border-red-600 transition-colors font-mono text-sm"
                />

                {/* Play button */}
                <button
                  onClick={handleCustomPlay}
                  className="flex items-center justify-center gap-2 bg-red-600 text-white font-bold px-5 py-2.5 rounded-md hover:bg-red-700 transition-colors shrink-0"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Watch
                </button>
              </div>

              {/* TV season/episode selectors */}
              {customType === "tv" && (
                <div className="flex items-center gap-3 mt-3">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    Season
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={customSeason}
                      onChange={(e) =>
                        setCustomSeason(
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      className="w-16 bg-white/5 border border-white/20 text-white px-2 py-1.5 rounded outline-none focus:border-red-600 text-center"
                    />
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    Episode
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={customEpisode}
                      onChange={(e) =>
                        setCustomEpisode(
                          Math.max(1, parseInt(e.target.value) || 1)
                        )
                      }
                      className="w-16 bg-white/5 border border-white/20 text-white px-2 py-1.5 rounded outline-none focus:border-red-600 text-center"
                    />
                  </label>
                </div>
              )}

              {customError && (
                <div className="flex items-center gap-2 mt-3 text-red-400 text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {customError}
                </div>
              )}

              {/* Example links */}
              <div className="mt-4 pt-3 border-t border-white/10">
                <p className="text-gray-500 text-xs mb-2">Quick examples:</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    {
                      label: "Movie: tt1300854",
                      type: "movie" as const,
                      code: "tt1300854",
                    },
                    {
                      label: "Movie: tt0468569",
                      type: "movie" as const,
                      code: "tt0468569",
                    },
                    { label: "TV: 1399", type: "tv" as const, code: "1399" },
                    { label: "TV: 1396", type: "tv" as const, code: "1396" },
                  ].map((ex) => (
                    <button
                      key={ex.code}
                      onClick={() => {
                        setCustomType(ex.type);
                        setCustomCode(ex.code);
                        setCustomError("");
                      }}
                      className="text-xs bg-white/5 hover:bg-white/10 text-gray-300 px-2.5 py-1.5 rounded font-mono transition-colors"
                    >
                      {ex.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TV season/episode selector for catalog items */}
          {currentItem.type === "tv" &&
            !customMode &&
            currentItem.seasons && (
              <div className="mb-6">
                <h3 className="text-white font-bold text-lg mb-3">Episodes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    Season
                    <select
                      value={season}
                      onChange={(e) => {
                        setSeason(parseInt(e.target.value));
                        setEpisode(1);
                        setIframeKey((k) => k + 1);
                      }}
                      className="bg-white/5 border border-white/20 text-white px-3 py-2 rounded outline-none focus:border-red-600 cursor-pointer"
                    >
                      {Array.from(
                        { length: currentItem.seasons },
                        (_, i) => i + 1
                      ).map((s) => (
                        <option key={s} value={s} className="bg-[#141414]">
                          Season {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300">
                    Episode
                    <select
                      value={episode}
                      onChange={(e) => {
                        setEpisode(parseInt(e.target.value));
                        setIframeKey((k) => k + 1);
                      }}
                      className="bg-white/5 border border-white/20 text-white px-3 py-2 rounded outline-none focus:border-red-600 cursor-pointer"
                    >
                      {Array.from({ length: 24 }, (_, i) => i + 1).map((ep) => (
                        <option key={ep} value={ep} className="bg-[#141414]">
                          Episode {ep}
                        </option>
                      ))}
                    </select>
                  </label>
                  {mode === "details" && (
                    <button
                      onClick={() => {
                        setIframeKey((k) => k + 1);
                        setMode("player");
                      }}
                      className="ml-auto flex items-center gap-2 bg-white text-black font-bold px-4 py-2 rounded-md hover:bg-white/80 transition-colors text-sm"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      Play S{season} E{episode}
                    </button>
                  )}
                </div>
              </div>
            )}

          {/* Description and details */}
          {!customMode && currentItem.description && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <p className="text-gray-200 text-base leading-relaxed mb-4">
                  {currentItem.description}
                </p>
              </div>
              <div className="space-y-3">
                {currentItem.genres.length > 0 && (
                  <div>
                    <span className="text-gray-500 text-sm">Genres: </span>
                    <span className="text-gray-200 text-sm">
                      {currentItem.genres.join(", ")}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500 text-sm">Type: </span>
                  <span className="text-gray-200 text-sm">
                    {currentItem.type === "movie" ? "Movie" : "TV Series"}
                  </span>
                </div>
                {currentItem.embedId && (
                  <div>
                    <span className="text-gray-500 text-sm">Embed ID: </span>
                    <span className="text-gray-200 text-sm font-mono">
                      {currentItem.embedId}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
