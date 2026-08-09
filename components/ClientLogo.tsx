import Image from 'next/image'
import type { LogoTreatment } from '@/content/projects'

/**
 * Un logo de cliente sobre fondo Grafito.
 *
 * Los archivos de public/logos ya vienen sin fondo y con los tonos oscuros
 * llevados a Cal por `scripts/normalize-logos.mjs`, así que aquí no queda
 * ningún filtro correctivo: solo el apagado del marquee.
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

  return (
    <span
      className={`inline-flex items-center justify-center ${
        monochrome
          ? 'opacity-60 grayscale transition-[filter,opacity] duration-500 ease-[var(--ease-nodo)] group-hover:opacity-100 group-hover:grayscale-0'
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
