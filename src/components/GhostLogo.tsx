"use client";

interface Props {
  size?: number;
  className?: string;
  animated?: boolean;
}

export function GhostLogo({ size = 48, className = "", animated = false }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${className} ${animated ? "animate-float" : ""}`}
      style={animated ? { animation: "ghostFloat 3s ease-in-out infinite" } : {}}
    >
      <defs>
        <linearGradient id="ghostGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff3333" />
          <stop offset="50%" stopColor="#e50914" />
          <stop offset="100%" stopColor="#8b0000" />
        </linearGradient>
        <filter id="ghostGlow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Ghost body */}
      <path
        d="M50 10 
           C25 10 15 30 15 50 
           L15 85 
           C15 88 18 90 20 87 
           L25 80 
           C27 77 30 77 32 80 
           L37 87 
           C39 90 42 90 44 87 
           L50 78 
           C52 75 55 75 57 78 
           L63 87 
           C65 90 68 90 70 87 
           L75 80 
           C77 77 80 77 82 80 
           L85 87 
           C87 90 90 88 90 85 
           L90 50 
           C90 30 80 10 50 10 Z"
        fill="url(#ghostGrad)"
        filter="url(#ghostGlow)"
      />
      {/* Left eye */}
      <ellipse cx="38" cy="45" rx="8" ry="10" fill="#000" />
      <ellipse cx="40" cy="43" rx="3" ry="4" fill="#fff" />
      {/* Right eye */}
      <ellipse cx="62" cy="45" rx="8" ry="10" fill="#000" />
      <ellipse cx="64" cy="43" rx="3" ry="4" fill="#fff" />
      {/* Mouth */}
      <ellipse cx="50" cy="62" rx="6" ry="4" fill="#000" />
    </svg>
  );
}

export function GhostLogoSad({ size = 48, className = "" }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <defs>
        <linearGradient id="ghostGradSad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#666" />
          <stop offset="100%" stopColor="#333" />
        </linearGradient>
      </defs>
      {/* Ghost body */}
      <path
        d="M50 10 C25 10 15 30 15 50 L15 85 C15 88 18 90 20 87 L25 80 C27 77 30 77 32 80 L37 87 C39 90 42 90 44 87 L50 78 C52 75 55 75 57 78 L63 87 C65 90 68 90 70 87 L75 80 C77 77 80 77 82 80 L85 87 C87 90 90 88 90 85 L90 50 C90 30 80 10 50 10 Z"
        fill="url(#ghostGradSad)"
      />
      {/* Sad eyes */}
      <ellipse cx="38" cy="48" rx="6" ry="4" fill="#000" />
      <ellipse cx="62" cy="48" rx="6" ry="4" fill="#000" />
      {/* Tear */}
      <ellipse cx="42" cy="56" rx="3" ry="5" fill="#4af" opacity="0.7" />
      {/* Sad mouth */}
      <path d="M40 68 Q50 62 60 68" stroke="#000" strokeWidth="3" fill="none" />
    </svg>
  );
}
