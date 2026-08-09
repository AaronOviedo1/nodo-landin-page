import Image from 'next/image'
import type { LogoTreatment } from '@/content/projects'

/**
 * Un logo de cliente normalizado para fondo Grafito.
 * Los archivos llegan en estados incompatibles entre sí, así que el tratamiento
 * se declara por proyecto en content/projects.ts en vez de aplicar un filtro único.
 */
export default function ClientLogo({
  name,
  logo,
  treatment,
  width,
  className = '',
  monochrome = true,
}: {
  name: string
  logo?: string
  treatment: LogoTreatment
  width: number
  className?: string
  /** En el marquee los logos van apagados y reviven al hover; en las tarjetas no. */
  monochrome?: boolean
}) {
  // Sin archivo: marcador tipográfico en Archivo, para que la fila lea como
  // un sistema y no como un hueco.
  if (treatment === 'type' || !logo) {
    return (
      <span
        className={`nodo-wordmark text-cal ${className}`}
        style={{ fontSize: Math.round(width / 5.2) }}
      >
        {name}
      </span>
    )
  }

  const treatments: Record<Exclude<LogoTreatment, 'type'>, string> = {
    invert: 'logo-invert',
    screen: 'logo-screen',
    plate: 'logo-plate',
    raw: '',
  }

  return (
    <span
      className={`inline-flex items-center justify-center ${treatments[treatment]} ${
        monochrome
          ? 'opacity-55 grayscale transition-[filter,opacity] duration-500 ease-[var(--ease-nodo)] group-hover:opacity-100 group-hover:grayscale-0'
          : ''
      } ${className}`}
    >
      <Image
        src={logo}
        alt={name}
        width={width}
        height={Math.round(width * 0.5)}
        className="object-contain"
        style={{ width, height: 'auto' }}
        sizes={`${width}px`}
      />
    </span>
  )
}
