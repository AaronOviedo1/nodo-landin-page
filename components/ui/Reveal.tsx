'use client'

import { motion, type Variants } from 'motion/react'
import type { ReactNode } from 'react'

const variants: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }),
}

/**
 * Entrada al hacer scroll. Motion respeta prefers-reduced-motion de forma
 * automática cuando las animaciones se declaran así, sin apagar la opacidad.
 */
export default function Reveal({
  children,
  delay = 0,
  className = '',
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'article' | 'header'
}) {
  const Component = motion[as]

  return (
    <Component
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px 0px' }}
      custom={delay}
      variants={variants}
    >
      {children}
    </Component>
  )
}
