/**
 * Isotipo vértice: un nodo con tres conexiones radiales.
 * Reproducido en JSX (no <img>) para poder animarlo y teñirlo con currentColor.
 * Geometría idéntica a assets/svg/isotipo-vertice.svg.
 */
export default function Isotipo({
  className = '',
  dot = 'var(--color-senal)',
  strokeWidth = 10,
}: {
  className?: string
  /** Color del punto central. El resto hereda currentColor. */
  dot?: string
  strokeWidth?: number
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="nodo."
      fill="none"
    >
      <g transform="translate(0,9)">
        <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="butt">
          <line x1="50" y1="24" x2="50" y2="6" />
          <line x1="72.5" y1="63" x2="88.1" y2="72" />
          <line x1="27.5" y1="63" x2="11.9" y2="72" />
        </g>
        <circle cx="50" cy="50" r="16" fill={dot} />
      </g>
    </svg>
  )
}
