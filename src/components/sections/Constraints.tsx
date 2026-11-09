/* CONSTRAINTS · Archetype 02: editorial split. Item 03, "Order of the day". Giant display type
   on the left (the six constraints, the active one in ink, the rest receding), dense small text on
   the right on an offset baseline: the active constraint's body, the drawing the programme would
   make of it, and how it shapes the build. Two small prints of the launch markets under it. */
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { IMG, P } from '../../data/proposal'
import { useMedia } from '../../hooks/useMedia'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/format'
import { Avail, Item, Photo, Stamp, type AvailState } from '../ui/bits'
import { Draw, Reveal, SETTLE } from '../ui/motion'

const ROLES = ['Client', 'Planner', 'Vendor, venue', 'Super admin']
const LANGUAGES = ['English', 'Yorùbá', 'Igbo', 'Hausa', 'Pidgin']
const FORTNIGHT: AvailState[] = ['free', 'booked', 'free', 'free', 'held', 'free', 'booked', 'booked', 'free', 'free', 'free', 'held', 'free', 'booked']

function Chip({ children, on = false }: { children: string; on?: boolean }) {
  return (
    <span className={cn('kicker inline-flex min-h-7 items-center whitespace-nowrap rounded-[var(--r-card)] px-2.5 font-semibold', on ? 'bg-[var(--primary)] text-[var(--on-primary)]' : 'text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--rule-strong)]')}>{children}</span>
  )
}

/** Four roles, four lines drawn down to the one record they share. */
function OneRecord() {
  return (
    <div role="img" aria-label="Four roles, client, planner, vendor or venue and super admin, drawn down to one shared record">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-hidden>
        {ROLES.map((r) => (
          <span key={r} className="kicker flex min-h-8 min-w-0 items-center justify-center rounded-[var(--r-card)] px-1.5 py-1 text-center font-semibold leading-tight text-[var(--ink)] shadow-[inset_0_0_0_1px_var(--rule-strong)]">
            {r}
          </span>
        ))}
      </div>
      <svg aria-hidden viewBox="0 0 400 56" preserveAspectRatio="none" className="mt-1 hidden h-14 w-full text-[var(--primary)] sm:block">
        <Draw d="M50 2 C 50 30, 200 24, 200 54" />
        <Draw d="M150 2 C 150 30, 200 24, 200 54" delay={0.1} />
        <Draw d="M250 2 C 250 30, 200 24, 200 54" delay={0.2} />
        <Draw d="M350 2 C 350 30, 200 24, 200 54" delay={0.3} />
      </svg>
      <p className="kicker mt-2 flex items-center justify-center gap-3 text-[var(--ink)] sm:mt-0" aria-hidden>
        <span aria-hidden className="h-px w-6 bg-[var(--primary)]" />
        <span className="struck font-bold">One record</span>
        <span aria-hidden className="h-px w-6 bg-[var(--primary)]" />
      </p>
      <p className="mt-1 text-center text-[length:var(--fs-micro)] text-[var(--ink-3)]" aria-hidden>
        every booking, guest list and check-in, seen from four sides
      </p>
    </div>
  )
}

/** The planner carries the work; the client reads the summary. One arrow, drawn. */
function PlannerArrow() {
  return (
    <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3" role="img" aria-label="The planner executes the bookings and the client reads the summary">
      <div className="min-w-0" aria-hidden>
        <Chip on>Planner</Chip>
        <p className="mt-1.5 text-[length:var(--fs-micro)] leading-snug text-[var(--ink-2)]">executes the bookings</p>
      </div>
      <svg aria-hidden viewBox="0 0 120 24" preserveAspectRatio="none" className="h-6 w-full text-[var(--primary)]">
        <Draw d="M2 12 C 40 12, 80 12, 112 12" />
        <Draw d="M100 4 L 114 12 L 100 20" delay={0.6} />
      </svg>
      <div className="min-w-0 text-right" aria-hidden>
        <Chip>Client</Chip>
        <p className="mt-1.5 text-[length:var(--fs-micro)] leading-snug text-[var(--ink-2)]">reads the summary</p>
      </div>
    </div>
  )
}

/** The calendar, read before the request is sent. */
function Calendar() {
  return (
    <div>
      <Avail states={FORTNIGHT} ring={9} height={12} />
      <div className="kicker mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[var(--ink-3)]">
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-2 w-2 rounded-[1px] bg-[var(--avail-free)]" />
          Free
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-2 w-2 rounded-[1px] bg-[var(--avail-held)]" />
          Held
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden className="inline-block h-2 w-2 rounded-[1px] bg-[var(--avail-booked)]" />
          Booked
        </span>
        <span className="normal-case text-[var(--primary-ink)] sm:ml-auto">Request to book, only on a free day</span>
      </div>
    </div>
  )
}

/** English ships first; the local languages arrive as translation sets. */
function Languages() {
  return (
    <div role="img" aria-label="English first, then Yoruba, Igbo, Hausa and Pidgin as translation sets">
      <div className="flex flex-wrap gap-2" aria-hidden>
        {LANGUAGES.map((l, i) => (
          <Chip key={l} on={i === 0}>
            {l}
          </Chip>
        ))}
      </div>
      <p className="kicker mt-3 text-[var(--ink-3)]" aria-hidden>
        <span className="text-[var(--primary-ink)]">Ships first</span> · the rest are translation sets, not rebuilds
      </p>
    </div>
  )
}

/** The commission, foil-stamped and crossed out, with LATER pressed over it. */
function CommissionLater() {
  return (
    <div className="flex items-center gap-6" role="img" aria-label="Commission per booking, crossed out, stamped later; free at launch">
      <span className="relative inline-grid place-items-center" aria-hidden>
        <span className="display foil text-[4rem] leading-none sm:text-[4.75rem]">%</span>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full text-[var(--money)]">
          <Draw d="M8 92 L 92 8" strokeWidth={3} />
        </svg>
        <Stamp tone="money" rotate={-12} className="absolute -right-5 -top-2 bg-[var(--card)]">
          Later
        </Stamp>
      </span>
      <div className="min-w-0" aria-hidden>
        <p className="display-wide text-[0.78rem] text-[var(--ink)]">Commission per booking</p>
        <p className="mt-1 text-[length:var(--fs-small)] leading-snug text-[var(--ink-2)]">Free at launch. Built in, switched off, turned on from the super admin.</p>
      </div>
    </div>
  )
}

/** Two steps: the curated first circle, then self-serve for everyone after. */
function CuratedThenSelfServe() {
  const steps = [
    { no: '01', name: 'Curated', body: 'The platform owner onboards the first circle by hand' },
    { no: '02', name: 'Self-serve', body: 'Everyone who downloads the app afterwards' },
  ]
  return (
    <ol className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-3" aria-label="Two steps: curated, then self-serve">
      {steps.map((s, i) => (
        <li key={s.no} className={cn('min-w-0 border-t-2 pt-3', i === 0 ? 'border-[var(--primary)]' : 'border-[var(--ink)]', i === 1 && 'sm:col-start-3')}>
          <p className="flex items-baseline gap-3">
            <span className={cn('struck text-[0.8rem]', i === 0 ? 'text-[var(--primary-ink)]' : 'text-[var(--ink-3)]')}>{s.no}</span>
            <span className="display text-[1.5rem] text-[var(--ink)]">{s.name}</span>
          </p>
          <p className="mt-1 text-[length:var(--fs-small)] leading-snug text-[var(--ink-2)]">{s.body}</p>
        </li>
      ))}
      <li aria-hidden className="hidden self-center sm:col-start-2 sm:row-start-1 sm:block">
        <svg viewBox="0 0 48 24" className="mt-5 h-6 w-12 text-[var(--primary)]">
          <Draw d="M2 12 L 44 12" />
          <Draw d="M34 4 L 44 12 L 34 20" delay={0.5} />
        </svg>
      </li>
    </ol>
  )
}

function Drawing({ i }: { i: number }) {
  switch (i) {
    case 0:
      return <OneRecord />
    case 1:
      return <PlannerArrow />
    case 2:
      return <Calendar />
    case 3:
      return <Languages />
    case 4:
      return <CommissionLater />
    default:
      return <CuratedThenSelfServe />
  }
}

/** The active constraint: its body, the programme's drawing of it, how it shapes the build. */
function Detail({ active, reduced }: { active: number; reduced: boolean }) {
  const c = P.constraints[active]
  return (
    <div className="card px-5 py-6 sm:px-8 sm:py-8" aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={c.title}
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0, y: -6, transition: { duration: 0.14 } }}
          transition={{ duration: 0.34, ease: SETTLE }}
        >
          <p className="kicker flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--ink-3)]">
            <span className="font-bold text-[var(--ink)]">Constraint {String(active + 1).padStart(2, '0')}</span>
            <span aria-hidden className="h-3 w-px bg-current opacity-50" />
            <span>of {String(P.constraints.length).padStart(2, '0')}</span>
          </p>
          <p className="mt-3 text-[var(--ink)]">{c.body}</p>
          <div className="my-6 border-y border-[var(--rule-strong)] py-6">
            <Drawing i={active} />
          </div>
          <p className="display-wide text-[0.8rem] text-[var(--primary-ink)]">How it shapes the build</p>
          <p className="mt-2 text-[length:var(--fs-small)] leading-relaxed text-[var(--ink-2)]">{c.shapes}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/** Two small prints of the launch markets, tipped in under the detail. */
function Markets({ className = '' }: { className?: string }) {
  return (
    <Reveal className={className}>
      <div className="grid grid-cols-2 gap-4">
        <figure>
          <Photo img={IMG.london} className="aspect-[4/3] w-full" sizes="(min-width: 1024px) 280px, 45vw" />
          <figcaption className="kicker mt-2 text-[var(--ink-3)]">London</figcaption>
        </figure>
        <figure>
          <Photo img={IMG.lagos} className="aspect-[4/3] w-full" sizes="(min-width: 1024px) 280px, 45vw" />
          <figcaption className="kicker mt-2 text-[var(--ink-3)]">Lagos</figcaption>
        </figure>
      </div>
      <p className="kicker mt-3 text-[var(--ink-3)]">{P.client.markets}</p>
    </Reveal>
  )
}

export function Constraints() {
  const reduced = useReducedMotion()
  const lg = useMedia('(min-width: 1024px)')
  const [active, setActive] = useState(0)

  return (
    <section id="constraints" aria-labelledby="constraints-title" className="section-y relative overflow-x-clip">
      <div className="shell">
        <Item no="03" time="14:30" name="Order of the day" id="constraints-title" lines={['Six things the call', 'decided for us.']} />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* left: the six constraints as giant display type */}
          <ol className="min-w-0 lg:col-span-7" aria-label="Constraints">
            {P.constraints.map((k, i) => {
              const on = i === active
              return (
                <li key={k.title} className="border-b border-[var(--rule-strong)] first:border-t-2 first:border-t-[var(--ink)]">
                  <button
                    type="button"
                    aria-pressed={on}
                    data-intent="flip_constraint"
                    data-value={k.title}
                    onClick={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex w-full items-baseline gap-4 py-4 text-left sm:gap-6 sm:py-5"
                  >
                    <span className={cn('struck shrink-0 text-[0.8rem] transition-colors', on ? 'text-[var(--primary-ink)]' : 'text-[var(--ink-3)]')}>{String(i + 1).padStart(2, '0')}</span>
                    <span className={cn('display min-w-0 flex-1 transition-[color,transform] duration-300 ease-[var(--ease-turn)] group-hover:translate-x-1', on ? 'text-[var(--ink)]' : 'text-[var(--ink-3)]')} style={{ fontSize: 'clamp(1.75rem, 0.9rem + 3.2vw, 3.75rem)' }}>
                      {k.title}
                    </span>
                    <span aria-hidden className={cn('mt-2 hidden h-2 w-2 shrink-0 rounded-[1px] bg-[var(--primary)] transition-opacity sm:block', on ? 'opacity-100' : 'opacity-0')} />
                  </button>
                  {/* below lg the detail prints inline under the active title, never in a column out of view */}
                  <AnimatePresence initial={false}>
                    {!lg && on && (
                      <motion.div
                        key="detail"
                        className="overflow-hidden"
                        initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                        animate={reduced ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                        exit={reduced ? { opacity: 0, transition: { duration: 0.15 } } : { height: 0, opacity: 0, transition: { duration: 0.14 } }}
                        transition={{ duration: 0.3, ease: SETTLE }}
                      >
                        <div className="pb-6">
                          <Detail active={active} reduced={reduced} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              )
            })}
          </ol>

          {/* right: dense text on an offset baseline, then the two market prints */}
          <div className="hidden min-w-0 lg:col-span-5 lg:block lg:pt-24">
            <Detail active={active} reduced={reduced} />
            {lg && <Markets className="mt-10" />}
          </div>
        </div>

        {!lg && <Markets className="mt-12" />}
      </div>
    </section>
  )
}
