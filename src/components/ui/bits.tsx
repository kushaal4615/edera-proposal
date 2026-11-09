import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useCallback, useContext, useId, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Check, Copy, Plus } from 'lucide-react'
import { LineMask } from './motion'
import type { Img } from '../../data/proposal'
import { formatMoney, cn } from '../../lib/format'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/* ------------------------------------------------------------------ toast */

const ToastCtx = createContext<(t: string) => void>(() => {})
export const useToast = () => useContext(ToastCtx)

export function ToastHost({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: number; t: string }[]>([])
  const seq = useRef(1)
  const push = useCallback((t: string) => {
    const id = seq.current++
    setItems((x) => [...x.slice(-1), { id, t }])
    window.setTimeout(() => setItems((x) => x.filter((i) => i.id !== id)), 2400)
  }, [])
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-5 z-[80] flex flex-col items-center gap-2 px-4" aria-live="polite">
        <AnimatePresence>
          {items.map((i) => (
            <motion.p
              key={i.id}
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, transition: { duration: 0.16 } }}
              transition={{ type: 'spring', stiffness: 420, damping: 30 }}
              className="mono flex items-center gap-2 rounded-[var(--r-card)] bg-[var(--toast-bg)] px-4 py-2.5 text-[0.75rem] text-[var(--toast-ink)] shadow-[var(--card-shadow)]"
            >
              <Check size={14} aria-hidden /> {i.t}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  )
}

/** A figure you can copy. Always a sibling of row buttons, never inside one. */
export function CopyText({ text, label, className = '' }: { text: string; label: string; className?: string }) {
  const toast = useToast()
  const [done, setDone] = useState(false)
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      data-intent="copy_figure"
      data-value={`${label} ${text}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text)
        } catch {
          /* clipboard blocked; still confirm */
        }
        setDone(true)
        toast(`${label}: ${text} copied`)
        window.setTimeout(() => setDone(false), 1400)
      }}
      className={cn('group struck inline-flex min-h-6 items-center gap-1.5 rounded-[var(--r-card)] px-1.5 py-0.5 text-[var(--ink)] hover:bg-[var(--primary-soft)]', className)}
    >
      <span>{text}</span>
      {done ? <Check size={13} aria-hidden /> : <Copy size={13} className="opacity-70 transition-transform group-hover:-translate-y-px" aria-hidden />}
      <span className="sr-only">Copy {label}</span>
    </motion.button>
  )
}

/** A money figure you can copy. Money always wears the brass. */
export function CopyAmount({ amount, label, className = '' }: { amount: number; label: string; className?: string }) {
  return <CopyText text={formatMoney(amount)} label={label} className={cn('text-[var(--money)] hover:bg-[var(--money-soft)]', className)} />
}

/* ------------------------------------------------------------------ jargon tooltip */

export function Term({ term, children }: { term: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  return (
    <span className="relative inline-block">
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        data-intent="read_term"
        data-value={term}
        className="cursor-help border-b-2 border-dotted border-[var(--primary)] text-left"
      >
        {term}
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            role="tooltip"
            id={id}
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: 'bottom left' }}
            className="absolute bottom-[calc(100%+8px)] left-0 z-30 block w-[min(280px,70vw)] rounded-[var(--r-card)] bg-[var(--toast-bg)] p-3 text-[0.8125rem] font-normal normal-case leading-snug tracking-normal text-[var(--toast-ink)] shadow-[var(--card-shadow)]"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}

/* ------------------------------------------------------------------ the stamp and the seal */

export type StampTone = 'verified' | 'primary' | 'ink' | 'money' | 'close' | 'card'
const STAMP_COLOR: Record<StampTone, string> = { verified: 'var(--verified)', primary: 'var(--primary-ink)', ink: 'var(--ink)', money: 'var(--money)', close: 'var(--close-verified)', card: 'var(--close-card-verified)' }

/** Small boxed caps pressed on the card: IN SCOPE, LATER PHASE, FIXED. Ink by default; ruby (verified) for anything confirmed or included. */
export function Stamp({ children, tone = 'ink', rotate = -2, className = '', play = true, style }: { children: ReactNode; tone?: StampTone; rotate?: number; className?: string; play?: boolean; style?: CSSProperties }) {
  const reduced = useReducedMotion()
  const c = STAMP_COLOR[tone]
  return (
    <motion.span
      className={cn('struck pointer-events-none inline-block select-none whitespace-nowrap rounded-[var(--r-card)] px-2.5 py-1 text-[0.72rem] font-bold uppercase tracking-[0.12em]', className)}
      style={{ color: c, boxShadow: `inset 0 0 0 1.5px ${c}`, rotate, ...style }}
      initial={reduced || !play ? false : { scale: 1.5, opacity: 0, y: -6 }}
      whileInView={{ scale: 1, opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 600, damping: 26 }}
    >
      {children}
    </motion.span>
  )
}

/**
 * THE SEAL. A round ruby wax seal pressed on the card, as the reply card is sealed. Reserved for
 * what is confirmed or included: INCLUDED, CONFIRMED, ACCEPTED. Never a link, never decoration.
 */
/** The seal's word scales to its length so an eight-letter INCLUDED fits a 44px seal as well as a four-letter word. */
const sealFont = (children: ReactNode, size: number) => {
  const len = Math.max(3, String(typeof children === 'string' ? children : 'Seal').trim().length)
  return Math.max(6.5, Math.min(size * 0.16, (size * 0.62) / (len * 0.74)))
}

export function Seal({ children, size = 76, tone = 'verified', className = '', play = true, rotate = -8 }: { children: ReactNode; size?: number; tone?: 'verified' | 'close' | 'card'; className?: string; play?: boolean; rotate?: number }) {
  const reduced = useReducedMotion()
  const c = tone === 'close' ? 'var(--close-verified)' : tone === 'card' ? 'var(--close-card-verified)' : 'var(--seal)'
  const fg = tone === 'close' ? 'var(--close-bg)' : tone === 'card' ? 'var(--card-50)' : 'var(--on-seal)'
  return (
    <motion.span
      role="img"
      aria-label={typeof children === 'string' ? children : 'Seal'}
      className={cn('relative inline-grid shrink-0 select-none place-items-center', className)}
      style={{ width: size, height: size, rotate }}
      initial={reduced || !play ? false : { scale: 1.6, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 520, damping: 22 }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden className="absolute inset-0">
        <path d="M50 3c6 0 9 4 14 5s10-2 14 2 2 9 5 14 8 7 8 13-5 9-6 14 3 10 0 14-9 3-13 7-5 9-11 11-10-2-15-1-10 4-14 1-4-8-9-11-10-2-13-7 0-9-1-14-6-9-6-14 5-8 7-13 0-10 4-14 10-1 14-3 8-6 14-6Z" fill={c} />
        <circle cx="50" cy="50" r="33" fill="none" stroke={fg} strokeOpacity="0.7" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="29" fill="none" stroke={fg} strokeOpacity="0.35" strokeWidth="0.8" />
      </svg>
      {/* the wax's flat centre carries the word, so the lettering always sits on ruby */}
      <span className="struck relative grid place-items-center rounded-full text-center font-bold uppercase leading-[1.05] tracking-[0.06em]" style={{ color: fg, background: c, width: size * 0.7, height: size * 0.7, fontSize: sealFont(children, size), padding: '0 6%' }}>
        {children}
      </span>
    </motion.span>
  )
}

/** A time exactly as the programme prints it: "14:30". `label` prints a small word before it. */
export function Time({ time, tone = 'ink', size = 'md', className = '', play = true, label }: { time: string; tone?: StampTone; size?: 'sm' | 'md' | 'lg'; className?: string; play?: boolean; label?: string }) {
  const reduced = useReducedMotion()
  const c = STAMP_COLOR[tone]
  const fs = size === 'sm' ? '0.8rem' : size === 'lg' ? '1.5rem' : '1rem'
  return (
    <motion.span
      className={cn('struck inline-flex select-none items-center gap-1.5 whitespace-nowrap rounded-[var(--r-card)] px-2 py-0.5 font-bold', className)}
      style={{ color: c, boxShadow: `inset 0 0 0 1.5px ${c}`, fontSize: fs }}
      initial={reduced || !play ? false : { scale: 1.4, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 600, damping: 26 }}
    >
      {label && <span className="kicker text-[0.6em] font-semibold opacity-80">{label}</span>}
      {time}
    </motion.span>
  )
}

/* ------------------------------------------------------------------ the mark, the ornament and the availability strip */

/** Edera's mark as the page draws it: the leaf with the brass arc, redrawn from useedera.com. */
export function EderaMark({ size = 24, className = '', tone = 'ink' }: { size?: number; className?: string; tone?: 'ink' | 'light' | 'brass' }) {
  const leaf = tone === 'light' ? 'var(--card-50)' : tone === 'brass' ? 'var(--brass-500)' : 'var(--ink)'
  const arc = tone === 'brass' ? 'var(--card-50)' : 'var(--brass-500)'
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} aria-hidden>
      <path fillRule="evenodd" fill={leaf} d="M8 78C12 50 30 17 59 12c21-4 33 6 29 20-4 14-20 18-39 22C30 58 17 66 8 78Zm22-26c13-6 29-7 39-14 13-9 8-19-5-18-17 1-29 14-34 32Z" />
      <path fill={arc} d="M19 69c8 15 22 24 38 24 19 0 32-15 36-41-8 17-20 26-36 26-13 0-23-6-30-15Z" />
    </svg>
  )
}

/** The programme's small brass ornament between items: a leaf flourish drawn as one stroke. */
export function Ornament({ className = '', width = 56 }: { className?: string; width?: number }) {
  return (
    <svg width={width} height={width * 0.3} viewBox="0 0 100 30" aria-hidden className={cn('text-[var(--frame)]', className)}>
      <path d="M2 15 C 20 15, 30 4, 50 15 S 80 15, 98 15" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M50 15 c -6 -8 -6 -12 0 -13 c 6 1 6 5 0 13 Z" fill="currentColor" />
      <circle cx="2" cy="15" r="1.6" fill="currentColor" />
      <circle cx="98" cy="15" r="1.6" fill="currentColor" />
    </svg>
  )
}

export type AvailState = 'free' | 'held' | 'booked' | 'off'

/**
 * The product's signature, as the programme prints it: fourteen cells of a vendor's calendar, free in
 * evergreen, held in brass, booked in ink. `ring` marks the event's date.
 */
export function Avail({ states, ring, className = '', height = 8 }: { states: AvailState[]; ring?: number; className?: string; height?: number }) {
  const free = states.filter((s) => s === 'free').length
  return (
    <span className={cn('avail w-full', className)} role="img" aria-label={`Availability for the next ${states.length} days: ${free} free`} style={{ gridTemplateColumns: `repeat(${states.length}, minmax(0, 1fr))` }}>
      {states.map((s, i) => (
        <span key={i} className={s} style={{ height, boxShadow: ring === i ? '0 0 0 2px var(--card), 0 0 0 4px var(--frame)' : undefined }} />
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ section header: an item on the programme */

/**
 * Every section opens like an item on the Order of Programme: the item number, the time it is printed
 * at, the item's name on a leader of dots, a small seal when something is confirmed, then the heading.
 */
export function Item({ no, time, name, id, lines, aside, className = '', tone = 'page', seal = null }: { no: string; time: string; name: string; id: string; lines: ReactNode[]; aside?: string; className?: string; tone?: 'page' | 'close'; seal?: string | null }) {
  const ink = tone === 'close' ? 'text-[var(--close-ink)]' : 'text-[var(--ink)]'
  const soft = tone === 'close' ? 'text-[var(--close-ink-2)]' : 'text-[var(--ink-3)]'
  return (
    <div className={cn('min-w-0', className)}>
      <div className={cn('rule-foil', tone === 'close' && 'opacity-70')} aria-hidden />
      <div className={cn('kicker flex flex-wrap items-center gap-x-4 gap-y-2 pt-3', ink)}>
        <span className="font-bold">Item {no}</span>
        <Time time={time} size="sm" tone={tone === 'close' ? 'close' : 'ink'} play={false} />
        <span aria-hidden className="h-3 w-px bg-current opacity-50" />
        <span>{name}</span>
        {aside && <span className={cn('normal-case', soft)}>{aside}</span>}
        {seal && (
          <span className="ml-auto">
            <Seal size={54} tone={tone === 'close' ? 'close' : 'verified'} rotate={-6}>
              {seal}
            </Seal>
          </span>
        )}
      </div>
      <LineMask as="h2" id={id} lines={lines} className={cn('mt-6', ink)} style={{ fontSize: 'var(--fs-h2)' }} />
    </div>
  )
}

/* ------------------------------------------------------------------ treated photo */

/**
 * A photograph tipped into the programme: grayscale, an evergreen multiply and a card screen, plus
 * grain, so every picture reads as a print on the same card stock. Shape comes from the parent.
 */
export function Photo({ img, className = '', eager, sizes, style, plain }: { img: Img; className?: string; eager?: boolean; sizes?: string; style?: CSSProperties; plain?: boolean }) {
  return (
    <span className={cn('evidence block overflow-hidden bg-[var(--duo-dark)]', !/\babsolute\b/.test(className) && 'relative', className)} style={style}>
      <img
        src={img.src}
        alt={img.alt}
        width={img.w}
        height={img.h}
        sizes={sizes}
        loading={eager ? 'eager' : 'lazy'}
        {...(eager ? { fetchpriority: 'high' } : {})}
        decoding="async"
        className={cn(plain ? '' : 'duotone', 'h-full w-full object-cover')}
        style={plain ? { color: 'transparent' } : undefined}
      />
      {!plain && (
        <>
          <span aria-hidden className="pointer-events-none absolute inset-0 mix-blend-multiply" style={{ background: 'var(--duo-dark)', opacity: 0.5 }} />
          <span aria-hidden className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ background: 'var(--duo-light)', opacity: 0.22 }} />
        </>
      )}
      <span aria-hidden className="grain pointer-events-none absolute inset-0 opacity-25 mix-blend-overlay" />
    </span>
  )
}

/* ------------------------------------------------------------------ accordion */

/** One open at a time, keyboard operable. */
export function Accordion({ items, renderIndex }: { items: { q: string; a: string }[]; renderIndex?: (i: number, open: boolean) => ReactNode }) {
  const [open, setOpen] = useState<number>(0)
  const base = useId()
  const reduced = useReducedMotion()
  return (
    <div className="border-t-2 border-[var(--ink)]">
      {items.map((it, i) => {
        const on = open === i
        return (
          <div key={it.q} className="border-b border-[var(--rule-strong)]">
            <h3 className="m-0 font-[family-name:var(--font-body)] normal-case" style={{ letterSpacing: 0, fontVariationSettings: 'normal' }}>
              <button
                type="button"
                id={`${base}-h${i}`}
                aria-expanded={on}
                aria-controls={`${base}-p${i}`}
                onClick={() => setOpen(on ? -1 : i)}
                data-intent={on ? 'close_faq' : 'open_faq'}
                data-value={`Q${i + 1} ${it.q}`}
                className="group flex w-full items-center gap-4 py-5 text-left"
              >
                {renderIndex?.(i, on)}
                <span className="flex-1 text-[length:var(--fs-h3)] font-semibold leading-snug tracking-[-0.01em] transition-transform duration-200 group-hover:translate-x-1">{it.q}</span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[var(--r-pill)] border border-[var(--ink)]">
                  <motion.span animate={{ rotate: on ? 45 : 0 }} transition={{ type: 'spring', stiffness: 400, damping: 28 }} className="grid place-items-center">
                    <Plus size={18} aria-hidden />
                  </motion.span>
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div
                  id={`${base}-p${i}`}
                  role="region"
                  aria-labelledby={`${base}-h${i}`}
                  initial={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, height: 'auto' }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="measure pb-6 text-[var(--ink-2)]">{it.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ marquee */

/** Renders its content twice; the copy is aria-hidden and its links leave the tab order (they stay clickable). */
export function Marquee({ children, copy, speed = 40 }: { children: ReactNode; copy: ReactNode; speed?: number }) {
  const reduced = useReducedMotion()
  const [paused, setPaused] = useState(false)
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]" onPointerEnter={() => setPaused(true)} onPointerLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      <motion.div
        className="flex w-max"
        animate={reduced || paused ? undefined : { x: ['0%', '-50%'] }}
        transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
        style={reduced ? { flexWrap: 'wrap', width: '100%' } : undefined}
      >
        <div className="flex shrink-0">{children}</div>
        {!reduced && (
          <div className="flex shrink-0" aria-hidden>
            {copy}
          </div>
        )}
      </motion.div>
    </div>
  )
}
