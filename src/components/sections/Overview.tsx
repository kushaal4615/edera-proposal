/* OVERVIEW · Archetype 10: single-column long-read with a pull quote and margin notes.
   Item 02 on the programme, "Welcome". The ballroom printed full-width as a tipped-in plate,
   then one reading column: the lead, the paragraphs, the pull quote on a card under the brass
   ornament with a vendor's availability strip drawn beneath it, and the programme's three notes
   set in the margin on wide screens, as a plain list below it on narrow ones. */
import { IMG, P } from '../../data/proposal'
import { Avail, Item, Ornament, Photo, type AvailState } from '../ui/bits'
import { Reveal } from '../ui/motion'

/** A caterer's fortnight as the marketplace prints it; the ring marks the event's date. */
const FORTNIGHT: AvailState[] = ['booked', 'free', 'free', 'held', 'free', 'booked', 'booked', 'free', 'free', 'free', 'held', 'free', 'booked', 'free']
const EVENT_DAY = 8

function Note({ n, i }: { n: string; i: number }) {
  const [head, rest] = n.split(/:\s*/)
  return (
    <li>
      <Reveal delay={0.08 * i} className="flex gap-4">
        <span className="struck shrink-0 text-[0.8rem] text-[var(--primary-ink)]">{String(i + 1).padStart(2, '0')}</span>
        <p className="text-[length:var(--fs-small)] leading-snug text-[var(--ink-2)]">
          <span className="display-wide block text-[0.78rem] text-[var(--ink)]">{head}</span>
          <span className="mt-1.5 block">{rest}</span>
        </p>
      </Reveal>
    </li>
  )
}

export function Overview() {
  return (
    <section id="overview" aria-labelledby="overview-title" className="section-y relative overflow-x-clip bg-[var(--ground-2)]">
      <div className="shell">
        <Item no="02" time="14:15" name="Welcome" id="overview-title" lines={['The whole industry,', <>in one <em>place</em>.</>]} />

        <Reveal className="mt-12">
          <figure className="relative">
            <Photo img={IMG.ballroom} eager className="aspect-[16/9] w-full sm:aspect-[21/9]" sizes="(min-width: 1408px) 1344px, 100vw" />
            <figcaption className="kicker mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[var(--ink-3)]">
              <span className="normal-case">{IMG.ballroom.alt}</span>
              <span className="ml-auto">{IMG.ballroom.credit}</span>
            </figcaption>
          </figure>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,66ch)_minmax(14rem,1fr)] lg:gap-20 lg:pl-[8%]">
          {/* the reading column */}
          <div className="min-w-0">
            <Reveal>
              <p className="text-[clamp(1.25rem,1.05rem+0.8vw,1.6rem)] font-medium leading-[1.4] text-[var(--ink)]">{P.overview.lead}</p>
            </Reveal>
            <p className="mt-8 text-[var(--ink-2)]">{P.overview.paragraphs[0]}</p>
            <p className="mt-6 text-[var(--ink-2)]">{P.overview.paragraphs[1]}</p>

            <Reveal delay={0.05} className="my-10 lg:-mr-12">
              <blockquote className="card px-6 py-8 sm:px-10 sm:py-10">
                <Ornament width={64} />
                <p className="display-italic mt-5 text-[clamp(1.5rem,1.1rem+1.6vw,2.4rem)] text-[var(--ink)]">{P.overview.pull}</p>
                {/* the product's signature, drawn beside the words: a vendor's calendar, read before you ask */}
                <figure className="mt-7 border-t border-[var(--rule-strong)] pt-5">
                  <Avail states={FORTNIGHT} ring={EVENT_DAY} height={10} />
                  <figcaption className="kicker mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[var(--ink-3)]">
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
                    <span className="normal-case sm:ml-auto">The ring is your date</span>
                  </figcaption>
                </figure>
              </blockquote>
            </Reveal>

            <p className="text-[var(--ink-2)]">{P.overview.paragraphs[2]}</p>
          </div>

          {/* the margin: what the programme notes about this build */}
          <aside className="min-w-0 lg:pt-3" aria-label="Margin notes">
            <ol className="flex flex-col gap-6 border-t-2 border-[var(--ink)] pt-6 lg:sticky lg:top-24 lg:border-t-0 lg:border-l lg:border-[var(--rule-strong)] lg:pl-6 lg:pt-0">
              {P.overview.notes.map((n, i) => (
                <Note key={n} n={n} i={i} />
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  )
}
