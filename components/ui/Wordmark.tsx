/**
 * El wordmark es tipografía viva, no un dibujo: Archivo wdth 116 / wght 800 /
 * tracking -4.5%, con el punto final en Señal. Por eso nunca se usa el PNG.
 */
export default function Wordmark({
  className = '',
  size = 'text-2xl',
}: {
  className?: string
  size?: string
}) {
  return (
    <span className={`nodo-wordmark inline-flex items-baseline ${size} ${className}`}>
      nodo
      <span className="text-senal">.</span>
    </span>
  )
}
