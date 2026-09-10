// Deterministic gradient poster generator.
// Used when a catalog title doesn't have a real Pexels image assigned,
// so every card still looks like a real movie poster.

const GRADIENTS: { from: string; to: string; accent: string }[] = [
  { from: "#1a1a2e", to: "#16213e", accent: "#e94560" },
  { from: "#0f0c29", to: "#302b63", accent: "#24243e" },
  { from: "#1f0e0e", to: "#3d1612", accent: "#8b0000" },
  { from: "#0d1b2a", to: "#1b263b", accent: "#415a77" },
  { from: "#1a0a1a", to: "#2d1b3d", accent: "#6a0572" },
  { from: "#0a1a0a", to: "#1b3a1b", accent: "#2d5016" },
  { from: "#1a1000", to: "#3d2b00", accent: "#b8860b" },
  { from: "#0e0e0e", to: "#2a2a2a", accent: "#ff4500" },
  { from: "#100c1a", to: "#1a0a2e", accent: "#6c00b8" },
  { from: "#1a1209", to: "#3e2c14", accent: "#cd7f32" },
  { from: "#0a0e1a", to: "#16223e", accent: "#0066cc" },
  { from: "#1a0e0a", to: "#3e1a12", accent: "#cc3300" },
  { from: "#0a1a14", to: "#143a2e", accent: "#00805a" },
  { from: "#140a14", to: "#2e1430", accent: "#9c00cc" },
  { from: "#1a0a0a", to: "#3a1414", accent: "#cc0044" },
  { from: "#0a0a14", to: "#1a1a3e", accent: "#0044cc" },
  { from: "#14140a", to: "#3e3e14", accent: "#888800" },
  { from: "#0a1414", to: "#143e3e", accent: "#008888" },
  { from: "#140a0e", to: "#3e141e", accent: "#cc0066" },
  { from: "#0e0a14", to: "#1e143e", accent: "#4400cc" },
];

// Simple string hash for deterministic selection
function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getGradient(title: string) {
  return GRADIENTS[hash(title) % GRADIENTS.length];
}

export function gradientStyle(title: string): React.CSSProperties {
  const g = getGradient(title);
  return {
    background: `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)`,
  };
}

export function gradientCssText(title: string): string {
  const g = getGradient(title);
  return `linear-gradient(135deg, ${g.from} 0%, ${g.to} 100%)`;
}

export function accentColor(title: string): string {
  return getGradient(title).accent;
}
