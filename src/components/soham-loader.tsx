'use client';

/**
 * SohamLoader — the canonical SOHAM brand loading animation.
 *
 * Three curved strokes (orange / blue / green) chase each other around
 * the logo while the whole mark slowly rotates and pulses.
 *
 * Usage:
 *   <SohamLoader />                        — full-screen overlay (default)
 *   <SohamLoader variant="inline" />       — small inline spinner (chat)
 *   <SohamLoader variant="overlay" />      — full-screen (page transitions)
 *   <SohamLoader size={48} label="..." />  — custom size / label
 */

import { cn } from '@/lib/utils';

interface SohamLoaderProps {
  /** 'overlay' = full-screen centred, 'inline' = fits in parent */
  variant?: 'overlay' | 'inline';
  /** Diameter of the SVG in px (default 80 for overlay, 36 for inline) */
  size?: number;
  /** Text shown below the logo. Pass false to hide. */
  label?: string | false;
  className?: string;
}

export function SohamLoader({
  variant = 'overlay',
  size,
  label,
  className,
}: SohamLoaderProps) {
  const isOverlay = variant === 'overlay';
  const svgSize = size ?? (isOverlay ? 80 : 36);
  const showLabel = label !== false;
  const labelText = (label !== false && label !== undefined) ? label : (isOverlay ? 'Loading…' : undefined);

  const svg = (
    <svg
      width={svgSize}
      height={svgSize}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      className="soham-logo-spin"
      aria-hidden="true"
    >
      <style>{`
        .soham-logo-spin {
          animation: soham-spin 8s linear infinite, soham-pulse 3s ease-in-out infinite;
        }
        .soham-stroke {
          fill: none;
          stroke-width: 14;
          stroke-linecap: round;
          stroke-dasharray: 130;
          animation: soham-draw 2s ease-in-out infinite;
        }
        .soham-orange { stroke: #FF841B; animation-delay: 0s; }
        .soham-blue   { stroke: #90E0EF; animation-delay: -0.66s; }
        .soham-green  { stroke: #B5E32D; animation-delay: -1.33s; }

        @keyframes soham-draw {
          0%   { stroke-dashoffset:  130; }
          50%  { stroke-dashoffset:    0; }
          100% { stroke-dashoffset: -130; }
        }
        @keyframes soham-spin {
          100% { transform: rotate(360deg); }
        }
        @keyframes soham-pulse {
          0%,100% { transform: scale(1)    rotate(0deg);   }
          50%     { transform: scale(1.05) rotate(180deg); }
        }
        @keyframes soham-text-pulse {
          0%,100% { opacity: 0.45; }
          50%     { opacity: 1;    }
        }
        .soham-label-pulse {
          animation: soham-text-pulse 1.5s ease-in-out infinite;
        }
      `}</style>
      <g transform="translate(50,50) scale(0.9) translate(-50,-50)">
        {/* Orange — top-right curve */}
        <path className="soham-stroke soham-orange" d="M 30,25 C 60,15 85,40 85,75" />
        {/* Blue — bottom curve */}
        <path className="soham-stroke soham-blue"   d="M 20,65 C 40,95 85,90 95,60" />
        {/* Green — left curve */}
        <path className="soham-stroke soham-green"  d="M 25,85 C 10,50 30,20 60,30" />
      </g>
    </svg>
  );

  /* ── Inline variant ─────────────────────────────────────────────────── */
  if (!isOverlay) {
    return (
      <div className={cn('flex items-center gap-2.5', className)}>
        {svg}
        {showLabel && labelText && (
          <span className="soham-label-pulse text-sm font-medium text-muted-foreground tracking-wide">
            {labelText}
          </span>
        )}
      </div>
    );
  }

  /* ── Overlay variant ────────────────────────────────────────────────── */
  return (
    <div
      className={cn(
        'fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-5',
        'bg-background/95 backdrop-blur-sm',
        className,
      )}
      role="status"
      aria-label={labelText ?? 'Loading'}
     >
      {svg}
      <div className="text-center space-y-1">
        <p className="text-2xl font-extrabold tracking-[0.25em] uppercase text-foreground">
          SOHAM
        </p>
        {showLabel && (
          <p className="soham-label-pulse text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
            {labelText}
          </p>
        )}
      </div>
    </div>
  );
}
