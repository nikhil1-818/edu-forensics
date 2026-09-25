import React from 'react';

interface LogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  theme?: 'dark' | 'light';
  subtext?: string;
  className?: string;
}

export const EduForensicsMark: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = '',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        {/* Deep Crimson Shield Outer Gradient */}
        <linearGradient id="ef-shield-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#DC2626" />
          <stop offset="50%" stopColor="#B91C1C" />
          <stop offset="100%" stopColor="#7F1D1D" />
        </linearGradient>

        {/* Facet Light Gradient */}
        <linearGradient id="ef-facet-top" x1="24" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#B91C1C" stopOpacity="0" />
        </linearGradient>

        {/* Inner Core Gradient */}
        <linearGradient id="ef-core-grad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FEE2E2" />
        </linearGradient>

        {/* Neon Forensic Beam */}
        <linearGradient id="ef-beam-grad" x1="6" y1="24" x2="42" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F87171" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#F87171" stopOpacity="0.1" />
        </linearGradient>

        {/* Drop shadow for institutional weight */}
        <filter id="ef-shadow" x="0" y="2" width="48" height="46" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#7F1D1D" floodOpacity="0.35" />
        </filter>
      </defs>

      {/* Main Hexagonal Forensic Shield Body */}
      <g filter="url(#ef-shadow)">
        <path
          d="M24 3L41.3205 13V33L24 43L6.67949 33V13L24 3Z"
          fill="url(#ef-shield-grad)"
        />
        {/* Precision Beveled Outer Rim */}
        <path
          d="M24 3L41.3205 13V33L24 43L6.67949 33V13L24 3Z"
          stroke="#EF4444"
          strokeWidth="1.2"
          strokeLinejoin="round"
          strokeOpacity="0.7"
        />
      </g>

      {/* Dimensional Top-Facet Reflection */}
      <path
        d="M24 3.5L40.5 13.2L24 23.5L7.5 13.2L24 3.5Z"
        fill="url(#ef-facet-top)"
      />

      {/* Central Forensic Knowledge Graph & Prerequisite Causal DAG */}
      {/* Causal Graph Vectors / Edges */}
      <g stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9">
        {/* Prerequisite Node Vectors */}
        <line x1="24" y1="13" x2="16" y2="21" />
        <line x1="24" y1="13" x2="32" y2="21" />
        <line x1="16" y1="21" x2="24" y2="28" />
        <line x1="32" y1="21" x2="24" y2="28" />
        <line x1="24" y1="28" x2="24" y2="36" />
        
        {/* Diagnostic Cross-Tie */}
        <line x1="16" y1="21" x2="32" y2="21" strokeDasharray="1.5 2" strokeOpacity="0.6" strokeWidth="1" />
      </g>

      {/* Upstream Root Prerequisite Node (Top) */}
      <circle cx="24" cy="13" r="2.8" fill="white" />
      <circle cx="24" cy="13" r="1.4" fill="#991B1B" />

      {/* Intermediate Dependency Nodes (Left & Right) */}
      <circle cx="16" cy="21" r="2.4" fill="white" />
      <circle cx="16" cy="21" r="1.2" fill="#B91C1C" />

      <circle cx="32" cy="21" r="2.4" fill="white" />
      <circle cx="32" cy="21" r="1.2" fill="#B91C1C" />

      {/* Central Forensic Focal Bottleneck Node (Center Target) */}
      <circle cx="24" cy="28" r="3.4" fill="white" />
      <circle cx="24" cy="28" r="2" fill="#DC2626" />
      <circle cx="24" cy="28" r="0.8" fill="white" />

      {/* Terminal Downstream Outcome Node (Bottom) */}
      <circle cx="24" cy="36" r="2.2" fill="#FCA5A5" />
      <circle cx="24" cy="36" r="1" fill="#7F1D1D" />

      {/* Subtle Optical Forensic Reticle Corner Ticks */}
      <path
        d="M20 28H19 M28 28H29 M24 24V25 M24 31V32"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeLinecap="round"
        strokeOpacity="0.75"
      />
    </svg>
  );
};

export const EduForensicsLogo: React.FC<LogoProps> = ({
  size = 'md',
  showWordmark = true,
  theme = 'dark', // 'dark' = dark text for light bg; 'light' = white text for dark bg
  subtext = 'Intelligence & Digital Twin',
  className = '',
}) => {
  const sizeMap = {
    xs: { px: 24, text: 'text-sm', sub: 'text-[9px]', tracking: 'tracking-tight' },
    sm: { px: 30, text: 'text-base', sub: 'text-[9px]', tracking: 'tracking-tight' },
    md: { px: 38, text: 'text-lg', sub: 'text-[10px]', tracking: 'tracking-tight' },
    lg: { px: 46, text: 'text-xl', sub: 'text-[11px]', tracking: 'tracking-tight' },
    xl: { px: 56, text: 'text-2xl', sub: 'text-xs', tracking: 'tracking-tight' },
  };

  const currentSize = sizeMap[size];

  const primaryTextColor = theme === 'light' ? 'text-white' : 'text-slate-900';
  const subTextColor = theme === 'light' ? 'text-red-400' : 'text-red-700';

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Forensic Causal Emblem */}
      <EduForensicsMark size={currentSize.px} />

      {/* Institutional Wordmark */}
      {showWordmark && (
        <div className="flex flex-col justify-center leading-none">
          <div className="flex items-center">
            <span className={`font-black font-mono ${currentSize.text} ${primaryTextColor} tracking-tight`}>
              EDU
            </span>
            <span className={`font-black font-mono ${currentSize.text} text-red-700 tracking-tight`}>
              FORENSICS
            </span>
          </div>
          {subtext && (
            <p className={`mt-1 font-mono uppercase font-semibold tracking-widest ${currentSize.sub} ${subTextColor}`}>
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
