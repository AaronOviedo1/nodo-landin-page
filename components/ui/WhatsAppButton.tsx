'use client'

import { useLang } from '@/lib/i18n'
import { whatsappUrl, type CtaOrigin } from '@/lib/whatsapp'

function WhatsAppIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.69.63.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35M12.05 21.8h-.01a9.8 9.8 0 0 1-4.99-1.37l-.36-.21-3.71.97.99-3.62-.23-.37a9.79 9.79 0 0 1-1.5-5.23c0-5.4 4.4-9.8 9.82-9.8 2.62 0 5.08 1.03 6.93 2.88a9.74 9.74 0 0 1 2.87 6.93c0 5.4-4.4 9.8-9.81 9.8m8.35-18.15A11.72 11.72 0 0 0 12.05 0C5.5 0 .17 5.33.17 11.88c0 2.09.55 4.14 1.59 5.94L.07 24l6.34-1.66a11.83 11.83 0 0 0 5.64 1.44h.01c6.54 0 11.87-5.33 11.87-11.88a11.8 11.8 0 0 0-3.48-8.4" />
    </svg>
  )
}

export default function WhatsAppButton({
  origin = 'hero',
  variant = 'primary',
  label,
  className = '',
}: {
  origin?: CtaOrigin
  variant?: 'primary' | 'ghost' | 'bare'
  label?: string
  className?: string
}) {
  const { lang, t } = useLang()
  const text = label ?? t.nav.cta

  const styles = {
    primary:
      'group relative inline-flex items-center gap-2.5 bg-senal px-6 py-3.5 text-grafito transition-transform duration-300 ease-[var(--ease-nodo)] hover:-translate-y-0.5',
    ghost:
      'group inline-flex items-center gap-2.5 border border-acero px-6 py-3.5 text-cal transition-colors duration-300 hover:border-humo hover:bg-concreto',
    bare: 'group inline-flex items-center gap-2 text-cal transition-colors hover:text-senal',
  }[variant]

  return (
    <a
      href={whatsappUrl(lang, origin)}
      target="_blank"
      rel="noopener noreferrer"
      className={`nodo-m1 ${styles} ${className}`}
    >
      <WhatsAppIcon className="size-4 shrink-0" />
      <span>{text}</span>
      {variant === 'primary' && (
        <span
          aria-hidden="true"
          className="ml-0.5 inline-block transition-transform duration-300 ease-[var(--ease-nodo)] group-hover:translate-x-1"
        >
          →
        </span>
      )}
    </a>
  )
}
