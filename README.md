# Edera proposal site

A one-page React proposal for Dave (Edera): an event marketplace and management platform connecting clients, event planners, vendors and venue owners in the UK and Nigeria. iOS and Android apps, a web app and a super admin panel, with availability calendars, bookings, guest lists and QR check-in. Built from the issued proposal document and the discovery call of 9 November 2026.

## The world
The page is the **Order of Programme**: the printed programme booklet handed to every guest at a celebration. Every section is an item printed with the time it happens, from doors at 14:00 to the RSVP at 23:00. The one card family is card stock with a double brass rule; display numerals and amounts are foil-stamped; anything included or confirmed carries a ruby wax seal; the availability strip from the product itself appears as the illustration. The close is the reply card, sealed "Accepted" and sent.

Palette: card cream ground, Edera's evergreen ink (the brand at useedera.com), evergreen for rules and active states, brass foil for the one action and every amount, ruby for the seal only. Type: Bodoni Moda / Instrument Sans / Azeret Mono.

## Commercials
`src/data/proposal.ts` → `COMMERCIALS`. `totalCost` 7000, `timelineMonths` 3, eight milestones at 10/10/15/15/15/15/10/10 percent; every amount on the page derives from these. Support terms follow the house rule: twelve months of free bug fixes, then completely optional ($500 a month for up to 15 hours, $30 an hour beyond, opt-in).

## Run
```
npm install
npm run dev          # http://localhost:5292
npm run build
node scripts/audit.mjs      # template detector, contrast, overflow, overlap, scrub, images, vendor names
node scripts/interact.mjs   # clicks every surface
node scripts/shoot.mjs      # screenshots at 320/375/768/1024/1440, both themes
```
`?mock=1` previews every ProductMock screen. `?theme=dark|light` forces a theme.

## Imagery
Bundled under `src/assets/img` with licences in `LICENSES.md`: Unsplash photographs of receptions, venues, a DJ, a buffet, a cake, drapes, a QR code, Lagos and London, and three stock portraits standing in for the personas, all ≤ 300 KB.

## Visitor logging
`src/tracker/tracker.js` posts page views, section views and actions to the Google Apps Script deployed from `apps-script/edera-logger.gs` (sheet "logs", tab "proposal logs"; the same script also serves the clickable prototype's "prototype logs" tab). Localhost and automated browsers never write. The secret is visible in the client bundle: a speed bump, not security, acceptable for a throwaway client demo only. Logging a client's behaviour is something you may want to disclose to them.
