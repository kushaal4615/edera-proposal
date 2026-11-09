// Clicks every interactive surface and asserts state changes. COMMERCIALS.show is true: the milestone cards carry their amounts.
//   BASE=http://localhost:5292 node scripts/interact.mjs
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PW || 'playwright')
const BASE = process.env.BASE || 'http://localhost:5292'
const MESSAGE = 'Hi, I’ve read through the Edera proposal. $7,000 over 3 months in eight milestones works for me. Let’s set the start date in December.'
const fails = []
const ok = (cond, m) => (cond ? console.log(`ok   ${m}`) : (fails.push(m), console.log(`FAIL ${m}`)))
const intent = (p, scope, name, value) => p.locator(`${scope} [data-intent="${name}"]${value ? `[data-value^="${value}"]` : ''}:visible`)

const b = await chromium.launch()
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', permissions: ['clipboard-read', 'clipboard-write'] })
const p = await ctx.newPage()
const errs = []
p.on('pageerror', (e) => errs.push(e.message))
await p.goto(BASE, { waitUntil: 'networkidle' })

// hero: screen buttons swap the device
await intent(p, '#top', 'hero_screen').nth(1).click()
await p.waitForTimeout(400)
ok((await intent(p, '#top', 'hero_screen').nth(1).getAttribute('aria-pressed')) === 'true', 'hero screen button selects the second screen')

// constraints: a title activates its detail
await p.locator('#constraints [data-intent="flip_constraint"]:visible').nth(2).click()
await p.waitForTimeout(400)
ok((await p.locator('#constraints [data-intent="flip_constraint"][aria-pressed="true"]:visible').count()) >= 1, 'a constraint activates')
ok((await p.locator('#constraints', { hasText: /first-class data|filter by date/ }).count()) > 0, 'the calendar constraint shows how it shapes the build')

// flow: a step becomes current
await p.locator('#flow [data-intent="flow_step"][data-value*="execution"]:visible').first().click()
await p.waitForTimeout(900)
{
  const cur = await p.locator('#flow [aria-current="step"]').allTextContents()
  ok(cur.length >= 1 && cur.every((t) => /logistics|execution|QR|check/i.test(t)), 'flow step 5 (logistics and execution) becomes current')
}

// roles: tabs swap the feature index; arrow keys move between tabs
await p.click('#role-tab-vendor')
await p.waitForTimeout(500)
ok((await p.textContent('#role-panel')).includes('Calendar management'), 'vendor tab shows calendar management')
await p.keyboard.press('ArrowLeft')
await p.waitForTimeout(500)
ok((await p.textContent('#role-panel')).includes('Marketplace search'), 'arrow key moves back to the planner tab')
await p.click('#role-tab-client')
await p.waitForTimeout(400)
await p.locator('#roles button', { hasText: /^commission phase$/ }).first().focus()
ok((await p.locator('[role="tooltip"]').count()) === 1, 'commission phase tooltip opens on keyboard focus')

// architecture: selecting the bottom layer opens its detail
await p.locator('#architecture button[aria-pressed][data-value^="L1"]:not([aria-hidden="true"]):visible').first().click()
await p.waitForTimeout(500)
ok(/S3|hosting/i.test(await p.textContent('#arch-detail')), 'architecture L1 detail opens (hosting and storage)')

// milestones: a card opens its dialog with scope, deliverable and the amount for that item
await intent(p, '#milestones', 'open_milestone', 'M03').first().click()
await p.waitForTimeout(500)
const sheet = p.locator('[role="dialog"]')
ok((await sheet.count()) === 1 && /navigable and responsive/.test(await sheet.textContent()), 'milestone 03 dialog shows its deliverable')
ok(/\$1,050/.test(await sheet.textContent()) && /\$2,450 of \$7,000/.test(await sheet.textContent()), 'milestone 03 dialog shows $1,050 and the running total')
await p.keyboard.press('Escape')
await p.waitForTimeout(1200)
ok((await p.locator('[role="dialog"]').count()) === 0, 'Esc closes the milestone dialog')
ok((await p.locator('#pay-chart').count()) === 1, 'the payment schedule chart is present')

// FAQ: one open at a time
await p.locator('#terms h3 button').nth(2).click()
ok((await p.locator('#terms h3 [aria-expanded="true"]').count()) === 1, 'FAQ keeps one item open')

// close: the RSVP copies the start message and seals the card
await intent(p, '#start', 'rsvp').first().click()
await p.waitForTimeout(2600)
ok((await p.evaluate(() => navigator.clipboard.readText())) === MESSAGE, 'RSVP copies the start message')
ok((await p.locator('#start', { hasText: /accepted/i }).count()) > 0, 'the reply card is sealed accepted')
ok((await p.locator('#start', { hasText: /Testing and deployment/ }).count()) > 0, 'the reply card carries the last item')

// theme toggle
const before = await p.evaluate(() => document.documentElement.dataset.theme)
await p.locator('[data-intent="toggle_theme"]').click()
ok((await p.evaluate(() => document.documentElement.dataset.theme)) !== before, 'theme toggles')

// nav overlay opens and lists every section
await p.locator('[data-intent="open_menu"]').click()
await p.waitForTimeout(400)
ok((await p.locator('#nav-overlay a').count()) >= 12, 'menu overlay lists all twelve sections')
await p.keyboard.press('Escape')

ok(errs.length === 0, `no page errors (${errs.join(' | ').slice(0, 80)})`)

// marquee: a click on a mark inside the loop copy opens the site in a new tab (motion on)
const ctx2 = await b.newContext({ viewport: { width: 1440, height: 900 } })
const p2 = await ctx2.newPage()
await p2.goto(BASE, { waitUntil: 'networkidle' })
await p2.locator('#clients').scrollIntoViewIfNeeded()
const copyLink = p2.locator('#clients [aria-hidden="true"] a').first()
ok((await copyLink.getAttribute('tabindex')) === '-1', 'marquee copy links leave the tab order')
const [popup] = await Promise.all([ctx2.waitForEvent('page'), copyLink.click({ force: true })])
ok(/clientify/.test(popup.url()), `marquee copy link opens ${popup.url().slice(0, 40)}`)

await b.close()
if (fails.length) {
  console.log(`\nINTERACT FAILED: ${fails.length}`)
  process.exit(1)
}
console.log('\nINTERACT PASSED')
