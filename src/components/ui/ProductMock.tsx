/* ProductMock: the real Edera product, drawn in code. The clickable prototype's Evergreen & Brass look
   (card cream ground, evergreen ink and accent, brass for anything held or paid, night evergreen for the
   dark surfaces) inside a CSS phone (client, planner and vendor apps) or a CSS laptop (the super admin).

   Every screen is laid out once at a fixed logical size (phone 360 x 780, laptop 1040 x 650) and the whole
   device is scaled with transform: scale() inside a fixed-aspect box, so text never reflows between sizes.
   The frame stays fluid: it never exceeds its parent and a ResizeObserver rescales it below the frame width.
   Colours: only --scr-* (the product, never theme-inverted) and --device-* (the hardware). */

import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion'
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  Cake,
  CalendarDays,
  Camera,
  ChartBar,
  Check,
  ChevronLeft,
  ChevronRight,
  Compass,
  Copy,
  Disc3,
  Drum,
  Flower2,
  Heart,
  House,
  Inbox,
  Landmark,
  LayoutDashboard,
  Lock,
  Martini,
  MapPin,
  MessageCircle,
  Mic,
  Palette,
  Plus,
  QrCode,
  ScanLine,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Signal,
  SlidersHorizontal,
  Star,
  Store,
  UserPlus,
  UserRound,
  Users,
  UtensilsCrossed,
  Wifi,
  type LucideIcon,
} from 'lucide-react'
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { WEB_SCREENS, type Screen } from '../../data/proposal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/format'
import { SETTLE } from './motion'

/* ------------------------------------------------------------------ constants */

/** logical device sizes: the screen is laid out once at these and scaled */
const PHONE = { w: 380, h: 800, sw: 360, sh: 780, bezel: 10 } as const
const LAPTOP = { w: 1180, h: 704, lidW: 1068, lidH: 678, sw: 1040, sh: 650, bezel: 14, baseH: 26 } as const
const FRAME_W = { phone: { lg: 300, md: 240, sm: 170 }, laptop: { lg: 720, md: 560, sm: 400 } } as const

const S = {
  bg: 'var(--scr-bg)',
  surface: 'var(--scr-surface)',
  raised: 'var(--scr-raised)',
  high: 'var(--scr-high)',
  rule: 'var(--scr-rule)',
  ink: 'var(--scr-ink)',
  ink2: 'var(--scr-ink-2)',
  ink3: 'var(--scr-ink-3)',
  night: 'var(--scr-night)',
  night2: 'var(--scr-night-2)',
  onNight: 'var(--scr-on-night)',
  onNight2: 'var(--scr-on-night-2)',
  accent: 'var(--scr-accent)',
  onAccent: 'var(--scr-on-accent)',
  accentText: 'var(--scr-accent-text)',
  accentSoft: 'var(--scr-accent-soft)',
  brass: 'var(--scr-brass)',
  onBrass: 'var(--scr-on-brass)',
  brassText: 'var(--scr-brass-text)',
  brassSoft: 'var(--scr-brass-soft)',
  free: 'var(--scr-free)',
  held: 'var(--scr-held)',
  booked: 'var(--scr-booked)',
  blocked: 'var(--scr-blocked)',
  danger: 'var(--scr-danger)',
  dangerSoft: 'var(--scr-danger-soft)',
} as const

const mix = (c: string, pct: number) => `color-mix(in srgb, ${c} ${pct}%, transparent)`

const DISPLAY: CSSProperties = { fontFamily: 'var(--font-display)', fontWeight: 500, letterSpacing: '-0.015em', lineHeight: 0.95, fontVariationSettings: "'opsz' 96" }
const NUM: CSSProperties = { ...DISPLAY, fontVariantNumeric: 'lining-nums tabular-nums', letterSpacing: '-0.03em' }
const MONO: CSSProperties = { fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em' }
/** amounts in running text: body face, tabular, semibold (mono would space the thousands comma) */
const MONEY: CSSProperties = { fontVariantNumeric: 'tabular-nums', fontWeight: 600 }
const KICKER: CSSProperties = { ...MONO, fontSize: 9.5, letterSpacing: '0.08em', textTransform: 'uppercase', color: S.ink3 }
const CARD_SHADOW = `0 1px 2px ${mix(S.ink, 6)}, 0 10px 24px -14px ${mix(S.ink, 22)}`

const ARIA: Record<Screen, string> = {
  clientHome: 'Edera client app, home: good evening Adaeze, Ngozi & Emeka 40 Years, 91 days to go, Saturday 20 February 2027 at The Orangery, planner Tunde Bakare of Bakare Events verified 4.9, three recent updates, roles venue and decor confirmed, caterer and photographer requested, DJ shortlisted, MC open, and the Home, Explore, My event, Guests and Inbox tabs.',
  explore: 'Edera marketplace, Explore in London: search for a Nigerian caterer, categories Venue 184, Caterer 326, DJ 211, Photographer 263, and vendor rows Ìyá Bola Catering, The Orangery, DJ Kaytee and Sugarcraft by Funmi, each with years in operation, rating, starting price and a fourteen-day availability strip ringed on 20 February.',
  vendorProfile: 'Edera vendor profile, Ìyá Bola Catering, verified, Peckham: 11 years since 2015, 486 bookings, replies in 2 hours; the availability strip ringed on Saturday 20 February, held; packages Classic buffet £24 per head and Premium buffet £32 per head, most booked; two reviews; Message and Request to book.',
  plannerBoard: 'Edera planner app, event board for Ngozi & Emeka 40 Years: budget £18,500, committed £11,270, remaining £7,230; venue and decor confirmed, caterer, photographer, cake and band requested, MC, gele and makeup and mobile bar open; the run of show from 14:00; tabs Today, Events, Scan, Calendar, Inbox.',
  guests: 'Edera planner app, guests: 112 yes, 23 no, 45 pending of 180, 135 of 180 QR invites sent, groups All, Family, Church, Colleagues, six guests with RSVP and table numbers, Add guest and Send invites.',
  checkin: 'Edera door scanner, live at Adaora & Kunle, doors 18:30: 41 of 90 checked in, 49 to come, 2 walk-ins, 1 duplicate; last scan Ruth Chukwu, table 3, admitted; Walk-in, Find and Scan next.',
  vendorRequest: 'Edera vendor inbox, new request from Tunde Bakare, verified planner: Ngozi & Emeka 40 Years on Saturday 20 February 2027, 13:00 to 23:00, 180 guests, the date held on the availability strip, Premium buffet £32 per head times 180 equals £5,760, a note from the planner, Decline, Accept and Propose new date.',
  vendorCalendar: 'Edera vendor calendar, catering: the next fourteen days, 8 free, 2 held, 3 booked, 1 blocked; November 2026 with today Saturday 21 ringed and days coloured free, held, booked or blocked; Block a day.',
  adminVerification: 'Edera super admin, verification queue of 23: SO Occasions, planner, Manchester, open in the inspector with four documents checked and four automated checks passed, a reviewer note, and Approve, Request info and Reject.',
  adminOverview: 'Edera super admin, overview: good evening Dave, 23 cases are waiting; 4,812 users, 1,374 events, 2,891 requests, 71% accept rate; users by role over twelve months, clients 2,960, planners 412, vendors 1,440; United Kingdom 2,744 users and Nigeria 2,068; the verification queue preview.',
}

/* ------------------------------------------------------------------ demo calendar data */

type Cell = 'free' | 'held' | 'booked' | 'blocked'
const CELL: Record<Cell, string> = { free: S.free, held: S.held, booked: S.booked, blocked: S.blocked }

/** fourteen days around the event, Sat 13 Feb to Fri 26 Feb 2027: index 7 is Sat 20 Feb */
const EVENT_IDX = 7
const BOLA: Cell[] = ['booked', 'free', 'free', 'free', 'free', 'held', 'free', 'held', 'free', 'free', 'free', 'free', 'free', 'booked']
const ORANGERY: Cell[] = ['booked', 'free', 'blocked', 'free', 'free', 'free', 'booked', 'booked', 'free', 'free', 'free', 'free', 'held', 'booked']
const KAYTEE: Cell[] = ['booked', 'free', 'free', 'free', 'free', 'free', 'held', 'free', 'free', 'free', 'free', 'free', 'booked', 'booked']
const FUNMI: Cell[] = ['free', 'free', 'free', 'free', 'held', 'free', 'booked', 'held', 'free', 'free', 'free', 'free', 'free', 'free']
const ASAKE: Cell[] = ['booked', 'free', 'free', 'free', 'free', 'free', 'free', 'held', 'free', 'free', 'free', 'free', 'free', 'booked']
/** the vendor's next fourteen days, Sat 21 Nov to Fri 4 Dec 2026: 8 free, 2 held, 3 booked, 1 blocked */
const NEXT14: Cell[] = ['booked', 'free', 'free', 'free', 'blocked', 'free', 'held', 'booked', 'free', 'free', 'free', 'free', 'held', 'booked']
/** November 2026 by day of month (Nov 1 is a Sunday) */
const NOV: Partial<Record<number, Cell>> = { 7: 'booked', 14: 'booked', 21: 'booked', 25: 'blocked', 27: 'held', 28: 'booked' }

/* ------------------------------------------------------------------ the component */

export function ProductMock({ screen, tilt = 'pointer', size = 'lg', className = '' }: { screen: Screen; tilt?: 'pointer' | 'none'; size?: 'lg' | 'md' | 'sm'; className?: string }) {
  const reduced = useReducedMotion()
  const web = WEB_SCREENS.includes(screen)
  const D = web ? { w: LAPTOP.w, h: LAPTOP.h } : { w: PHONE.w, h: PHONE.h }
  const W = web ? FRAME_W.laptop[size] : FRAME_W.phone[size]
  const live = tilt === 'pointer' && !reduced

  /* fluid frame: scale = measured width / logical width */
  const ref = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(W / D.w)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const apply = () => setScale(Math.max(0.05, el.getBoundingClientRect().width / D.w))
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(el)
    return () => ro.disconnect()
  }, [D.w])

  /* pointer tilt: springs on the pointer position, flattened by scroll as the device leaves the view */
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 170, damping: 22, mass: 0.7 })
  const sy = useSpring(py, { stiffness: 170, damping: 22, mass: 0.7 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const flat = useTransform(scrollYProgress, [0.5, 0.88], [1, 0], { clamp: true })
  const MAX = 8
  const rotateY = useTransform([sx, flat] as MotionValue<number>[], ([x, a]: number[]) => (-3 + x * MAX) * a)
  const rotateX = useTransform([sy, flat] as MotionValue<number>[], ([y, a]: number[]) => (2 - y * MAX) * a)
  const hx = useTransform(sx, [-1, 1], [20, 80])
  const hy = useTransform(sy, [-1, 1], [15, 75])
  const glare = useMotionTemplate`radial-gradient(55% 40% at ${hx}% ${hy}%, ${mix(S.surface, 34)}, transparent 70%)`

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!live || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set(Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1)))
    py.set(Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1)))
  }
  const onLeave = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <div
      ref={ref}
      data-mock
      data-size={size}
      data-screen={screen}
      role="img"
      aria-label={ARIA[screen]}
      className={cn('relative select-none', className)}
      /* a viewport-clamped width (never a bare percentage: a shrink-to-fit parent would collapse it) */
      style={{ width: `min(${W}px, 100vw - 2rem)`, maxWidth: '100%', perspective: live ? 1400 : undefined }}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <motion.div aria-hidden className="relative" style={live ? { rotateX, rotateY, transformPerspective: 1400, transformStyle: 'preserve-3d' } : undefined}>
        {/* the fixed-aspect box; the device inside is laid out at its logical size and scaled */}
        <div className="relative w-full" style={{ aspectRatio: `${D.w} / ${D.h}` }}>
          <div className="absolute left-0 top-0" style={{ width: D.w, height: D.h, transform: `scale(${scale})`, transformOrigin: '0 0', fontFamily: 'var(--font-body)', color: S.ink, lineHeight: 1.3 }}>
            {web ? <Laptop screen={screen} reduced={reduced} glare={live ? glare : null} /> : <Phone screen={screen} reduced={reduced} glare={live ? glare : null} />}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/** Screen contents cross-fade and slide when `screen` changes. */
function Swap({ screen, reduced, children }: { screen: Screen; reduced: boolean; children: ReactNode }) {
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={screen}
        className="absolute inset-0"
        initial={reduced ? { opacity: 1 } : { opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        exit={reduced ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: -24, transition: { duration: 0.2 } }}
        transition={{ duration: 0.5, ease: SETTLE }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

/* ------------------------------------------------------------------ hardware */

/** screens whose top is night evergreen: the status bar prints in cream */
const DARK_TOP: Screen[] = ['checkin', 'clientHome', 'vendorProfile']

function Phone({ screen, reduced, glare }: { screen: Screen; reduced: boolean; glare: MotionValue<string> | null }) {
  const dark = DARK_TOP.includes(screen)
  const r = 'var(--r-device)'
  return (
    <div
      className="relative"
      style={{
        width: PHONE.w,
        height: PHONE.h,
        borderRadius: r,
        background: 'var(--device-body)',
        padding: PHONE.bezel,
        boxShadow: `inset 0 0 0 1.5px var(--device-edge), inset 0 0 0 3px var(--device-body), 0 40px 70px -30px ${mix('var(--device-body)', 60)}, 0 12px 24px -10px ${mix('var(--device-body)', 45)}`,
      }}
    >
      {/* side keys */}
      <span className="absolute rounded-l-[2px]" style={{ left: -3, top: 150, width: 3, height: 32, background: 'var(--device-edge)' }} />
      <span className="absolute rounded-l-[2px]" style={{ left: -3, top: 200, width: 3, height: 58, background: 'var(--device-edge)' }} />
      <span className="absolute rounded-l-[2px]" style={{ left: -3, top: 268, width: 3, height: 58, background: 'var(--device-edge)' }} />
      <span className="absolute rounded-r-[2px]" style={{ right: -3, top: 220, width: 3, height: 84, background: 'var(--device-edge)' }} />
      <div className="relative overflow-hidden" style={{ width: PHONE.sw, height: PHONE.sh, borderRadius: `calc(${r} - ${PHONE.bezel}px)`, background: screen === 'checkin' ? S.night : S.bg, isolation: 'isolate' }}>
        <Swap screen={screen} reduced={reduced}>
          <PhoneScreen screen={screen} reduced={reduced} />
        </Swap>
        <StatusBar dark={dark} />
        <span className="absolute left-1/2 z-20 -translate-x-1/2 rounded-full" style={{ bottom: 8, width: 120, height: 4, background: screen === 'checkin' ? S.onNight : S.ink }} />
        {glare && <motion.div className="pointer-events-none absolute inset-0 z-30" style={{ background: glare, mixBlendMode: 'soft-light' }} />}
      </div>
    </div>
  )
}

function StatusBar({ dark }: { dark: boolean }) {
  const ink = dark ? S.onNight : S.ink
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between" style={{ height: 44, padding: '0 24px', color: ink }}>
      <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: '-0.01em', ...MONO }}>18:42</span>
      <span className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: 9, width: 98, height: 28, background: 'var(--device-body)' }} />
      <span className="flex items-center" style={{ gap: 5 }}>
        <Signal size={12} strokeWidth={2.4} />
        <Wifi size={12} strokeWidth={2.4} />
        <span className="relative flex items-center rounded-[3px]" style={{ width: 22, height: 11, padding: 1.5, boxShadow: `inset 0 0 0 1px ${mix(ink, 45)}` }}>
          <span className="h-full rounded-[1.5px]" style={{ width: '82%', background: ink }} />
        </span>
      </span>
    </div>
  )
}

function Laptop({ screen, reduced, glare }: { screen: Screen; reduced: boolean; glare: MotionValue<string> | null }) {
  return (
    <div className="relative" style={{ width: LAPTOP.w, height: LAPTOP.h }}>
      <div
        className="relative mx-auto"
        style={{
          width: LAPTOP.lidW,
          height: LAPTOP.lidH,
          borderRadius: '18px 18px 4px 4px',
          background: 'var(--device-body)',
          padding: LAPTOP.bezel,
          boxShadow: `inset 0 0 0 1.5px var(--device-edge), 0 36px 60px -30px ${mix('var(--device-body)', 55)}`,
        }}
      >
        <span className="absolute left-1/2 -translate-x-1/2 rounded-full" style={{ top: 5, width: 5, height: 5, background: 'var(--device-edge)' }} />
        <div className="relative overflow-hidden" style={{ width: LAPTOP.sw, height: LAPTOP.sh, borderRadius: 5, background: S.bg, isolation: 'isolate' }}>
          <Swap screen={screen} reduced={reduced}>
            <WebScreen screen={screen} />
          </Swap>
          {glare && <motion.div className="pointer-events-none absolute inset-0 z-30" style={{ background: glare, mixBlendMode: 'soft-light' }} />}
        </div>
      </div>
      <div
        className="relative"
        style={{
          width: LAPTOP.w,
          height: LAPTOP.baseH,
          marginTop: -2,
          borderRadius: '3px 3px 14px 14px',
          background: 'linear-gradient(to bottom, var(--device-base), var(--device-base-2))',
          boxShadow: `0 22px 30px -16px ${mix('var(--device-body)', 50)}`,
        }}
      >
        <span className="absolute left-1/2 top-0 -translate-x-1/2 rounded-b-[8px]" style={{ width: 150, height: 7, background: 'var(--device-base-2)' }} />
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ shared drawings */

/** The product's signature: fourteen cells for fourteen days, free / held / booked / blocked, a brass ring on the event date. */
function Strip({ states, ring, h = 10, gap = 3, dark = false }: { states: Cell[]; ring?: number; h?: number; gap?: number; dark?: boolean }) {
  return (
    <div className="grid" style={{ gridTemplateColumns: `repeat(${states.length}, minmax(0, 1fr))`, gap }}>
      {states.map((s, i) => (
        <span
          key={i}
          className="relative block rounded-[2px]"
          style={{
            height: h,
            background: dark ? (s === 'booked' ? S.onNight : s === 'blocked' ? mix(S.onNight, 18) : CELL[s]) : CELL[s],
            boxShadow: ring === i ? `0 0 0 2px ${dark ? S.night : S.surface}, 0 0 0 4px ${S.brass}` : undefined,
            zIndex: ring === i ? 1 : undefined,
          }}
        />
      ))}
    </div>
  )
}

function StripDates({ dark = false }: { dark?: boolean }) {
  return (
    <div className="flex items-center justify-between" style={{ ...MONO, fontSize: 8.5, color: dark ? S.onNight2 : S.ink3, marginTop: 5 }}>
      <span>Sat 13 Feb</span>
      <span style={{ color: S.brassText, fontWeight: 600 }}>Sat 20</span>
      <span>Fri 26 Feb</span>
    </div>
  )
}

function Monogram({ letters, tone = 'ever', size = 36, fs }: { letters: string; tone?: 'ever' | 'brass'; size?: number; fs?: number }) {
  return (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, background: tone === 'ever' ? S.night2 : S.brass, color: tone === 'ever' ? S.onNight : S.onBrass, ...DISPLAY, fontSize: fs ?? size * 0.4, letterSpacing: '0.02em' }}
    >
      {letters}
    </span>
  )
}

type PillTone = 'ever' | 'brass' | 'ink' | 'danger' | 'night' | 'free'
function Pill({ tone = 'ink', children, fs = 9.5, dashed = false }: { tone?: PillTone; children: ReactNode; fs?: number; dashed?: boolean }) {
  const bg = { ever: S.accentSoft, brass: S.brassSoft, ink: S.high, danger: S.dangerSoft, night: S.night2, free: S.free }[tone]
  const fg = { ever: S.accentText, brass: S.brassText, ink: S.ink2, danger: S.danger, night: S.onNight, free: S.onAccent }[tone]
  return (
    <span className="inline-flex shrink-0 items-center whitespace-nowrap rounded-full" style={{ gap: 4, padding: '2px 7px', fontSize: fs, fontWeight: 600, background: dashed ? 'transparent' : bg, color: fg, boxShadow: dashed ? `inset 0 0 0 1px ${S.rule}` : undefined, lineHeight: 1.4 }}>
      {children}
    </span>
  )
}

function Kicker({ children, right, dark = false, style }: { children: ReactNode; right?: ReactNode; dark?: boolean; style?: CSSProperties }) {
  return (
    <div className="flex items-baseline justify-between" style={{ ...KICKER, color: dark ? S.onNight2 : S.ink3, ...style }}>
      <span>{children}</span>
      {right && <span style={{ textTransform: 'none', letterSpacing: 0 }}>{right}</span>}
    </div>
  )
}

function Verified({ fs = 10, dark = false }: { fs?: number; dark?: boolean }) {
  return (
    <span className="inline-flex items-center" style={{ gap: 3, fontSize: fs, fontWeight: 600, color: dark ? S.onNight : S.accentText }}>
      <BadgeCheck size={fs + 2} style={{ color: dark ? S.brass : S.accent }} />
      Verified
    </span>
  )
}

function Rating({ value, count, fs = 10.5, dark = false }: { value: string; count: number; fs?: number; dark?: boolean }) {
  return (
    <span className="inline-flex items-center whitespace-nowrap" style={{ gap: 3, fontSize: fs, color: dark ? S.onNight : S.ink }}>
      <Star size={fs} fill={S.brass} style={{ color: S.brass }} />
      <span style={{ fontWeight: 600 }}>{value}</span>
      <span style={{ color: dark ? S.onNight2 : S.ink3 }}>({count})</span>
    </span>
  )
}

function Segmented({ a, b, active = 0, dark = false }: { a: string; b: string; active?: 0 | 1; dark?: boolean }) {
  return (
    <span className="inline-flex rounded-full" style={{ padding: 2, background: dark ? mix(S.onNight, 10) : S.high, fontSize: 10.5, fontWeight: 600 }}>
      {[a, b].map((t, i) => (
        <span key={t} className="rounded-full" style={{ padding: '3px 10px', background: active === i ? S.ink : 'transparent', color: active === i ? S.onNight : S.ink2 }}>
          {t}
        </span>
      ))}
    </span>
  )
}

function Btn({ kind = 'ghost', icon: Icon, children, dark = false, grow = true }: { kind?: 'primary' | 'ghost' | 'brass' | 'danger'; icon?: LucideIcon; children: ReactNode; dark?: boolean; grow?: boolean }) {
  const styles: Record<string, CSSProperties> = {
    primary: { background: S.accent, color: S.onAccent },
    brass: { background: S.brass, color: S.onBrass },
    ghost: { background: 'transparent', color: dark ? S.onNight : S.ink, boxShadow: `inset 0 0 0 1px ${dark ? mix(S.onNight, 28) : mix(S.ink, 22)}` },
    danger: { background: 'transparent', color: S.danger, boxShadow: `inset 0 0 0 1px ${mix(S.danger, 35)}` },
  }
  return (
    <span className={cn('inline-flex items-center justify-center whitespace-nowrap rounded-[12px]', grow && 'flex-1')} style={{ height: 42, padding: '0 14px', gap: 6, fontSize: 12.5, fontWeight: 600, ...styles[kind] }}>
      {Icon && <Icon size={14} strokeWidth={2.2} />}
      {children}
    </span>
  )
}

function Dock({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <div className="flex items-center" style={{ gap: 10, padding: '12px 16px 26px', background: dark ? S.night : S.surface, borderTop: `1px solid ${dark ? mix(S.onNight, 10) : S.rule}` }}>
      {children}
    </div>
  )
}

function TabBar({ tabs, active }: { tabs: { label: string; icon: LucideIcon }[]; active: number }) {
  return (
    <div className="relative flex items-start" style={{ padding: '8px 10px 22px', background: S.surface, borderTop: `1px solid ${S.rule}` }}>
      {tabs.map((t, i) => {
        const mid = i === Math.floor(tabs.length / 2)
        const on = i === active
        return (
          <span key={t.label} className="flex flex-1 flex-col items-center" style={{ gap: 3, color: on ? S.accentText : S.ink3, fontSize: 9.5, fontWeight: on ? 600 : 500 }}>
            {mid ? (
              <span className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, marginTop: -26, background: S.accent, color: S.onAccent, boxShadow: `0 0 0 4px ${S.surface}, 0 8px 18px -8px ${S.accent}` }}>
                <t.icon size={20} strokeWidth={2.2} />
              </span>
            ) : (
              <t.icon size={19} strokeWidth={on ? 2.4 : 1.9} />
            )}
            <span>{t.label}</span>
          </span>
        )
      })}
    </div>
  )
}

const CLIENT_TABS = [
  { label: 'Home', icon: House },
  { label: 'Explore', icon: Compass },
  { label: 'My event', icon: CalendarDays },
  { label: 'Guests', icon: Users },
  { label: 'Inbox', icon: Inbox },
]
const PLANNER_TABS = [
  { label: 'Today', icon: House },
  { label: 'Events', icon: CalendarDays },
  { label: 'Scan', icon: ScanLine },
  { label: 'Calendar', icon: CalendarDays },
  { label: 'Inbox', icon: Inbox },
]

/** the phone screen shell: a column with a scroll body and a fixed bottom bar */
function Shell({ children, bottom, dark = false }: { children: ReactNode; bottom?: ReactNode; dark?: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col" style={{ background: dark ? S.night : S.bg, color: dark ? S.onNight : S.ink, fontSize: 13 }}>
      <div className="relative min-h-0 flex-1 overflow-hidden">{children}</div>
      {bottom}
    </div>
  )
}

function Surface({ children, style, pad = 14 }: { children: ReactNode; style?: CSSProperties; pad?: number }) {
  return (
    <div className="relative" style={{ background: S.surface, borderRadius: 14, boxShadow: CARD_SHADOW, padding: pad, ...style }}>
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ phone screens */

function PhoneScreen({ screen, reduced }: { screen: Screen; reduced: boolean }) {
  switch (screen) {
    case 'clientHome':
      return <ClientHome />
    case 'explore':
      return <Explore />
    case 'vendorProfile':
      return <VendorProfile />
    case 'plannerBoard':
      return <PlannerBoard />
    case 'guests':
      return <Guests />
    case 'checkin':
      return <Checkin reduced={reduced} />
    case 'vendorRequest':
      return <VendorRequest />
    case 'vendorCalendar':
      return <VendorCalendar />
    default:
      return null
  }
}

/* ---- clientHome */

const ROLE_CARDS: { name: string; who: string; state: 'confirmed' | 'requested' | 'shortlisted' | 'open'; icon: LucideIcon }[] = [
  { name: 'Venue', who: 'The Orangery', state: 'confirmed', icon: Landmark },
  { name: 'Decor', who: 'Luxe Drape Decor', state: 'confirmed', icon: Flower2 },
  { name: 'Caterer', who: 'Ìyá Bola Catering', state: 'requested', icon: UtensilsCrossed },
  { name: 'Photographer', who: 'Seyi Lawal', state: 'requested', icon: Camera },
  { name: 'DJ', who: 'DJ Kaytee', state: 'shortlisted', icon: Disc3 },
  { name: 'MC', who: 'Find an MC', state: 'open', icon: Mic },
]

function StatePill({ state }: { state: 'confirmed' | 'requested' | 'shortlisted' | 'open' }) {
  if (state === 'confirmed') return <Pill tone="ever" fs={8.5}>Confirmed</Pill>
  if (state === 'requested') return <Pill tone="brass" fs={8.5}>Requested</Pill>
  if (state === 'shortlisted') return <Pill tone="ink" fs={8.5}>Shortlisted</Pill>
  return (
    <Pill tone="ink" fs={8.5} dashed>
      Open
    </Pill>
  )
}

function ClientHome() {
  return (
    <Shell bottom={<TabBar tabs={CLIENT_TABS} active={0} />}>
      {/* dark evergreen hero */}
      <div style={{ background: `linear-gradient(170deg, ${S.night2} 0%, ${S.night} 70%)`, color: S.onNight, padding: '58px 20px 44px' }}>
        <div className="flex items-center justify-between">
          <span style={{ fontSize: 13, color: S.onNight2 }}>Good evening, Adaeze</span>
          <Monogram letters="AN" tone="brass" size={30} />
        </div>
        <div style={{ ...KICKER, color: S.brass, marginTop: 16 }}>Your event</div>
        <div style={{ ...DISPLAY, fontSize: 26, marginTop: 6, lineHeight: 1.02 }}>
          Ngozi & Emeka <span style={{ color: S.onNight2 }}>·</span> 40 Years
        </div>
        <div className="flex items-end" style={{ gap: 10, marginTop: 14 }}>
          <span style={{ ...NUM, fontSize: 92, lineHeight: 0.82, letterSpacing: '-0.04em' }}>91</span>
          <span className="flex flex-col" style={{ paddingBottom: 4, fontSize: 14, lineHeight: 1.15, color: S.onNight2 }}>
            <span style={{ color: S.onNight, fontWeight: 600 }}>days</span>
            <span>to go</span>
          </span>
        </div>
        <div className="flex flex-wrap items-center" style={{ gap: '4px 12px', marginTop: 14, fontSize: 11, color: S.onNight2 }}>
          <span className="inline-flex items-center" style={{ gap: 4 }}>
            <CalendarDays size={11} /> Sat 20 Feb 2027 · 14:00
          </span>
          <span className="inline-flex items-center" style={{ gap: 4 }}>
            <MapPin size={11} /> The Orangery, Royal Docks
          </span>
          <span className="inline-flex items-center" style={{ gap: 4 }}>
            <Users size={11} /> 180 guests
          </span>
        </div>
      </div>

      {/* planner card lapping the hero */}
      <div style={{ margin: '-30px 16px 0' }}>
        <Surface pad={12}>
          <div className="flex items-center" style={{ gap: 10 }}>
            <Monogram letters="TB" size={40} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center" style={{ gap: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600 }}>Tunde Bakare</span>
                <Verified fs={9.5} />
              </div>
              <div style={{ fontSize: 10.5, color: S.ink2, marginTop: 1 }}>Bakare Events · your planner</div>
              <div style={{ marginTop: 3 }}>
                <Rating value="4.9" count={187} fs={10} />
                <span style={{ fontSize: 10, color: S.ink3 }}> · 9 yrs</span>
              </div>
            </div>
            <span className="inline-flex items-center rounded-full" style={{ gap: 4, padding: '7px 11px', background: S.accentSoft, color: S.accentText, fontSize: 11, fontWeight: 600 }}>
              <MessageCircle size={12} /> Message
            </span>
          </div>
        </Surface>
      </div>

      {/* timeline */}
      <div style={{ padding: '18px 20px 0' }}>
        <Kicker right={<span style={{ fontSize: 9.5 }}>Today</span>}>What's happened</Kicker>
        <div style={{ marginTop: 8 }}>
          {[
            { t: '17:10', who: 'Luxe Drape Decor', what: 'confirmed', amt: '£2,400', tone: S.accent },
            { t: '16:55', who: 'Ìyá Bola Catering', what: 'requested by Tunde', amt: '£5,760', tone: S.brass },
            { t: '09:20', who: 'Seyi Lawal Photography', what: 'requested', amt: '£1,450', tone: S.brass },
          ].map((row, i) => (
            <div key={row.t} className="flex items-center" style={{ gap: 10, padding: '6px 0', borderTop: i ? `1px solid ${S.rule}` : undefined }}>
              <span style={{ ...MONO, fontSize: 10, color: S.ink3, width: 32 }}>{row.t}</span>
              <span className="shrink-0 rounded-full" style={{ width: 7, height: 7, background: row.tone }} />
              <span className="min-w-0 flex-1 truncate" style={{ fontSize: 11.5 }}>
                <span style={{ fontWeight: 600 }}>{row.who}</span> <span style={{ color: S.ink2 }}>{row.what}</span>
              </span>
              <span style={{ ...MONEY, fontSize: 11 }}>{row.amt}</span>
            </div>
          ))}
        </div>
      </div>

      {/* guests summary */}
      <div style={{ padding: '14px 20px 0' }}>
        <Surface pad={11}>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-baseline" style={{ gap: 5 }}>
              <span style={{ ...NUM, fontSize: 22, color: S.accentText }}>112</span>
              <span style={{ fontSize: 11.5, fontWeight: 600 }}>yes</span>
              <span style={{ fontSize: 10.5, color: S.ink2, marginLeft: 4 }}>23 no · 45 pending</span>
            </span>
            <span className="inline-flex items-center" style={{ gap: 4, fontSize: 10, color: S.ink2 }}>
              <QrCode size={11} style={{ color: S.brassText }} /> 135 of 180 invites sent
            </span>
          </div>
          <div className="flex overflow-hidden rounded-full" style={{ height: 5, marginTop: 8, gap: 2 }}>
            <span style={{ width: '62.2%', background: S.accent }} />
            <span style={{ width: '12.8%', background: S.ink3 }} />
            <span style={{ width: '25%', background: S.brass }} />
          </div>
        </Surface>
      </div>

      {/* roles strip */}
      <div style={{ padding: '14px 0 0 20px' }}>
        <Kicker right={<span style={{ fontSize: 9.5, paddingRight: 20 }}>2 confirmed · 2 requested · 1 open</span>}>Roles</Kicker>
        <div className="flex" style={{ gap: 8, marginTop: 8, width: 'max-content' }}>
          {ROLE_CARDS.map((r) => (
            <div key={r.name} className="flex flex-col justify-between" style={{ width: 108, height: 78, padding: 9, borderRadius: 12, background: r.state === 'open' ? 'transparent' : S.surface, boxShadow: r.state === 'open' ? `inset 0 0 0 1px ${S.rule}` : CARD_SHADOW, outline: r.state === 'open' ? `1px dashed ${mix(S.ink, 28)}` : undefined, outlineOffset: -1 }}>
              <div className="flex items-center justify-between">
                <r.icon size={15} strokeWidth={1.9} style={{ color: r.state === 'confirmed' ? S.accent : r.state === 'requested' ? S.brassText : S.ink3 }} />
                <StatePill state={r.state} />
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600 }}>{r.name}</div>
                <div className="truncate" style={{ fontSize: 9.5, color: S.ink3 }}>{r.who}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

/* ---- explore */

const VENDOR_ROWS = [
  { letters: 'IB', tone: 'ever' as const, name: 'Ìyá Bola Catering', type: 'Caterer', place: 'Peckham', yrs: 11, rating: '4.9', n: 212, from: '£24', per: 'per head', strip: BOLA },
  { letters: 'TO', tone: 'brass' as const, name: 'The Orangery', type: 'Venue', place: 'Royal Docks', yrs: 14, rating: '4.8', n: 171, from: '£3,200', per: 'hire', strip: ORANGERY },
  { letters: 'DK', tone: 'ever' as const, name: 'DJ Kaytee', type: 'DJ', place: 'Croydon', yrs: 7, rating: '4.8', n: 156, from: '£450', per: 'set', strip: KAYTEE },
  { letters: 'SF', tone: 'brass' as const, name: 'Sugarcraft by Funmi', type: 'Cake', place: 'Lewisham', yrs: 6, rating: '5.0', n: 98, from: '£180', per: 'cake', strip: FUNMI },
  { letters: 'AL', tone: 'ever' as const, name: 'Asake Live Band', type: 'Band', place: 'Brixton', yrs: 9, rating: '4.9', n: 134, from: '£900', per: 'set', strip: ASAKE },
]

function Explore() {
  return (
    <Shell bottom={<TabBar tabs={CLIENT_TABS} active={1} />}>
      <div style={{ padding: '52px 20px 0' }}>
        <div className="flex items-center justify-between">
          <span style={{ ...DISPLAY, fontSize: 28 }}>Explore</span>
          <Segmented a="London" b="Lagos" active={0} />
        </div>
        <div className="flex items-center" style={{ gap: 8, marginTop: 12, height: 40, padding: '0 12px', borderRadius: 12, background: S.surface, boxShadow: CARD_SHADOW }}>
          <Search size={14} style={{ color: S.ink3 }} />
          <span className="flex-1" style={{ fontSize: 13 }}>Nigerian caterer</span>
          <SlidersHorizontal size={14} style={{ color: S.ink3 }} />
        </div>
        <div className="flex items-center" style={{ gap: 6, marginTop: 8 }}>
          <Pill tone="ever" fs={9.5}>
            <CalendarDays size={10} /> Sat 20 Feb 2027
          </Pill>
          <Pill tone="ink" fs={9.5}>
            <Users size={10} /> 180 guests
          </Pill>
          <Pill tone="ink" fs={9.5}>
            <MapPin size={10} /> 10 mi
          </Pill>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6, marginTop: 12 }}>
          {[
            { n: 'Venue', c: 184, icon: Landmark },
            { n: 'Caterer', c: 326, icon: UtensilsCrossed, on: true },
            { n: 'DJ', c: 211, icon: Disc3 },
            { n: 'Photographer', c: 263, icon: Camera },
          ].map((t) => (
            <div key={t.n} className="flex flex-col justify-between" style={{ height: 62, padding: '8px 7px', borderRadius: 12, background: t.on ? S.ink : S.surface, color: t.on ? S.onNight : S.ink, boxShadow: t.on ? undefined : CARD_SHADOW }}>
              <t.icon size={15} strokeWidth={1.9} style={{ color: t.on ? S.brass : S.accent }} />
              <div>
                <div className="truncate" style={{ fontSize: 9, fontWeight: 600, letterSpacing: '-0.02em' }}>{t.n}</div>
                <div style={{ ...MONO, fontSize: 9.5, color: t.on ? S.onNight2 : S.ink3 }}>{t.c}</div>
              </div>
            </div>
          ))}
        </div>
        <Kicker style={{ marginTop: 14 }} right={<span style={{ fontSize: 9.5 }}>14 days around Sat 20 Feb</span>}>
          Near Royal Docks
        </Kicker>
        <div style={{ marginTop: 6 }}>
          {VENDOR_ROWS.map((v, i) => (
            <div key={v.name} style={{ padding: '9px 0', borderTop: i ? `1px solid ${S.rule}` : undefined }}>
              <div className="flex items-center" style={{ gap: 10 }}>
                <Monogram letters={v.letters} tone={v.tone} size={36} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center" style={{ gap: 4 }}>
                    <span className="truncate" style={{ fontSize: 12.5, fontWeight: 600 }}>{v.name}</span>
                    <BadgeCheck size={11} style={{ color: S.accent, flexShrink: 0 }} />
                  </div>
                  <div className="truncate" style={{ fontSize: 10, color: S.ink2, marginTop: 1 }}>
                    {v.type} · {v.place} · {v.yrs} yrs
                  </div>
                </div>
                <div className="flex flex-col items-end" style={{ gap: 2 }}>
                  <Rating value={v.rating} count={v.n} fs={10} />
                  <span style={{ fontSize: 10, color: S.ink2 }}>
                    from <span style={{ ...MONEY, color: S.ink, fontSize: 11.5 }}>{v.from}</span> {v.per}
                  </span>
                </div>
              </div>
              <div style={{ marginTop: 8, paddingLeft: 46 }}>
                <Strip states={v.strip} ring={EVENT_IDX} h={7} gap={3} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

/* ---- vendorProfile */

function VendorProfile() {
  return (
    <Shell
      bottom={
        <Dock>
          <Btn kind="ghost" icon={MessageCircle}>
            Message
          </Btn>
          <Btn kind="primary" icon={CalendarDays}>
            Request to book
          </Btn>
        </Dock>
      }
    >
      <div className="relative" style={{ height: 196, padding: '50px 18px 16px', background: `radial-gradient(120% 90% at 100% 0%, ${mix(S.brass, 22)}, transparent 55%), linear-gradient(165deg, ${S.night2} 0%, ${S.night} 60%, ${S.accent} 160%)`, color: S.onNight }}>
        <div className="flex items-center justify-between" style={{ color: S.onNight2 }}>
          <ChevronLeft size={18} />
          <span className="flex items-center" style={{ gap: 14 }}>
            <Share2 size={15} />
            <Heart size={15} />
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between" style={{ padding: '0 18px 16px' }}>
          <div className="flex items-end" style={{ gap: 12 }}>
            <Monogram letters="IB" tone="brass" size={48} fs={19} />
            <div>
              <div style={{ ...DISPLAY, fontSize: 24 }}>Ìyá Bola Catering</div>
              <div className="flex items-center" style={{ gap: 8, marginTop: 5, fontSize: 10.5, color: S.onNight2 }}>
                <Verified fs={10} dark />
                <span>Caterer · Peckham, London</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 18px' }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', marginTop: 12, background: S.surface, borderRadius: 12, boxShadow: CARD_SHADOW, padding: '10px 0' }}>
          {[
            { big: '11 yrs', small: 'since 2015' },
            { big: '486', small: 'bookings' },
            { big: '2h', small: 'replies in' },
          ].map((s, i) => (
            <div key={s.small} className="flex flex-col items-center" style={{ borderLeft: i ? `1px solid ${S.rule}` : undefined }}>
              <span style={{ ...NUM, fontSize: 20 }}>{s.big}</span>
              <span style={{ fontSize: 9.5, color: S.ink3, marginTop: 2 }}>{s.small}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between" style={{ marginTop: 10, padding: '0 2px' }}>
          <Rating value="4.9" count={212} fs={11} />
          <span style={{ fontSize: 10, color: S.ink2 }}>Jollof · small chops · live grill · Igbo & Yoruba menus</span>
        </div>

        <Surface style={{ marginTop: 12 }} pad={12}>
          <Kicker
            right={
              <span className="inline-flex items-center" style={{ gap: 5, fontSize: 10.5, fontWeight: 600, color: S.brassText }}>
                <span className="rounded-full" style={{ width: 7, height: 7, background: S.held }} />
                Sat 20 Feb · Held
              </span>
            }
          >
            Availability
          </Kicker>
          <div style={{ marginTop: 10 }}>
            <Strip states={BOLA} ring={EVENT_IDX} h={14} gap={4} />
            <StripDates />
          </div>
        </Surface>

        <Kicker style={{ marginTop: 14 }} right={<span style={{ fontSize: 9.5 }}>min. 50 guests</span>}>
          Packages
        </Kicker>
        <div style={{ marginTop: 6 }}>
          {[
            { n: 'Classic buffet', d: 'Jollof, fried rice, assorted meats, moi moi, salad', p: '£24', hot: false },
            { n: 'Premium buffet', d: 'Classic + small chops, pepper soup, pounded yam & egusi, live grill', p: '£32', hot: true },
          ].map((p, i) => (
            <div key={p.n} className="flex items-center" style={{ gap: 10, padding: '8px 0', borderTop: i ? `1px solid ${S.rule}` : undefined }}>
              <div className="min-w-0 flex-1">
                <div className="flex items-center" style={{ gap: 6 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600 }}>{p.n}</span>
                  {p.hot && (
                    <Pill tone="brass" fs={8.5}>
                      Most booked
                    </Pill>
                  )}
                </div>
                <div className="truncate" style={{ fontSize: 10, color: S.ink2, marginTop: 1 }}>{p.d}</div>
              </div>
              <span className="shrink-0" style={{ fontSize: 10, color: S.ink2 }}>
                <span style={{ ...NUM, fontSize: 17, color: S.ink }}>{p.p}</span> per head
              </span>
            </div>
          ))}
        </div>

        <Kicker style={{ marginTop: 12 }} right={<span style={{ fontSize: 9.5 }}>212 · see all</span>}>
          Reviews
        </Kicker>
        <div style={{ marginTop: 6 }}>
          {[
            { l: 'RA', tone: 'brass' as const, who: 'Ronke A.', when: 'Oct 2026', text: 'Every guest asked who catered. The jollof was perfect and nothing ran out.' },
            { l: 'KA', tone: 'ever' as const, who: 'Kunle A.', when: 'Sep 2026', text: 'Set up early, served 300 without a queue, cleared down before the band finished.' },
            { l: 'TB', tone: 'ever' as const, who: 'Tunde B. · planner', when: 'Aug 2026', text: 'Twelve events together now. Generous portions, always on time, never a complaint.' },
          ].map((r, i) => (
            <div key={r.who} className="flex" style={{ gap: 9, padding: '7px 0', borderTop: i ? `1px solid ${S.rule}` : undefined }}>
              <Monogram letters={r.l} tone={r.tone} size={26} fs={10} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span style={{ fontSize: 11, fontWeight: 600 }}>{r.who}</span>
                  <span className="flex items-center" style={{ gap: 4, fontSize: 9.5, color: S.ink3 }}>
                    <span className="flex" style={{ gap: 1 }}>
                      {Array.from({ length: 5 }, (_, k) => (
                        <Star key={k} size={8} fill={S.brass} style={{ color: S.brass }} />
                      ))}
                    </span>
                    {r.when}
                  </span>
                </div>
                <div style={{ fontSize: 10.5, color: S.ink2, marginTop: 1, lineHeight: 1.3 }}>{r.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

/* ---- plannerBoard */

type Tile = { role: string; who: string; note?: string; state: 'confirmed' | 'requested' | 'open'; icon: LucideIcon; span?: number; strip?: boolean }
const TILES: Tile[] = [
  { role: 'Venue', who: 'The Orangery', note: 'deposit paid', state: 'confirmed', icon: Landmark },
  { role: 'Decor', who: 'Luxe Drape Decor', note: '£2,400', state: 'confirmed', icon: Flower2 },
  { role: 'Cake', who: 'Sugarcraft by Funmi', note: 'waiting 5h', state: 'requested', icon: Cake },
  { role: 'Caterer', who: 'Ìyá Bola Catering', note: 'waiting 47m · £5,760', state: 'requested', icon: UtensilsCrossed, span: 2, strip: true },
  { role: 'Photographer', who: 'Seyi Lawal', note: 'waiting 2d', state: 'requested', icon: Camera },
  { role: 'Band', who: 'Asake Live Band', note: 'waiting 1d', state: 'requested', icon: Drum },
  { role: 'MC', who: 'Find an MC', state: 'open', icon: Mic },
  { role: 'Gele & makeup', who: 'Find an artist', state: 'open', icon: Palette },
  { role: 'Mobile bar', who: 'Find a bar', state: 'open', icon: Martini },
]
const RUN_OF_SHOW = [
  ['14:00', 'Guests arrive'],
  ['15:30', 'Buffet opens'],
  ['17:45', 'Cake cutting'],
  ['18:00', 'First dance'],
]

function PlannerBoard() {
  return (
    <Shell bottom={<TabBar tabs={PLANNER_TABS} active={1} />}>
      <div style={{ padding: '50px 18px 0' }}>
        <div className="flex items-start justify-between" style={{ gap: 10 }}>
          <div className="min-w-0">
            <div style={{ ...KICKER }}>Bakare Events · Sat 20 Feb · 91 days</div>
            <div style={{ ...DISPLAY, fontSize: 22, marginTop: 5 }}>Ngozi & Emeka · 40 Years</div>
            <div style={{ fontSize: 10.5, color: S.ink2, marginTop: 4 }}>The Orangery, Royal Docks · 180 guests · 14:00</div>
          </div>
          <Monogram letters="TB" size={34} />
        </div>

        {/* budget */}
        <Surface style={{ marginTop: 12 }} pad={12}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8 }}>
            {[
              { l: 'Budget', v: '£18,500', c: S.ink },
              { l: 'Committed', v: '£11,270', c: S.accentText },
              { l: 'Remaining', v: '£7,230', c: S.brassText },
            ].map((b) => (
              <div key={b.l}>
                <div style={{ ...KICKER, fontSize: 8.5 }}>{b.l}</div>
                <div style={{ ...NUM, fontSize: 19, color: b.c, marginTop: 3 }}>{b.v}</div>
              </div>
            ))}
          </div>
          <div className="relative overflow-hidden rounded-full" style={{ height: 6, marginTop: 10, background: S.high }}>
            <span className="absolute inset-y-0 left-0" style={{ width: '61%', background: S.accent }} />
            <span className="absolute inset-y-0" style={{ left: '61%', width: '8%', background: S.brass }} />
          </div>
          <div className="flex justify-between" style={{ ...MONO, fontSize: 8.5, color: S.ink3, marginTop: 4 }}>
            <span>61% committed</span>
            <span>8% requested · 31% free</span>
          </div>
        </Surface>

        {/* roles bento */}
        <Kicker style={{ marginTop: 12 }} right={<span style={{ fontSize: 9.5 }}>2 confirmed · 4 requested · 3 open</span>}>
          Roles
        </Kicker>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 7, marginTop: 7 }}>
          {TILES.map((t) => {
            const conf = t.state === 'confirmed'
            const req = t.state === 'requested'
            const open = t.state === 'open'
            return (
              <div
                key={t.role}
                className="flex flex-col justify-between"
                style={{
                  gridColumn: t.span ? `span ${t.span}` : undefined,
                  minHeight: 84,
                  padding: 8,
                  borderRadius: 11,
                  background: conf ? S.night2 : req ? S.brassSoft : 'transparent',
                  color: conf ? S.onNight : req ? S.onBrass : S.ink2,
                  outline: open ? `1px dashed ${mix(S.ink, 32)}` : undefined,
                  outlineOffset: -1,
                }}
              >
                <div className="flex items-center justify-between">
                  <t.icon size={14} strokeWidth={1.9} style={{ color: conf ? S.brass : req ? S.brassText : S.ink3 }} />
                  {conf && <Check size={12} strokeWidth={3} style={{ color: S.brass }} />}
                  {req && <span className="rounded-full" style={{ width: 7, height: 7, background: S.held }} />}
                  {open && <Plus size={12} style={{ color: S.ink3 }} />}
                </div>
                {t.strip && (
                  <div style={{ margin: '6px 0 4px' }}>
                    <Strip states={BOLA} ring={EVENT_IDX} h={6} gap={2} />
                  </div>
                )}
                <div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, lineHeight: 1.2 }}>{t.role}</div>
                  <div className="truncate" style={{ fontSize: 9, color: conf ? S.onNight2 : req ? S.onBrass : S.ink3, marginTop: 1 }}>
                    {t.who}
                  </div>
                  {t.note && (
                    <div className="truncate" style={{ ...MONO, fontSize: 8.5, color: conf ? S.brass : S.brassText, marginTop: 1 }}>
                      {t.note}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
          {/* the run of show sits in the bento's last two cells */}
          <div className="flex flex-col" style={{ gridColumn: 'span 2', minHeight: 84, padding: '8px 10px', borderRadius: 11, background: S.surface, boxShadow: CARD_SHADOW }}>
            <div className="flex items-center justify-between">
              <span style={{ ...KICKER, fontSize: 8.5 }}>Run of show</span>
              <span style={{ ...MONO, fontSize: 8.5, color: S.ink3 }}>4 of 11</span>
            </div>
            <div className="grid flex-1" style={{ gridTemplateColumns: '1fr 1fr', gap: '2px 10px', marginTop: 5 }}>
              {RUN_OF_SHOW.map(([t, w]) => (
                <div key={t} className="flex items-center" style={{ gap: 6 }}>
                  <span style={{ ...MONO, fontSize: 10, fontWeight: 600, color: S.accentText }}>{t}</span>
                  <span className="truncate" style={{ fontSize: 9.5, color: S.ink2 }}>{w}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* next reply due */}
        <div className="flex items-center" style={{ gap: 10, marginTop: 10, padding: '9px 12px', borderRadius: 12, background: S.night2, color: S.onNight }}>
          <Monogram letters="IB" tone="brass" size={28} fs={11} />
          <div className="min-w-0 flex-1">
            <div style={{ fontSize: 11, fontWeight: 600 }}>Ìyá Bola usually replies within 2h</div>
            <div style={{ fontSize: 9.5, color: S.onNight2, marginTop: 1 }}>Request sent 16:55 · Premium buffet · £5,760 · held for Sat 20 Feb</div>
          </div>
          <ChevronRight size={14} style={{ color: S.onNight2 }} />
        </div>
      </div>
    </Shell>
  )
}

/* ---- guests */

const GUESTS = [
  { l: 'RC', tone: 'ever' as const, name: 'Ruth Chukwu', group: 'Family · +1', rsvp: 'Yes', table: 'T3' },
  { l: 'OE', tone: 'brass' as const, name: 'Pastor Obi Eze', group: 'Church', rsvp: 'Yes', table: 'T1' },
  { l: 'NO', tone: 'ever' as const, name: 'Aunty Ngozi Okafor', group: 'Family · +2', rsvp: 'Pending', table: '' },
  { l: 'FA', tone: 'brass' as const, name: 'Femi & Tolu Adebayo', group: 'Colleagues · +1', rsvp: 'Yes', table: 'T12' },
  { l: 'CN', tone: 'ever' as const, name: 'Chidinma Nwosu', group: 'Family', rsvp: 'No', table: '' },
  { l: 'GA', tone: 'brass' as const, name: 'Mrs Grace Adeyemi', group: 'Church · +1', rsvp: 'Yes', table: 'T7' },
]

function Guests() {
  return (
    <Shell
      bottom={
        <Dock>
          <Btn kind="ghost" icon={UserPlus}>
            Add guest
          </Btn>
          <Btn kind="primary" icon={QrCode}>
            Send invites
          </Btn>
        </Dock>
      }
    >
      <div style={{ padding: '52px 18px 0' }}>
        <div className="flex items-center justify-between">
          <span style={{ ...DISPLAY, fontSize: 28 }}>Guests</span>
          <span style={{ fontSize: 10.5, color: S.ink2 }}>Ngozi & Emeka · 180 invited</span>
        </div>
        <div className="flex items-end justify-between" style={{ marginTop: 8 }}>
          <div className="flex items-end" style={{ gap: 8 }}>
            <span style={{ ...NUM, fontSize: 66, lineHeight: 0.85, color: S.accentText }}>112</span>
            <span style={{ fontSize: 16, fontWeight: 600, paddingBottom: 2 }}>yes</span>
          </div>
          <div className="flex flex-col items-end" style={{ gap: 3, ...MONO, fontSize: 11.5, paddingBottom: 2 }}>
            <span className="inline-flex items-center" style={{ gap: 6 }}>
              <span style={{ fontWeight: 600 }}>23</span> <span style={{ color: S.ink2 }}>no</span> <span className="rounded-full" style={{ width: 8, height: 8, background: S.ink3 }} />
            </span>
            <span className="inline-flex items-center" style={{ gap: 6 }}>
              <span style={{ fontWeight: 600 }}>45</span> <span style={{ color: S.ink2 }}>pending</span> <span className="rounded-full" style={{ width: 8, height: 8, background: S.brass }} />
            </span>
          </div>
        </div>
        <div className="flex overflow-hidden rounded-full" style={{ height: 8, marginTop: 10, gap: 2 }}>
          <span style={{ width: '62.2%', background: S.accent }} />
          <span style={{ width: '12.8%', background: S.ink3 }} />
          <span style={{ width: '25%', background: S.brass }} />
        </div>

        <Surface style={{ marginTop: 12 }} pad={11}>
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center" style={{ gap: 6, fontSize: 11.5 }}>
              <QrCode size={13} style={{ color: S.brassText }} />
              <span style={{ ...MONO, fontWeight: 600 }}>135</span> of 180 QR invites sent
            </span>
            <span style={{ ...MONO, fontSize: 10, color: S.ink3 }}>75%</span>
          </div>
          <div className="relative overflow-hidden rounded-full" style={{ height: 5, marginTop: 7, background: S.high }}>
            <span className="absolute inset-y-0 left-0" style={{ width: '75%', background: S.brass }} />
          </div>
        </Surface>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 8, marginTop: 10 }}>
          {[
            ['18', 'tables', '10 seats each'],
            ['112', 'seated', 'by group'],
            ['68', 'seats free', 'for pending'],
          ].map(([n, l, d]) => (
            <div key={l} style={{ padding: '7px 10px', borderRadius: 10, background: S.surface, boxShadow: CARD_SHADOW }}>
              <span className="inline-flex items-baseline" style={{ gap: 4 }}>
                <span style={{ ...NUM, fontSize: 17 }}>{n}</span>
                <span style={{ fontSize: 10, fontWeight: 600 }}>{l}</span>
              </span>
              <div style={{ fontSize: 9, color: S.ink3 }}>{d}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center" style={{ gap: 6, marginTop: 12 }}>
          {[
            ['All', '180', true],
            ['Family', '64', false],
            ['Church', '52', false],
            ['Colleagues', '38', false],
          ].map(([n, c, on]) => (
            <span key={n as string} className="inline-flex items-center rounded-full" style={{ gap: 4, padding: '4px 10px', fontSize: 10.5, fontWeight: 600, background: on ? S.ink : S.high, color: on ? S.onNight : S.ink2 }}>
              {n}
              <span style={{ ...MONO, fontWeight: 500, fontSize: 9.5, color: on ? S.onNight2 : S.ink3 }}>{c}</span>
            </span>
          ))}
        </div>

        <div style={{ marginTop: 6 }}>
          {GUESTS.map((g, i) => (
            <div key={g.name} className="flex items-center" style={{ gap: 10, padding: '8px 0', borderTop: i ? `1px solid ${S.rule}` : undefined }}>
              <Monogram letters={g.l} tone={g.tone} size={32} fs={12} />
              <div className="min-w-0 flex-1">
                <div className="truncate" style={{ fontSize: 12, fontWeight: 600 }}>{g.name}</div>
                <div style={{ fontSize: 9.5, color: S.ink3, marginTop: 1 }}>{g.group}</div>
              </div>
              <Pill tone={g.rsvp === 'Yes' ? 'ever' : g.rsvp === 'No' ? 'ink' : 'brass'} fs={9}>
                {g.rsvp}
              </Pill>
              <span className="text-right" style={{ ...MONO, fontSize: 10.5, width: 26, color: g.table ? S.ink : S.ink3 }}>
                {g.table || '·'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

/* ---- checkin (night) */

function Checkin({ reduced }: { reduced: boolean }) {
  const R = 30
  const C = 2 * Math.PI * R
  return (
    <Shell
      dark
      bottom={
        <Dock dark>
          <Btn kind="ghost" dark icon={UserPlus}>
            Walk-in
          </Btn>
          <Btn kind="ghost" dark icon={Search}>
            Find
          </Btn>
          <Btn kind="brass" icon={ScanLine}>
            Scan next
          </Btn>
        </Dock>
      }
    >
      <div style={{ padding: '50px 18px 0' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center" style={{ gap: 8 }}>
            <ChevronLeft size={18} style={{ color: S.onNight2 }} />
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600 }}>Adaora & Kunle</div>
              <div style={{ fontSize: 10, color: S.onNight2 }}>Olá Event Hall, Peckham · Doors 18:30</div>
            </div>
          </div>
          <span className="inline-flex items-center rounded-full" style={{ gap: 5, padding: '3px 8px', ...MONO, fontSize: 9, fontWeight: 600, background: mix(S.free, 18), color: S.onNight }}>
            <motion.span className="rounded-full" style={{ width: 6, height: 6, background: S.free }} animate={reduced ? undefined : { opacity: [1, 0.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
            live
          </span>
        </div>

        {/* viewfinder */}
        <div className="relative overflow-hidden" style={{ height: 216, marginTop: 12, borderRadius: 16, background: `radial-gradient(80% 70% at 50% 50%, ${S.night2}, ${S.night})`, boxShadow: `inset 0 0 0 1px ${mix(S.onNight, 10)}` }}>
          {[
            { top: 14, left: 14, bt: 'top', bl: 'left' },
            { top: 14, right: 14, bt: 'top', bl: 'right' },
            { bottom: 14, left: 14, bt: 'bottom', bl: 'left' },
            { bottom: 14, right: 14, bt: 'bottom', bl: 'right' },
          ].map((c, i) => (
            <span key={i} className="absolute" style={{ width: 26, height: 26, top: c.top, left: c.left, right: c.right, bottom: c.bottom, borderStyle: 'solid', borderColor: S.brass, borderWidth: 0, [`border${c.bt[0].toUpperCase()}${c.bt.slice(1)}Width`]: 2.5, [`border${c.bl[0].toUpperCase()}${c.bl.slice(1)}Width`]: 2.5, borderRadius: 3 } as CSSProperties} />
          ))}
          <div className="absolute" style={{ left: '50%', top: '50%', width: 92, height: 92, transform: 'translate(-50%, -50%)', opacity: 0.22, display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {Array.from({ length: 49 }, (_, i) => (
              <span key={i} style={{ background: (i * 7 + 3) % 5 < 2 ? S.onNight : 'transparent', borderRadius: 1 }} />
            ))}
          </div>
          <motion.span
            className="absolute inset-x-6"
            style={{ height: 2, top: '30%', background: `linear-gradient(90deg, transparent, ${S.brass} 25%, ${S.brass} 75%, transparent)`, boxShadow: `0 0 14px ${mix(S.brass, 70)}` }}
            animate={reduced ? undefined : { top: ['24%', '76%', '24%'] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="absolute inset-x-0 text-center" style={{ bottom: 12, ...MONO, fontSize: 9, color: S.onNight2, letterSpacing: '0.06em' }}>POINT AT THE GUEST'S QR INVITE</span>
        </div>

        {/* counter */}
        <div className="flex items-center justify-between" style={{ marginTop: 14 }}>
          <div>
            <div className="flex items-end" style={{ gap: 8 }}>
              <span style={{ ...NUM, fontSize: 64, lineHeight: 0.85 }}>41</span>
              <span style={{ fontSize: 15, color: S.onNight2, paddingBottom: 2 }}>of 90</span>
            </div>
            <div className="whitespace-nowrap" style={{ ...MONO, fontSize: 10, color: S.onNight2, marginTop: 8 }}>
              49 to come · 2 walk-ins · <span style={{ color: S.brass }}>1 duplicate</span>
            </div>
          </div>
          <svg width="76" height="76" viewBox="0 0 76 76" aria-hidden>
            <circle cx="38" cy="38" r={R} fill="none" stroke={mix(S.onNight, 14)} strokeWidth="6" />
            <circle cx="38" cy="38" r={R} fill="none" stroke={S.brass} strokeWidth="6" strokeLinecap="round" strokeDasharray={`${C * 0.46} ${C}`} transform="rotate(-90 38 38)" />
            <text x="38" y="42" textAnchor="middle" fill={S.onNight} style={{ ...MONO, fontSize: 13, fontWeight: 600 }}>
              46%
            </text>
          </svg>
        </div>

        {/* last scan */}
        <div className="flex items-center" style={{ gap: 12, marginTop: 12, padding: '10px 12px', borderRadius: 14, background: S.accent, color: S.onAccent }}>
          <span className="flex items-center justify-center rounded-full" style={{ width: 34, height: 34, background: mix(S.onAccent, 18) }}>
            <Check size={18} strokeWidth={3} />
          </span>
          <div className="min-w-0 flex-1">
            <div style={{ ...MONO, fontSize: 8.5, letterSpacing: '0.1em', opacity: 0.8 }}>ADMITTED · 18:41</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 1 }}>Ruth Chukwu</div>
            <div style={{ fontSize: 10.5, opacity: 0.85 }}>Table 3 · Family · +1 with her</div>
          </div>
          <span style={{ ...NUM, fontSize: 26, color: S.brassSoft }}>T3</span>
        </div>

        {/* log */}
        <div style={{ marginTop: 8 }}>
          {[
            { t: '18:40', who: 'Pastor Obi Eze', tbl: 'T1', st: 'Admitted', icon: Check, c: S.free },
            { t: '18:39', who: 'Femi Adebayo', tbl: 'T12', st: 'Duplicate scan', icon: Copy, c: S.brass },
            { t: '18:37', who: 'Walk-in · Mrs Ene', tbl: 'T9', st: 'Admitted', icon: Check, c: S.free },
            { t: '18:36', who: 'Aunty Ngozi Okafor', tbl: 'T5', st: 'Admitted', icon: Check, c: S.free },
          ].map((r) => (
            <div key={r.t} className="flex items-center" style={{ gap: 10, padding: '6px 2px', borderTop: `1px solid ${mix(S.onNight, 8)}`, fontSize: 11 }}>
              <span style={{ ...MONO, fontSize: 10, color: S.onNight2, width: 32 }}>{r.t}</span>
              <span className="min-w-0 flex-1 truncate">{r.who}</span>
              <span style={{ ...MONO, fontSize: 10, color: S.onNight2 }}>{r.tbl}</span>
              <span className="inline-flex items-center" style={{ gap: 4, color: r.c, fontSize: 10, width: 86, justifyContent: 'flex-end' }}>
                <r.icon size={11} strokeWidth={2.5} /> {r.st}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

/* ---- vendorRequest */

function VendorRequest() {
  return (
    <Shell
      bottom={
        <div style={{ background: S.surface, borderTop: `1px solid ${S.rule}` }}>
          <div className="text-center" style={{ paddingTop: 10, fontSize: 11, fontWeight: 600, color: S.accentText }}>Propose new date</div>
          <div className="flex items-center" style={{ gap: 10, padding: '8px 16px 26px' }}>
            <Btn kind="danger">Decline</Btn>
            <Btn kind="primary" icon={Check}>
              Accept
            </Btn>
          </div>
        </div>
      }
    >
      <div style={{ padding: '50px 18px 0' }}>
        <div className="flex items-center justify-between" style={{ fontSize: 11, color: S.ink2 }}>
          <span className="inline-flex items-center" style={{ gap: 2 }}>
            <ChevronLeft size={15} /> Inbox
          </span>
          <span style={{ ...MONO, fontSize: 10 }}>1 of 3 · 47m ago</span>
        </div>
        <div className="flex items-center" style={{ gap: 8, marginTop: 14 }}>
          <span className="inline-flex items-center rounded-[4px]" style={{ padding: '2px 7px', ...MONO, fontSize: 9, letterSpacing: '0.1em', fontWeight: 600, color: S.brassText, boxShadow: `inset 0 0 0 1.5px ${S.brass}`, transform: 'rotate(-2deg)' }}>
            NEW REQUEST
          </span>
          <span style={{ fontSize: 10, color: S.ink3 }}>Catering · 180 guests</span>
        </div>
        <div style={{ ...DISPLAY, fontSize: 23, marginTop: 8 }}>Ngozi & Emeka · 40 Years</div>

        <div className="flex items-center" style={{ gap: 10, marginTop: 12 }}>
          <Monogram letters="TB" size={36} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center" style={{ gap: 6 }}>
              <span style={{ fontSize: 12.5, fontWeight: 600 }}>Tunde Bakare</span>
              <Verified fs={9.5} />
            </div>
            <div style={{ fontSize: 10, color: S.ink2, marginTop: 1 }}>Planner · Bakare Events · 4.9 (187) · 12 bookings with you</div>
          </div>
        </div>

        {/* date block */}
        <Surface style={{ marginTop: 12 }} pad={12}>
          <div className="flex items-start justify-between">
            <div>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Sat 20 Feb 2027</div>
              <div className="flex items-center" style={{ gap: 6, marginTop: 4, ...MONO, fontSize: 11.5 }}>
                <span>13:00</span>
                <ArrowRight size={11} style={{ color: S.ink3 }} />
                <span>23:00</span>
                <span style={{ color: S.ink3 }}>·</span>
                <span className="inline-flex items-center" style={{ gap: 3 }}>
                  <Users size={11} style={{ color: S.ink3 }} /> 180
                </span>
              </div>
              <div className="inline-flex items-center" style={{ gap: 4, marginTop: 4, fontSize: 10, color: S.ink2 }}>
                <MapPin size={10} /> The Orangery, Royal Docks, London E16
              </div>
            </div>
            <span className="inline-flex items-center rounded-full" style={{ gap: 5, padding: '4px 9px', fontSize: 10, fontWeight: 600, background: S.brassSoft, color: S.brassText }}>
              <Lock size={10} /> Held for this
            </span>
          </div>
          <div style={{ marginTop: 12 }}>
            <Strip states={BOLA} ring={EVENT_IDX} h={12} gap={4} />
            <StripDates />
          </div>
        </Surface>

        {/* package */}
        <Surface style={{ marginTop: 10 }} pad={12}>
          <div className="flex items-center justify-between" style={{ gap: 10 }}>
            <div className="min-w-0">
              <div className="flex items-center" style={{ gap: 6 }}>
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>Premium buffet</span>
                <Pill tone="brass" fs={8.5}>
                  Most booked
                </Pill>
              </div>
              <div style={{ ...MONO, fontSize: 10.5, color: S.ink2, marginTop: 3 }}>£32 per head × 180 guests</div>
            </div>
            <span style={{ ...NUM, fontSize: 26 }}>£5,760</span>
          </div>
          <div className="flex flex-wrap" style={{ gap: 5, marginTop: 9 }}>
            {['6 service staff', 'Chafing setup', 'Set up from 12:00', 'Clear-down'].map((c) => (
              <Pill key={c} tone="ink" fs={8.5}>
                {c}
              </Pill>
            ))}
          </div>
        </Surface>

        {/* note */}
        <div className="flex" style={{ gap: 10, marginTop: 12, padding: '2px 0 0 2px' }}>
          <span className="shrink-0 rounded-full" style={{ width: 2, background: S.brass }} />
          <div>
            <div style={{ ...KICKER, fontSize: 8.5 }}>Note from Tunde</div>
            <div style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 12.5, lineHeight: 1.35, color: S.ink2, marginTop: 3 }}>
              “Adaeze's mum is Igbo and her dad Yoruba, so please keep ofe nsala and asun on the menu alongside the jollof. Service from 15:30.”
            </div>
          </div>
        </div>

        {/* the rest of the inbox */}
        <Kicker style={{ marginTop: 14 }} right={<span style={{ fontSize: 9.5 }}>reply within 2h to stay on top</span>}>
          Also waiting
        </Kicker>
        <div style={{ marginTop: 4 }}>
          {[
            { l: 'RA', tone: 'brass' as const, who: 'Ronke Adeyinka', what: 'Sat 12 Dec · 300 guests · Premium', amt: '£13,500', st: 'Date clash', tone2: 'danger' as PillTone },
            { l: 'KA', tone: 'ever' as const, who: 'Kunle Adewale', what: 'Sat 16 Jan · hall + buffet · 180', amt: '£6,960', st: 'New', tone2: 'brass' as PillTone },
          ].map((r, i) => (
            <div key={r.who} className="flex items-center" style={{ gap: 9, padding: '7px 0', borderTop: i ? `1px solid ${S.rule}` : undefined }}>
              <Monogram letters={r.l} tone={r.tone} size={28} fs={11} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center" style={{ gap: 6 }}>
                  <span className="truncate" style={{ fontSize: 11.5, fontWeight: 600 }}>{r.who}</span>
                  <Pill tone={r.tone2} fs={8}>
                    {r.st}
                  </Pill>
                </div>
                <div className="truncate" style={{ fontSize: 9.5, color: S.ink2, marginTop: 1 }}>{r.what}</div>
              </div>
              <span style={{ ...MONEY, fontSize: 11 }}>{r.amt}</span>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  )
}

/* ---- vendorCalendar */

function VendorCalendar() {
  const first = 6 // Nov 1 2026 is a Sunday: six empty cells on a Monday-first grid
  const cells = Array.from({ length: 42 }, (_, i) => i - first + 1)
  return (
    <Shell
      bottom={
        <Dock>
          <Btn kind="ghost" icon={Plus}>
            Block a day
          </Btn>
          <Btn kind="primary" icon={CalendarDays}>
            Open requests · 2
          </Btn>
        </Dock>
      }
    >
      <div style={{ padding: '52px 18px 0' }}>
        <div className="flex items-center justify-between">
          <span style={{ ...DISPLAY, fontSize: 28 }}>Calendar</span>
          <Segmented a="Catering" b="Hall" active={0} />
        </div>

        {/* the dark fourteen-day band */}
        <div style={{ marginTop: 12, padding: '12px 14px 12px', borderRadius: 14, background: S.night, color: S.onNight }}>
          <Kicker dark right={<span style={{ fontSize: 9.5 }}>Sat 21 Nov to Fri 4 Dec</span>}>
            Next 14 days
          </Kicker>
          <div style={{ marginTop: 10 }}>
            <Strip states={NEXT14} ring={0} h={16} gap={4} dark />
          </div>
          <div className="flex items-center justify-between whitespace-nowrap" style={{ marginTop: 10, ...MONO, fontSize: 9, color: S.onNight2 }}>
            {[
              ['8 free', S.free],
              ['2 held', S.held],
              ['3 booked', S.onNight],
              ['1 blocked', mix(S.onNight, 18)],
            ].map(([l, c]) => (
              <span key={l} className="inline-flex items-center" style={{ gap: 5 }}>
                <span className="rounded-[2px]" style={{ width: 9, height: 9, background: c }} />
                <span style={{ color: S.onNight, fontWeight: 600, fontSize: 10 }}>{l}</span>
              </span>
            ))}
          </div>
        </div>

        {/* month */}
        <div className="flex items-center justify-between" style={{ marginTop: 14 }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>November 2026</span>
          <span className="flex items-center" style={{ gap: 14, color: S.ink3 }}>
            <ChevronLeft size={16} />
            <ChevronRight size={16} />
          </span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', marginTop: 8, ...MONO, fontSize: 9, color: S.ink3, textAlign: 'center' }}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))', gap: 3, marginTop: 4 }}>
          {cells.map((d, i) => {
            const inMonth = d >= 1 && d <= 30
            const st = inMonth ? NOV[d] ?? 'free' : undefined
            const past = inMonth && d < 21
            const today = d === 21
            const bg = !inMonth ? 'transparent' : st === 'booked' ? (past ? mix(S.booked, 55) : S.booked) : st === 'held' ? S.brassSoft : st === 'blocked' ? S.blocked : past ? 'transparent' : S.surface
            const fg = !inMonth ? 'transparent' : st === 'booked' ? S.onNight : st === 'held' ? S.brassText : st === 'blocked' ? S.ink3 : past ? S.ink3 : S.ink
            return (
              <span key={i} className="relative flex flex-col items-center justify-center" style={{ height: 33, borderRadius: 8, background: bg, color: fg, ...MONO, fontSize: 11.5, fontWeight: today || st === 'booked' ? 600 : 500, boxShadow: today ? `inset 0 0 0 2px ${S.brass}` : inMonth && st === 'free' && !past ? `inset 0 0 0 1px ${S.rule}` : undefined, textDecoration: st === 'blocked' ? 'line-through' : undefined }}>
                {inMonth ? d : ''}
                {inMonth && st === 'free' && !past && <span className="absolute rounded-full" style={{ bottom: 4, width: 4, height: 4, background: S.free }} />}
                {inMonth && st === 'held' && <span className="absolute rounded-full" style={{ bottom: 4, width: 4, height: 4, background: S.held }} />}
              </span>
            )
          })}
        </div>

        {/* selected day */}
        <div className="flex items-center" style={{ gap: 10, marginTop: 10, padding: '9px 12px', borderRadius: 12, background: S.surface, boxShadow: CARD_SHADOW }}>
          <span className="flex flex-col items-center justify-center rounded-[8px]" style={{ width: 38, height: 38, background: S.booked, color: S.onNight }}>
            <span style={{ ...MONO, fontSize: 8, letterSpacing: '0.08em', color: S.onNight2 }}>SAT</span>
            <span style={{ ...NUM, fontSize: 16 }}>21</span>
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate" style={{ fontSize: 12, fontWeight: 600 }}>Adaora & Kunle · engagement dinner</div>
            <div className="truncate" style={{ fontSize: 10, color: S.ink2, marginTop: 1 }}>Olá Event Hall, Peckham · 90 guests · Classic buffet · tonight</div>
          </div>
          <Pill tone="night" fs={8.5}>
            Booked
          </Pill>
        </div>
        <div className="flex items-center" style={{ gap: 10, marginTop: 8, padding: '9px 12px', borderRadius: 12, background: S.brassSoft }}>
          <span className="flex flex-col items-center justify-center rounded-[8px]" style={{ width: 38, height: 38, background: S.brass, color: S.onBrass }}>
            <span style={{ ...MONO, fontSize: 8, letterSpacing: '0.08em' }}>FRI</span>
            <span style={{ ...NUM, fontSize: 16 }}>27</span>
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate" style={{ fontSize: 12, fontWeight: 600 }}>Chidi & Amara · wedding reception</div>
            <div className="truncate" style={{ fontSize: 10, color: S.brassText, marginTop: 1 }}>120 guests · Premium buffet · reply due Mon 23 Nov</div>
          </div>
          <Pill tone="brass" fs={8.5}>
            Held
          </Pill>
        </div>
      </div>
    </Shell>
  )
}

/* ------------------------------------------------------------------ web screens (super admin) */

function WebScreen({ screen }: { screen: Screen }) {
  return screen === 'adminOverview' ? <AdminOverview /> : <AdminVerification />
}

const NAV: { label: string; icon: LucideIcon; badge?: number }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Verification', icon: ShieldCheck, badge: 23 },
  { label: 'Reviews', icon: Star },
  { label: 'Users & roles', icon: Users },
  { label: 'Listings', icon: Store },
  { label: 'Events & bookings', icon: CalendarDays },
  { label: 'Notifications', icon: Bell },
  { label: 'Reports', icon: ChartBar },
  { label: 'Settings', icon: Settings },
]

function AdminShell({ active, title, crumb, children }: { active: number; title: string; crumb?: string; children: ReactNode }) {
  return (
    <div className="absolute inset-0 flex" style={{ background: S.bg, color: S.ink, fontSize: 12 }}>
      {/* sidebar */}
      <aside className="flex shrink-0 flex-col" style={{ width: 200, background: S.night, color: S.onNight, padding: '18px 12px 16px' }}>
        <div className="flex items-baseline" style={{ padding: '0 8px', gap: 2 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, letterSpacing: '-0.01em' }}>e-dera</span>
          <span className="rounded-full" style={{ width: 6, height: 6, background: S.brass, marginLeft: 1 }} />
        </div>
        <div style={{ ...KICKER, color: S.onNight2, padding: '0 8px', marginTop: 2 }}>Super admin</div>
        <nav className="flex flex-col" style={{ gap: 2, marginTop: 20 }}>
          {NAV.map((n, i) => {
            const on = i === active
            return (
              <span key={n.label} className="relative flex items-center rounded-[8px]" style={{ gap: 9, height: 32, padding: '0 10px', fontSize: 12, fontWeight: on ? 600 : 500, background: on ? mix(S.onNight, 9) : 'transparent', color: on ? S.onNight : S.onNight2 }}>
                {on && <span className="absolute rounded-r-[2px]" style={{ left: -12, width: 3, height: 18, background: S.brass }} />}
                <n.icon size={14} strokeWidth={on ? 2.2 : 1.8} style={{ color: on ? S.brass : S.onNight2 }} />
                <span className="flex-1 truncate">{n.label}</span>
                {n.badge && (
                  <span className="rounded-full" style={{ padding: '1px 6px', ...MONO, fontSize: 9.5, fontWeight: 600, background: S.brass, color: S.onBrass }}>
                    {n.badge}
                  </span>
                )}
              </span>
            )
          })}
        </nav>
        <div className="mt-auto flex items-center" style={{ gap: 9, padding: '10px 8px 0', borderTop: `1px solid ${mix(S.onNight, 10)}` }}>
          <Monogram letters="D" tone="brass" size={28} fs={12} />
          <div className="min-w-0">
            <div style={{ fontSize: 11.5, fontWeight: 600 }}>Dave</div>
            <div style={{ fontSize: 9.5, color: S.onNight2 }}>Owner · UK & Nigeria</div>
          </div>
        </div>
      </aside>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center" style={{ height: 52, padding: '0 24px', gap: 16, background: S.surface, borderBottom: `1px solid ${S.rule}` }}>
          <div className="flex items-baseline" style={{ gap: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
            {crumb && <span style={{ fontSize: 11, color: S.ink3 }}>{crumb}</span>}
          </div>
          <div className="mx-auto flex items-center" style={{ gap: 8, width: 280, height: 32, padding: '0 10px', borderRadius: 9, background: S.bg, boxShadow: `inset 0 0 0 1px ${S.rule}` }}>
            <Search size={13} style={{ color: S.ink3 }} />
            <span style={{ fontSize: 12 }}>Bakare</span>
            <span className="ml-auto" style={{ ...MONO, fontSize: 9.5, color: S.ink3 }}>⌘K</span>
          </div>
          <span className="relative" style={{ color: S.ink2 }}>
            <Bell size={16} />
            <span className="absolute rounded-full" style={{ top: -2, right: -2, width: 7, height: 7, background: S.brass, boxShadow: `0 0 0 2px ${S.surface}` }} />
          </span>
          <span className="inline-flex items-center rounded-[9px]" style={{ gap: 6, height: 32, padding: '0 12px', fontSize: 12, fontWeight: 600, background: S.brass, color: S.onBrass }}>
            <ShieldCheck size={14} /> Verify · 23
          </span>
        </header>
        <div className="relative min-h-0 flex-1">{children}</div>
      </div>
    </div>
  )
}

type QueueItem = { l: string; tone: 'ever' | 'brass'; name: string; type: string; city: string; st: string; when: string; on?: boolean }
const QUEUE: QueueItem[] = [
  { l: 'SO', tone: 'ever' as const, name: 'SO Occasions', type: 'Planner', city: 'Manchester', st: 'Pending', when: '2h', on: true },
  { l: 'LL', tone: 'brass' as const, name: 'Lens of Lagos', type: 'Photographer', city: 'Lagos', st: 'Pending', when: '5h' },
  { l: 'AL', tone: 'ever' as const, name: 'Asake Live Band', type: 'Band', city: 'London', st: 'Info requested', when: '1d' },
  { l: 'EC', tone: 'brass' as const, name: 'Eko Convention Hall', type: 'Venue', city: 'Lagos', st: 'Pending', when: '1d' },
  { l: 'CA', tone: 'ever' as const, name: "Chef Amaka's Kitchen", type: 'Caterer', city: 'Abuja', st: 'Pending', when: '2d' },
  { l: 'DD', tone: 'brass' as const, name: 'Dami Deejay', type: 'DJ', city: 'Peckham', st: 'Pending', when: '2d' },
  { l: 'RM', tone: 'ever' as const, name: 'Royal Marquees', type: 'Venue', city: 'Birmingham', st: 'Pending', when: '3d' },
]

function QueueRow({ q, compact = false }: { q: QueueItem; compact?: boolean }) {
  return (
    <div className="relative flex items-center" style={{ gap: 10, padding: compact ? '7px 0' : '9px 16px', background: q.on && !compact ? S.surface : 'transparent', borderTop: `1px solid ${S.rule}` }}>
      {q.on && !compact && <span className="absolute inset-y-0 left-0" style={{ width: 3, background: S.accent }} />}
      <Monogram letters={q.l} tone={q.tone} size={compact ? 26 : 32} fs={compact ? 10 : 12} />
      <div className="min-w-0 flex-1">
        <div className="truncate" style={{ fontSize: compact ? 11.5 : 12.5, fontWeight: 600 }}>{q.name}</div>
        <div className="truncate" style={{ fontSize: 10, color: S.ink3, marginTop: 1 }}>
          {q.type} · {q.city}
        </div>
      </div>
      <Pill tone={q.st === 'Pending' ? 'ink' : 'brass'} fs={9}>
        {q.st}
      </Pill>
      <span style={{ ...MONO, fontSize: 10, color: S.ink3, width: 20, textAlign: 'right' }}>{q.when}</span>
    </div>
  )
}

function AdminVerification() {
  return (
    <AdminShell active={1} title="Verification" crumb="23 pending · 4 info requested">
      <div className="absolute inset-0 flex">
        {/* queue */}
        <div className="flex shrink-0 flex-col" style={{ width: 340, borderRight: `1px solid ${S.rule}` }}>
          <div className="flex items-center" style={{ gap: 14, height: 40, padding: '0 16px', fontSize: 11.5, color: S.ink3 }}>
            {[
              ['Pending', 23, true],
              ['Info requested', 4, false],
              ['Approved', null, false],
              ['Rejected', null, false],
            ].map(([l, c, on]) => (
              <span key={l as string} className="relative flex h-full items-center" style={{ gap: 5, fontWeight: on ? 600 : 500, color: on ? S.ink : S.ink3 }}>
                {l}
                {c !== null && <span style={{ ...MONO, fontSize: 9.5, color: S.ink3 }}>{c as number}</span>}
                {on && <span className="absolute inset-x-0 bottom-0" style={{ height: 2, background: S.accent }} />}
              </span>
            ))}
          </div>
          <div>
            {QUEUE.map((q) => (
              <QueueRow key={q.name} q={q} />
            ))}
          </div>
        </div>

        {/* inspector */}
        <div className="min-w-0 flex-1 overflow-hidden" style={{ padding: 22, background: S.surface }}>
          <div className="flex items-start justify-between" style={{ gap: 16 }}>
            <div className="flex items-center" style={{ gap: 12 }}>
              <Monogram letters="SO" size={46} fs={17} />
              <div>
                <div className="flex items-center" style={{ gap: 8 }}>
                  <span style={{ fontSize: 19, fontWeight: 600 }}>SO Occasions</span>
                  <Pill tone="ink" fs={9}>
                    Pending
                  </Pill>
                </div>
                <div style={{ fontSize: 11.5, color: S.ink2, marginTop: 3 }}>Segun Oyelaran · Planner · Manchester · 11 years in operation</div>
                <div style={{ ...MONO, fontSize: 10, color: S.ink3, marginTop: 3 }}>Applied Thu 19 Nov 2026 · case VR-2311 · assigned to you</div>
              </div>
            </div>
            <span className="inline-flex items-center whitespace-nowrap" style={{ gap: 6, fontSize: 11, color: S.accentText, fontWeight: 600 }}>
              <UserRound size={13} /> View public profile
            </span>
          </div>

          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 16 }}>
            <div>
              <Kicker right={<span style={{ fontSize: 9.5, color: S.accentText, fontWeight: 600 }}>4 of 4 checked</span>}>Documents</Kicker>
              <div style={{ marginTop: 6 }}>
                {[
                  ['Proof of identity', 'UK passport · expires 2031'],
                  ['Business registration', 'Companies House · 08831190'],
                  ['Public liability insurance', '£5m · valid to Aug 2027'],
                  ['Portfolio', '12 events · 48 photographs'],
                ].map(([t, d]) => (
                  <div key={t} className="flex items-center" style={{ gap: 10, padding: '7px 0', borderTop: `1px solid ${S.rule}` }}>
                    <span className="flex items-center justify-center rounded-full" style={{ width: 18, height: 18, background: S.accentSoft, color: S.accentText }}>
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div style={{ fontSize: 11.5, fontWeight: 600 }}>{t}</div>
                      <div className="truncate" style={{ fontSize: 10, color: S.ink3 }}>{d}</div>
                    </div>
                    <span style={{ fontSize: 10, color: S.accentText, fontWeight: 600 }}>Open</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Kicker right={<span style={{ fontSize: 9.5, color: S.accentText, fontWeight: 600 }}>4 passed</span>}>Automated checks</Kicker>
              <div style={{ marginTop: 6 }}>
                {[
                  ['Email verified', 'segun@sooccasions.co.uk'],
                  ['Phone verified', '+44 7700 ··· 412 · SMS code'],
                  ['Address matches registration', 'M1 4BT · Manchester'],
                  ['No duplicate account', 'name, phone, registration number'],
                ].map(([t, d]) => (
                  <div key={t} className="flex items-center" style={{ gap: 10, padding: '7px 0', borderTop: `1px solid ${S.rule}` }}>
                    <span className="flex items-center justify-center rounded-full" style={{ width: 18, height: 18, background: S.accentSoft, color: S.accentText }}>
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div style={{ fontSize: 11.5, fontWeight: 600 }}>{t}</div>
                      <div className="truncate" style={{ fontSize: 10, color: S.ink3 }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <Kicker right={<span style={{ fontSize: 9.5 }}>visible to admins only</span>}>Reviewer note</Kicker>
            <div style={{ marginTop: 6, padding: '9px 12px', borderRadius: 10, background: S.bg, boxShadow: `inset 0 0 0 1px ${S.rule}`, fontSize: 11.5, lineHeight: 1.4, color: S.ink2 }}>
              Documents are consistent and the insurance covers the 500-guest tier. Portfolio matches the public Instagram and three past Edera clients confirm the events. Ready to approve.
            </div>
          </div>

          <div className="flex items-center whitespace-nowrap" style={{ gap: 10, marginTop: 14 }}>
            <span className="inline-flex items-center rounded-[10px]" style={{ gap: 7, height: 38, padding: '0 18px', fontSize: 12.5, fontWeight: 600, background: S.accent, color: S.onAccent }}>
              <BadgeCheck size={15} /> Approve
            </span>
            <span className="inline-flex items-center rounded-[10px]" style={{ gap: 7, height: 38, padding: '0 16px', fontSize: 12.5, fontWeight: 600, color: S.ink, boxShadow: `inset 0 0 0 1px ${mix(S.ink, 22)}` }}>
              <MessageCircle size={14} /> Request info
            </span>
            <span className="inline-flex items-center rounded-[10px]" style={{ gap: 7, height: 38, padding: '0 16px', fontSize: 12.5, fontWeight: 600, color: S.danger, boxShadow: `inset 0 0 0 1px ${mix(S.danger, 35)}` }}>
              Reject
            </span>
            <span className="ml-auto min-w-0 truncate" style={{ ...MONO, fontSize: 10, color: S.ink3 }}>Notifies Segun by push and email</span>
          </div>

          <div style={{ marginTop: 14 }}>
            <Kicker>Activity</Kicker>
            <div style={{ marginTop: 4 }}>
              {[
                ['Sat 21 Nov · 18:02', 'Automated checks passed', 'system'],
                ['Fri 20 Nov · 11:40', 'Four documents uploaded', 'Segun Oyelaran'],
                ['Thu 19 Nov · 16:15', 'Applied as a planner · Manchester', 'Segun Oyelaran'],
              ].map(([t, w, who]) => (
                <div key={t} className="flex items-center" style={{ gap: 10, padding: '6px 0', borderTop: `1px solid ${S.rule}`, fontSize: 11 }}>
                  <span style={{ ...MONO, fontSize: 10, color: S.ink3, width: 120 }}>{t}</span>
                  <span className="flex-1">{w}</span>
                  <span style={{ fontSize: 10, color: S.ink3 }}>{who}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}

/* ---- adminOverview */

const MONTHS = ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
const VENDORS = [360, 430, 500, 580, 660, 760, 860, 970, 1090, 1210, 1330, 1440]
const CLIENTS = [820, 940, 1080, 1240, 1390, 1560, 1760, 1980, 2210, 2480, 2720, 2960]
const PLANNERS = [96, 118, 140, 162, 186, 212, 240, 268, 300, 338, 374, 412]

/** Users by role, twelve months, stacked: vendors in ink, clients in evergreen, planners in brass. */
function AreaChart() {
  const W = 640
  const H = 368
  const L = 34
  const R = 10
  const T = 10
  const B = 22
  const MAX = 5000
  const x = (i: number) => L + (i * (W - L - R)) / 11
  const y = (v: number) => T + (1 - v / MAX) * (H - T - B)
  const cum1 = VENDORS
  const cum2 = VENDORS.map((v, i) => v + CLIENTS[i])
  const cum3 = cum2.map((v, i) => v + PLANNERS[i])
  const band = (lower: number[], upper: number[]) => {
    const top = upper.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
    const bottom = [...lower]
      .map((v, i) => `L${x(i).toFixed(1)} ${y(v).toFixed(1)}`)
      .reverse()
      .join(' ')
    return `${top} ${bottom} Z`
  }
  const zeros = VENDORS.map(() => 0)
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" aria-hidden>
      {[1000, 2000, 3000, 4000, 5000].map((v) => (
        <g key={v}>
          <line x1={L} x2={W - R} y1={y(v)} y2={y(v)} stroke={S.rule} strokeWidth="1" />
          <text x={L - 6} y={y(v) + 3} textAnchor="end" fill={S.ink3} style={{ ...MONO, fontSize: 9 }}>
            {v / 1000}k
          </text>
        </g>
      ))}
      <path d={band(zeros, cum1)} fill={S.night2} />
      <path d={band(cum1, cum2)} fill={S.accent} />
      <path d={band(cum2, cum3)} fill={S.brass} />
      <path d={cum3.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')} fill="none" stroke={S.onNight} strokeWidth="1" opacity="0.5" />
      {MONTHS.map((m, i) => (
        <text key={m} x={x(i)} y={H - 6} textAnchor={i === 0 ? 'start' : i === 11 ? 'end' : 'middle'} fill={S.ink3} style={{ ...MONO, fontSize: 9 }}>
          {m}
        </text>
      ))}
      <circle cx={x(11)} cy={y(cum3[11])} r="3.5" fill={S.surface} stroke={S.ink} strokeWidth="1.5" />
      <text x={x(11) - 8} y={y(cum3[11]) - 9} textAnchor="end" fill={S.ink} style={{ ...MONEY, fontSize: 11 }}>
        4,812
      </text>
      {[
        [cum1[11] / 2, '1,440 vendors & venues', S.onNight],
        [(cum1[11] + cum2[11]) / 2, '2,960 clients', S.onNight],
      ].map(([v, l, c]) => (
        <text key={l as string} x={x(11) - 10} y={y(v as number) + 4} textAnchor="end" fill={c as string} style={{ fontSize: 10.5, fontWeight: 600 }}>
          {l}
        </text>
      ))}
    </svg>
  )
}

function AdminOverview() {
  return (
    <AdminShell active={0} title="Overview" crumb="Sat 21 Nov 2026 · both markets">
      <div className="absolute inset-0 overflow-hidden" style={{ padding: 20 }}>
        {/* header band */}
        <div className="flex items-center justify-between" style={{ padding: '18px 22px', borderRadius: 14, background: `linear-gradient(120deg, ${S.night2}, ${S.night} 70%)`, color: S.onNight }}>
          <div>
            <div style={{ ...DISPLAY, fontSize: 26 }}>Good evening, Dave.</div>
            <div style={{ fontSize: 12.5, color: S.onNight2, marginTop: 6 }}>
              <span style={{ color: S.brass, fontWeight: 600 }}>23 cases</span> are waiting in verification. Requests are up 14% on last week.
            </div>
          </div>
          <div className="flex" style={{ gap: 28 }}>
            {[
              ['4,812', 'users', '+312 this month'],
              ['1,374', 'events', '218 upcoming'],
              ['2,891', 'requests', '1,106 this month'],
              ['71%', 'accept rate', 'median reply 3h'],
            ].map(([n, l, d]) => (
              <div key={l} className="flex flex-col items-start">
                <span style={{ ...NUM, fontSize: 34 }}>{n}</span>
                <span style={{ fontSize: 11, color: S.onNight, marginTop: 4, fontWeight: 600 }}>{l}</span>
                <span style={{ ...MONO, fontSize: 9.5, color: S.onNight2, marginTop: 1 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: 16, marginTop: 16 }}>
          {/* chart */}
          <div className="min-w-0" style={{ padding: '16px 18px 12px', borderRadius: 14, background: S.surface, boxShadow: CARD_SHADOW }}>
            <div className="flex flex-col" style={{ gap: 8 }}>
              <div className="min-w-0 whitespace-nowrap">
                <Kicker>Users by role · last 12 months</Kicker>
                <div className="truncate" style={{ fontSize: 13.5, fontWeight: 600, marginTop: 4 }}>4,812 accounts, 2,960 of them clients</div>
              </div>
              <div className="flex flex-wrap whitespace-nowrap" style={{ gap: '4px 14px' }}>
                {[
                  ['Clients', '2,960', S.accent],
                  ['Vendors & venues', '1,440', S.night2],
                  ['Planners', '412', S.brass],
                ].map(([l, n, c]) => (
                  <span key={l} className="inline-flex items-center" style={{ gap: 6, fontSize: 11 }}>
                    <span className="rounded-[2px]" style={{ width: 9, height: 9, background: c }} />
                    <span style={{ color: S.ink2 }}>{l}</span>
                    <span style={{ ...MONEY, fontSize: 11 }}>{n}</span>
                  </span>
                ))}
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <AreaChart />
            </div>
          </div>

          <div className="flex flex-col" style={{ gap: 16 }}>
            {/* markets */}
            <div style={{ padding: '16px 18px', borderRadius: 14, background: S.surface, boxShadow: CARD_SHADOW }}>
              <Kicker right={<span style={{ fontSize: 9.5 }}>by users</span>}>Markets</Kicker>
              {[
                ['United Kingdom', '2,744', 57, 'London 1,912 · Manchester 388'],
                ['Nigeria', '2,068', 43, 'Lagos 1,540 · Abuja 312'],
              ].map(([n, v, pct, d]) => (
                <div key={n as string} style={{ marginTop: 12 }}>
                  <div className="flex items-baseline justify-between">
                    <span style={{ fontSize: 12.5, fontWeight: 600 }}>{n}</span>
                    <span style={{ ...NUM, fontSize: 20 }}>{v}</span>
                  </div>
                  <div className="relative overflow-hidden rounded-full" style={{ height: 7, marginTop: 6, background: S.high }}>
                    <span className="absolute inset-y-0 left-0" style={{ width: `${pct}%`, background: S.accent }} />
                  </div>
                  <div className="flex justify-between" style={{ ...MONO, fontSize: 9.5, color: S.ink3, marginTop: 4 }}>
                    <span>{d}</span>
                    <span>{pct}%</span>
                  </div>
                </div>
              ))}
            </div>

            {/* queue preview */}
            <div className="min-h-0 flex-1" style={{ padding: '14px 18px 12px', borderRadius: 14, background: S.surface, boxShadow: CARD_SHADOW }}>
              <Kicker right={<span style={{ fontSize: 9.5, color: S.accentText, fontWeight: 600 }}>Open queue</span>}>Verification · 23 pending</Kicker>
              <div style={{ marginTop: 6 }}>
                {QUEUE.slice(0, 3).map((q) => (
                  <QueueRow key={q.name} q={{ ...q, on: false }} compact />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
