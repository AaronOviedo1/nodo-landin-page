'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { Shot, Surface } from '@/content/projects'
import { useLang } from '@/lib/i18n'

/** Cada cuánto avanza sola la captura. */
const INTERVAL = 2000

type SurfaceLabels = Record<string, string>

/**
 * Rota el índice cada INTERVAL, pausando cuando el usuario está encima o
 * cuando la tarjeta no está a la vista. Devuelve el índice y los controles.
 */
function useRotation(length: number, paused: boolean) {
  const [index, setIndex] = useState(0)
  const [manual, setManual] = useState(false)

  useEffect(() => {
    if (length <= 1 || paused) return
    // Quien pide menos movimiento no recibe un carrusel automático.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % length)
    }, INTERVAL)
    return () => window.clearInterval(id)
  }, [length, paused, manual])

  const select = useCallback((i: number) => {
    setIndex(i)
    // Reinicia el temporizador para que un clic no salte a los milisegundos.
    setManual((m) => !m)
  }, [])

  return { index, select }
}

/** Con más de esto, una fila de puntos se vuelve ruido visual. */
const MAX_DOTS = 8

function Dots({
  count,
  index,
  onSelect,
  className = '',
}: {
  count: number
  index: number
  onSelect: (i: number) => void
  className?: string
}) {
  if (count <= 1) return null

  // Muchas capturas: barra de avance y contador en vez de veinte guiones.
  if (count > MAX_DOTS) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        <span className="h-px flex-1 bg-acero" aria-hidden="true">
          <span
            className="block h-px bg-senal transition-[width] duration-500 ease-[var(--ease-nodo)]"
            style={{ width: `${((index + 1) / count) * 100}%` }}
          />
        </span>
        <span className="nodo-m1 shrink-0 text-humo tabular">
          {String(index + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}
        </span>
      </div>
    )
  }

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          aria-label={`Captura ${i + 1} de ${count}`}
          aria-current={i === index}
          className={`h-1 transition-all duration-500 ease-[var(--ease-nodo)] ${
            i === index ? 'w-6 bg-senal' : 'w-2.5 bg-acero hover:bg-humo'
          }`}
        />
      ))}
    </div>
  )
}

/** Ventana de aplicación de escritorio. */
function DesktopSurface({
  surface,
  label,
  name,
  paused,
  onZoom,
  priority,
  compact,
}: {
  surface: Surface
  label: string
  name: string
  paused: boolean
  onZoom: (shot: Shot) => void
  priority?: boolean
  compact?: boolean
}) {
  const { index, select } = useRotation(surface.shots.length, paused)
  const shot = surface.shots[index]
  if (!shot) return null

  return (
    <figure className="flex flex-col">
      <div className="overflow-hidden border border-acero bg-concreto">
        <div className="flex items-center gap-1.5 border-b border-acero bg-grafito px-3 py-2">
          <span className="size-1.5 rounded-full bg-acero" />
          <span className="size-1.5 rounded-full bg-acero" />
          <span className="size-1.5 rounded-full bg-acero" />
          <figcaption className="nodo-m1 ml-2 truncate text-humo">{label}</figcaption>
        </div>

        <button
          type="button"
          onClick={() => onZoom(shot)}
          className="relative block aspect-16/10 w-full cursor-zoom-in overflow-hidden"
          aria-label={`Ampliar ${label} de ${name}`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={shot.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={shot.src}
                alt={`${name} — ${shot.alt}`}
                fill
                priority={priority}
                placeholder="blur"
                blurDataURL={shot.blurDataURL}
                className="object-cover object-top"
                sizes={compact ? '(max-width: 1024px) 60vw, 32vw' : '(max-width: 1024px) 90vw, 44vw'}
              />
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <Dots
        count={surface.shots.length}
        index={index}
        onSelect={select}
        className="mt-3"
      />
    </figure>
  )
}

/** Teléfono. Si la captura ya trae su propio marco, no se le encima otro. */
function MobileSurface({
  surface,
  label,
  name,
  paused,
  onZoom,
}: {
  surface: Surface
  label: string
  name: string
  paused: boolean
  onZoom: (shot: Shot) => void
}) {
  const { index, select } = useRotation(surface.shots.length, paused)
  const shot = surface.shots[index]
  if (!shot) return null

  return (
    <figure className="flex flex-col items-center">
      <div
        className={
          surface.framed
            ? 'relative w-full'
            : // Marco de teléfono dibujado con CSS: bisel Acero sobre Grafito.
              'relative w-full overflow-hidden rounded-[1.6rem] border-[3px] border-acero bg-grafito p-1 shadow-2xl shadow-black/50'
        }
      >
        <button
          type="button"
          onClick={() => onZoom(shot)}
          className={`relative block w-full cursor-zoom-in overflow-hidden ${
            surface.framed ? '' : 'rounded-[1.25rem]'
          }`}
          style={{ aspectRatio: `${shot.width} / ${shot.height}` }}
          aria-label={`Ampliar ${label} de ${name}`}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={shot.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={shot.src}
                alt={`${name} — ${shot.alt}`}
                fill
                placeholder="blur"
                blurDataURL={shot.blurDataURL}
                className="object-cover object-top"
                sizes="(max-width: 1024px) 40vw, 15vw"
              />
            </motion.span>
          </AnimatePresence>
        </button>
      </div>

      <figcaption className="nodo-m1 mt-3 text-center text-humo">{label}</figcaption>
      <Dots
        count={surface.shots.length}
        index={index}
        onSelect={select}
        className="mt-2 justify-center"
      />
    </figure>
  )
}

/**
 * Muestra todas las interfaces de un proyecto a la vez —holidog inn son tres
 * aplicaciones distintas— y las va rotando solas cada dos segundos, para que se
 * vea el producto sin tener que descubrir un control.
 */
export default function ProjectShots({
  surfaces,
  name,
  priority = false,
  layout = 'side',
}: {
  surfaces: Surface[]
  name: string
  priority?: boolean
  /**
   * 'side' comparte la fila con el texto; 'wide' ocupa todo el ancho y pone las
   * ventanas de escritorio una junto a otra, para proyectos con varias apps.
   */
  layout?: 'side' | 'wide'
}) {
  const { t } = useLang()
  const labels = t.projects.surfaces as SurfaceLabels

  const [zoom, setZoom] = useState<Shot | null>(null)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(true)
  const ref = useRef<HTMLDivElement>(null)

  // Fuera de pantalla no tiene sentido rotar capturas que nadie ve.
  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '150px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!zoom) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setZoom(null)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [zoom])

  const desktop = surfaces.filter((s) => s.kind === 'desktop' && s.shots.length > 0)
  const mobile = surfaces.filter((s) => s.kind === 'mobile' && s.shots.length > 0)

  if (desktop.length === 0 && mobile.length === 0) return null

  const paused = hovered || !!zoom || !visible

  return (
    <>
      <div
        ref={ref}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-5"
      >
        {desktop.length > 0 && (
          <div
            className={`flex min-w-0 flex-1 gap-5 ${
              // En 'wide' las ventanas van hombro con hombro; apiladas harían la
              // tarjeta el doble de alta que la pantalla.
              layout === 'wide' ? 'flex-col lg:flex-row' : 'flex-col'
            }`}
          >
            {desktop.map((surface, i) => (
              <div key={surface.id} className="min-w-0 flex-1">
                <DesktopSurface
                  surface={surface}
                  label={labels[surface.id] ?? surface.id}
                  name={name}
                  paused={paused}
                  onZoom={setZoom}
                  priority={priority && i === 0}
                  compact={desktop.length > 1}
                />
              </div>
            ))}
          </div>
        )}

        {mobile.map((surface) => (
          <div
            key={surface.id}
            // El teléfono no compite con las ventanas: columna estrecha al lado.
            className="w-32 shrink-0 self-center sm:w-[22%] sm:max-w-40 sm:self-start"
          >
            <MobileSurface
              surface={surface}
              label={labels[surface.id] ?? surface.id}
              name={name}
              paused={paused}
              onZoom={setZoom}
            />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setZoom(null)}
            className="fixed inset-0 z-70 flex cursor-zoom-out items-center justify-center bg-grafito/95 p-4 backdrop-blur-sm md:p-12"
            role="dialog"
            aria-modal="true"
            aria-label={`${name} ampliado`}
          >
            <motion.div
              initial={{ scale: 0.97, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-full w-auto border border-acero"
            >
              <Image
                src={zoom.src}
                alt={`${name} — ${zoom.alt}`}
                width={zoom.width}
                height={zoom.height}
                placeholder="blur"
                blurDataURL={zoom.blurDataURL}
                className="max-h-[88vh] w-auto object-contain"
                sizes="90vw"
              />
            </motion.div>
            <button
              type="button"
              onClick={() => setZoom(null)}
              className="nodo-m1 absolute top-6 right-6 border border-acero bg-grafito px-3 py-2 text-cal"
            >
              Esc
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
