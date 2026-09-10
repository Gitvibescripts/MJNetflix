import { gradientCssText, accentColor } from "@/utils/posterGradient";

interface PosterProps {
  title: string;
  poster: string;
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
}

export default function Poster({
  title,
  poster,
  alt,
  className = "",
  loading = "lazy",
}: PosterProps) {
  if (poster) {
    return (
      <img
        src={poster}
        alt={alt}
        className={className}
        loading={loading}
      />
    );
  }

  const bg = gradientCssText(title);
  const accent = accentColor(title);

  return (
    <div
      className={`${className} relative flex flex-col items-center justify-center overflow-hidden`}
      style={{ background: bg }}
    >
      {/* Decorative accent glow */}
      <div
        className="absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-20 blur-2xl"
        style={{ background: accent }}
      />
      <div
        className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full opacity-10 blur-2xl"
        style={{ background: accent }}
      />
      {/* Title text */}
      <div className="relative px-3 text-center">
        <p
          className="font-black leading-tight text-white/90"
          style={{ fontSize: "clamp(0.7rem, 2vw, 1rem)" }}
        >
          {title}
        </p>
      </div>
      {/* Accent bar at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: accent }}
      />
    </div>
  );
}
