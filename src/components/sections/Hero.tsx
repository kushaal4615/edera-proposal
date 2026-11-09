/* HERO · Archetype 01: full-bleed cinematic hero, the product object breaking the grid.
   The toast photographed full-bleed behind, the programme's cover laid over it as a card: the
   programme number and the date, the item's kicker, the ruby "Proposal for Dave" stamp, the
   three-line headline, the promise and the brass ornament. The client's phone breaks out of the
   card's right edge over the photograph; the three cover numbers are foil-stamped in flow below. */
import { motion } from 'framer-motion'
import { useState } from 'react'
import { IMG, P, PROGRAMME, type Screen } from '../../data/proposal'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { cn } from '../../lib/format'
import { EderaMark, Ornament, Photo, Stamp, Time } from '../ui/bits'
import { LineMask, Magnetic, RollingNumber, SETTLE } from '../ui/motion'
import { ProductMock } from '../ui/ProductMock'

const SCREENS: { id: Screen; label: string }[] = [
  { id: 'clientHome', label: 'Client' },
  { id: 'explore', label: 'Marketplace' },
  { id: 'vendorProfile', label: 'Vendor' },
  { id: 'checkin', label: 'Check-in' },
]

/** The headline's lines, the last word of the last line set in brass italic. */
function headline(lines: readonly string[]) {
  return lines.map((l, i) => {
    if (i < lines.length - 1) return l
    const words = l.split(' ')
    const last = words.pop()
    return (
      <>
        {words.length ? words.join(' ') + ' ' : ''}
        <em>{last}</em>
      </>
    )
  })
}

export function Hero() {
  const reduced = useReducedMotion()
  const [screen, setScreen] = useState<Screen>('clientHome')
  const rise = (delay: number) => ({
    initial: reduced ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: SETTLE, delay: reduced ? 0 : delay },
  })

  return (
    <section id="top" aria-labelledby="hero-title" className="relative isolate flex min-h-[100dvh] flex-col justify-end overflow-x-clip pt-14">
      {/* the toast, printed full-bleed; every text node sits on card stock or on the ground, never on the photograph */}
      <motion.div aria-hidden className="absolute inset-0 -z-10" initial={reduced ? false : { opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.3, ease: SETTLE }}>
        <Photo img={IMG.toast} eager plain className="absolute inset-0 h-full w-full" sizes="100vw" />
        {/* a measured scrim: night evergreen settling at the top, the card stock rising from the ground */}
        <span className="absolute inset-0" style={{ background: 'linear-gradient(180deg, color-mix(in srgb, var(--ever-950) 62%, transparent), color-mix(in srgb, var(--ever-950) 22%, transparent) 45%, transparent 75%)' }} />
        <span className="absolute inset-0" style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--ground) 55%, transparent) 0%, color-mix(in srgb, var(--ground) 20%, transparent) 40%, transparent 70%)' }} />
        <span className="absolute inset-x-0 bottom-0 h-[46%]" style={{ background: 'linear-gradient(180deg, transparent, var(--ground) 58%)' }} />
      </motion.div>

      <div className="shell relative pb-10 pt-8 sm:pt-12 lg:pb-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-0">
          {/* the programme's cover */}
          <motion.div
            className="card relative min-w-0 lg:col-span-8 lg:col-start-1 lg:row-start-1"
            initial={reduced ? false : { opacity: 0, y: 40, rotate: -0.5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            transition={{ duration: 0.9, ease: SETTLE, delay: reduced ? 0 : 0.15 }}
          >
            <div className="px-5 pb-8 pt-7 sm:px-9 sm:pb-10 sm:pt-9 lg:pr-[21%]">
              <motion.p className="kicker flex flex-wrap items-center gap-x-3 gap-y-2 border-b-2 border-[var(--ink)] pb-3 text-[var(--ink)]" {...rise(0.3)}>
                <span className="font-bold">Order of Programme</span>
                <span aria-hidden className="h-3 w-px bg-current opacity-50" />
                <span>{P.client.programmeNo}</span>
                <span className="hidden sm:inline">{P.client.date}</span>
                <Time time={PROGRAMME.doors} size="sm" label="Doors" play={false} className="ml-auto" />
              </motion.p>

              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-3">
                <motion.span className="kicker inline-flex items-center gap-2 text-[var(--primary-ink)]" {...rise(0.4)}>
                  <EderaMark size={18} />
                  {P.project.title}
                </motion.span>
                <motion.span {...rise(0.45)}>
                  <Stamp tone="verified" rotate={-4} play={!reduced}>
                    Proposal for {P.client.contact}
                  </Stamp>
                </motion.span>
              </div>

              <LineMask as="h1" id="hero-title" lines={headline(P.project.oneLine)} className="mt-5 text-[var(--ink)]" style={{ fontSize: 'var(--fs-hero)' }} delay={reduced ? 0 : 0.5} />

              <motion.p className="mt-6 max-w-[54ch] text-[var(--ink-2)]" {...rise(0.85)}>
                {P.project.promise}
              </motion.p>

              <motion.div className="mt-7 flex items-center gap-4" {...rise(0.95)}>
                <Ornament width={64} />
                <span className="kicker text-[var(--ink-3)]">{P.client.markets}</span>
              </motion.div>
            </div>
          </motion.div>

          {/* the client's phone, breaking out of the cover's right edge over the photograph */}
          <motion.div
            className="relative z-10 flex min-w-0 flex-col items-center gap-5 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:-mb-6 lg:items-start lg:justify-end lg:pl-4"
            initial={reduced ? false : { opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 160, damping: 22, delay: reduced ? 0 : 0.9 }}
          >
            <ProductMock screen={screen} tilt="pointer" size="lg" />
            <div role="group" aria-label="Screens of the product" className="card-plain grid max-w-full grid-cols-2 gap-1 p-1.5 xl:flex xl:items-center">
              {SCREENS.map((s) => {
                const on = s.id === screen
                return (
                  <Magnetic key={s.id} strength={0.16} className="min-w-0">
                    <motion.button
                      type="button"
                      aria-pressed={on}
                      data-intent="hero_screen"
                      data-value={s.id}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setScreen(s.id)}
                      className={cn('kicker relative min-h-10 w-full rounded-[var(--r-card)] px-3.5 font-semibold transition-colors duration-150 xl:w-auto', on ? 'text-[var(--on-primary)]' : 'text-[var(--ink)] hover:bg-[var(--primary-soft)]')}
                    >
                      {on && <motion.span layoutId="hero-screen-pill" aria-hidden className="absolute inset-0 rounded-[var(--r-card)] bg-[var(--primary)]" transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 32 }} />}
                      <span className="relative">{s.label}</span>
                    </motion.button>
                  </Magnetic>
                )
              })}
            </div>
          </motion.div>
        </div>

        {/* the three cover numbers, foil-stamped, in flow below everything */}
        <motion.dl className="mt-10 grid grid-cols-1 gap-x-8 gap-y-7 border-t-2 border-[var(--ink)] pt-6 sm:grid-cols-3 lg:mt-14" {...rise(1.05)}>
          {P.heroFacts.map((f, i) => (
            <div key={f.label} className={cn('min-w-0', i > 0 && 'sm:border-l sm:border-[var(--rule-strong)] sm:pl-8')}>
              <dt className="kicker text-[var(--ink-3)]">{f.label}</dt>
              <dd className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <RollingNumber value={f.value} className="hero-fact display foil leading-none" />
                <span className="display-wide text-[0.95rem] text-[var(--primary-ink)]">{f.unit}</span>
              </dd>
              <dd className="mt-1.5 text-[length:var(--fs-small)] text-[var(--ink-2)]">{f.note}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
      {/* the digit wheels are transformed, so each wheel face takes the foil itself: a clipped background on the parent would not follow them */}
      <style>{`#top .hero-fact { font-size: var(--fs-fact); }
#top .hero-fact [data-figure] > span > span > span { background-image: linear-gradient(112deg, var(--foil-c) 0%, var(--foil-a) 38%, var(--foil-b) 58%, var(--foil-c) 100%); -webkit-background-clip: text; background-clip: text; color: transparent; -webkit-text-fill-color: transparent; }`}</style>
    </section>
  )
}
