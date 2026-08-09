import Isotipo from './Isotipo'

/** Etiqueta de sección: isotipo diminuto + versalitas en Humo. */
export default function SectionLabel({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Isotipo className="size-3.5 shrink-0 text-humo" strokeWidth={12} />
      <span className="nodo-m1 text-humo">{children}</span>
    </div>
  )
}
