'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import type { Shot } from '@/content/projects'

/**
 * Visor de capturas: una imagen a la vez con transición cruzada, controles de
 * punto y ampliación a pantalla completa. El marco imita una ventana de
 * aplicación para que se lea como producto y no como imagen suelta.
 */
export default function ProjectShots({
  shots,
  mobileShots = [],
  name,
  priority = false,
}: {
  shots: Shot[]
  mobileShots?: Shot[]
  name: string
  priority?: boolean
}) {
  const [index, setIndex] = useState(0)
  const [zoom, setZoom] = useState<Shot | null>(null)

  const current = shots[index]
  const phone = mobileShots[0]

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

  if (!current) return null

  return (
    <>
      <div className="relative">
        {/* Ventana de aplicación */}
        <div className="relative overflow-hidden border border-acero bg-concreto">
          <div className="flex items-center gap-1.5 border-b border-acero bg-grafito px-3 py-2.5">
            <span className="size-2 rounded-full bg-acero" />
            <span className="size-2 rounded-full bg-acero" />
            <span className="size-2 rounded-full bg-acero" />
            <span className="nodo-m1 ml-2 truncate text-humo">{name}</span>
          </div>

          <button
            type="button"
            onClick={() => setZoom(current)}
            className="group relative block aspect-16/10 w-full cursor-zoom-in overflow-hidden"
            aria-label={`Ampliar captura de ${name}`}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={current.src}
                initial={{ opacity: 0, scale: 1.015 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={current.src}
                  alt={`${name} — ${current.alt}`}
                  fill
                  priority={priority}
                  placeholder="blur"
                  blurDataURL={current.blurDataURL}
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </motion.span>
            </AnimatePresence>
          </button>
        </div>

        {/* Captura de teléfono superpuesta, cuando el proyecto tiene app móvil */}
        {phone && (
          <motion.button
            type="button"
            onClick={() => setZoom(phone)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute -right-3 -bottom-10 hidden w-28 cursor-zoom-in border border-acero bg-grafito p-1 shadow-2xl shadow-black/60 transition-transform duration-500 ease-[var(--ease-nodo)] hover:-translate-y-1 sm:block lg:w-32"
            aria-label={`Ampliar captura móvil de ${name}`}
          >
            <Image
              src={phone.src}
              alt={`${name} — ${phone.alt}`}
              width={phone.width}
              height={phone.height}
              placeholder="blur"
              blurDataURL={phone.blurDataURL}
              className="h-auto w-full"
              sizes="128px"
            />
          </motion.button>
        )}

        {/* Controles */}
        {shots.length > 1 && (
          <div className="mt-4 flex items-center gap-2">
            {shots.map((shot, i) => (
              <button
                key={shot.src}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Captura ${i + 1} de ${shots.length}`}
                aria-current={i === index}
                className={`h-1 transition-all duration-500 ease-[var(--ease-nodo)] ${
                  i === index ? 'w-8 bg-senal' : 'w-4 bg-acero hover:bg-humo'
                }`}
              />
            ))}
            <span className="nodo-m1 ml-2 text-humo tabular">
              {String(index + 1).padStart(2, '0')} / {String(shots.length).padStart(2, '0')}
            </span>
          </div>
        )}
      </div>

      {/* Ampliación */}
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
