'use client'

import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { useLang } from '@/lib/i18n'
import Isotipo from '../ui/Isotipo'
import WhatsAppButton from '../ui/WhatsAppButton'

// El canvas nunca entra en el paquete inicial ni en el HTML del servidor:
// el titular tiene que pintar aunque WebGL tarde o no exista.
const NodeField = dynamic(() => import('./NodeField'), { ssr: false })

type Capability = {
  enabled: boolean
  count: number
  withLines: boolean
}

/** Decide cuánta escena aguanta este dispositivo. */
function detectCapability(): Capability {
  if (typeof window === 'undefined') return { enabled: false, count: 0, withLines: false }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return { enabled: false, count: 0, withLines: false }
  }

  // Sin contexto WebGL no hay nada que intentar.
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ??
      canvas.getContext('webgl') ??
      canvas.getContext('experimental-webgl')
    if (!gl) return { enabled: false, count: 0, withLines: false }
  } catch {
    return { enabled: false, count: 0, withLines: false }
  }

  const weak =
    (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 768

  return weak
    ? { enabled: true, count: 70, withLines: false }
    : { enabled: true, count: 230, withLines: true }
}

export default function Hero() {
  const { t } = useLang()
  const sectionRef = useRef<HTMLElement>(null)
  const progress = useRef(0)

  const [capability, setCapability] = useState<Capability>({
    enabled: false,
    count: 0,
    withLines: false,
  })
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    setCapability(detectCapability())
  }, [])

  // Fuera de pantalla el canvas deja de dibujar: no tiene sentido gastar GPU
  // mientras se lee el resto de la página.
  useEffect(() => {
    const node = sectionRef.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: '120px' },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  // El scroll alimenta al shader por ref, sin provocar renders de React.
  useEffect(() => scrollYProgress.on('change', (v) => {
    progress.current = Math.min(1, v * 2.1)
  }), [scrollYProgress])

  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const textOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20"
    >
      {/* Capa del campo de nodos */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {capability.enabled ? (
          <div className={visible ? 'size-full' : 'size-full opacity-0'}>
            <NodeField
              progress={progress}
              count={capability.count}
              withLines={capability.withLines}
            />
          </div>
        ) : (
          // Respaldo estático: mismo lenguaje visual, cero JavaScript.
          <div className="size-full">
            <div className="reticula absolute inset-0 opacity-30" />
            <Isotipo
              className="absolute top-1/2 left-1/2 size-[32rem] -translate-1/2 text-acero/50"
              strokeWidth={5}
            />
          </div>
        )}
      </div>

      {/* Degradado que asienta el texto sobre el campo. Se apaga rápido hacia
          la derecha: si cubre todo el ancho, el campo deja de leerse. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,var(--color-grafito)_0%,color-mix(in_srgb,var(--color-grafito)_92%,transparent)_26%,color-mix(in_srgb,var(--color-grafito)_45%,transparent)_58%,transparent_82%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-grafito to-transparent"
      />

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="shell relative w-full"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="nodo-m1 flex items-center gap-3 text-humo"
        >
          <span className="inline-block h-px w-8 bg-acero" />
          {t.hero.eyebrow}
        </motion.p>

        <h1 className="nodo-d1 mt-8 max-w-4xl text-balance">
          {t.hero.title.map((line, i) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.1 + i * 0.09,
                ease: [0.16, 1, 0.3, 1],
              }}
              // En móvil los saltos fijos parten mal el titular; ahí el texto
              // fluye y el balance del navegador decide dónde cortar.
              className="max-md:inline md:block"
            >
              {line}
              {i < t.hero.title.length - 1 && <span className="md:hidden"> </span>}
              {/* El cuadro Señal cierra la frase igual que el punto del wordmark. */}
              {i === t.hero.title.length - 1 && (
                <span className="ml-2.5 inline-block size-[0.42em] translate-y-[-0.06em] bg-senal align-baseline" />
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="nodo-p1 mt-9 max-w-xl text-humo"
        >
          {t.hero.body}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.54, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <WhatsAppButton origin="hero" variant="primary" label={t.hero.ctaPrimary} />
          <a
            href="#proyectos"
            className="nodo-m1 group inline-flex items-center gap-2.5 border border-acero px-6 py-3.5 text-cal transition-colors duration-300 hover:border-humo hover:bg-concreto"
          >
            {t.hero.ctaSecondary}
            <span
              aria-hidden="true"
              className="transition-transform duration-300 ease-[var(--ease-nodo)] group-hover:translate-y-0.5"
            >
              ↓
            </span>
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        style={{ opacity: textOpacity }}
        className="absolute inset-x-0 bottom-8 hidden justify-center md:flex"
      >
        <span className="nodo-m1 flex flex-col items-center gap-3 text-humo">
          {t.hero.scroll}
          <span className="block h-10 w-px bg-gradient-to-b from-acero to-transparent" />
        </span>
      </motion.div>
    </section>
  )
}
