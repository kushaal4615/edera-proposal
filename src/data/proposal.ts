/**
 * Every word and figure on the page. Sections only render this file.
 * Source: the issued Edera proposal document (project overview, core platform flow, roles, feature
 * list, data ingestion, integrations, monetisation, future features, technology stack, milestones,
 * deliverables, support terms, why us, clients, FAQs, to start) and the discovery call of 9 November
 * 2026 with Dave. Nothing here is invented about the client.
 *
 * COMMERCIALS is the single knob for price and schedule: every amount derives from TOTAL_COST and
 * the milestone percentages; the timeline label derives from TIMELINE_MONTHS.
 */

import toastImg from '../assets/img/toast.jpg'
import ballroomImg from '../assets/img/ballroom.jpg'
import djImg from '../assets/img/dj.jpg'
import buffetImg from '../assets/img/buffet.jpg'
import cakeImg from '../assets/img/cake.jpg'
import drapesImg from '../assets/img/drapes.jpg'
import qrImg from '../assets/img/qr.jpg'
import lagosImg from '../assets/img/lagos.jpg'
import londonImg from '../assets/img/london.jpg'
import confettiKissImg from '../assets/img/confettiKiss.jpg'
import balloonsImg from '../assets/img/balloons.jpg'
import tipiImg from '../assets/img/tipi.jpg'
import tableGreeneryImg from '../assets/img/tableGreenery.jpg'
import glasshouseImg from '../assets/img/glasshouse.jpg'
import birthdayImg from '../assets/img/birthday.jpg'
import adaezeImg from '../assets/img/adaeze.jpg'
import tundeImg from '../assets/img/tunde.jpg'
import bolaImg from '../assets/img/bola.jpg'

/* ------------------------------------------------------------------ commercial knob */

export const COMMERCIALS = {
  /** false: no cost, no timeline, no percentages anywhere on the page */
  show: true,
  totalCost: 7000,
  /** three months from the kick-start payment to the store submissions */
  timelineMonths: { min: 3, max: 3 },
  currency: 'USD',
} as const

export const TOTAL_COST = COMMERCIALS.totalCost
export const TIMELINE_MONTHS = COMMERCIALS.timelineMonths
export const CURRENCY = COMMERCIALS.currency
export const timelineLabel: string = COMMERCIALS.show
  ? (TIMELINE_MONTHS.min as number) === (TIMELINE_MONTHS.max as number)
    ? `${TIMELINE_MONTHS.min} months`
    : `${TIMELINE_MONTHS.min}–${TIMELINE_MONTHS.max} months`
  : 'Schedule on the call'

/* ------------------------------------------------------------------ imagery */

export interface Img {
  src: string
  alt: string
  w: number
  h: number
  credit: string
}

const UN = 'Unsplash License'
export const IMG = {
  toast: { src: toastImg, alt: 'Guests raising champagne glasses under string lights at a reception', w: 1400, h: 933, credit: UN },
  ballroom: { src: ballroomImg, alt: 'A banquet hall laid with round tables under chandeliers', w: 1400, h: 904, credit: UN },
  dj: { src: djImg, alt: 'A DJ at the decks with a crowd and a mirror ball behind', w: 1400, h: 933, credit: UN },
  buffet: { src: buffetImg, alt: 'Buffet chafing dishes of rice and sides', w: 1400, h: 933, credit: UN },
  cake: { src: cakeImg, alt: 'A white tiered cake dressed with roses', w: 1400, h: 2100, credit: UN },
  drapes: { src: drapesImg, alt: 'A barn hall dressed in white drapes and warm bulbs', w: 1400, h: 932, credit: UN },
  qr: { src: qrImg, alt: 'A hand holding a phone that shows a QR code', w: 1400, h: 933, credit: UN },
  lagos: { src: lagosImg, alt: 'The Lagos waterfront from the air', w: 1400, h: 787, credit: UN },
  london: { src: londonImg, alt: 'The Thames and Tower Bridge from the air', w: 1400, h: 933, credit: UN },
  confettiKiss: { src: confettiKissImg, alt: 'A bride and groom kissing while bridesmaids throw confetti', w: 1100, h: 1650, credit: UN },
  balloons: { src: balloonsImg, alt: 'A couple under a cloud of balloons with their guests behind them', w: 1400, h: 935, credit: UN },
  tipi: { src: tipiImg, alt: 'Guests dancing inside a tipi marquee hung with bunting', w: 1400, h: 933, credit: UN },
  tableGreenery: { src: tableGreeneryImg, alt: 'A table setting with greenery and candles', w: 1400, h: 933, credit: UN },
  glasshouse: { src: glasshouseImg, alt: 'A glasshouse venue with tables under hanging greenery', w: 1400, h: 933, credit: UN },
  birthday: { src: birthdayImg, alt: 'A birthday cake with lit letter candles', w: 1400, h: 842, credit: UN },
  adaeze: { src: adaezeImg, alt: 'Portrait of a woman in a white collar and patterned top', w: 1400, h: 2100, credit: UN },
  tunde: { src: tundeImg, alt: 'Portrait of a man in a maroon sweater and glasses', w: 1400, h: 2114, credit: UN },
  bola: { src: bolaImg, alt: 'Portrait of a smiling woman in a headwrap', w: 1400, h: 2100, credit: UN },
} satisfies Record<string, Img>

/* ------------------------------------------------------------------ types */

/**
 * The screens the in-code product mock can show. Client, planner and vendor screens render in a
 * phone; the super admin renders in a laptop.
 */
export type Screen =
  | 'clientHome'
  | 'explore'
  | 'vendorProfile'
  | 'plannerBoard'
  | 'guests'
  | 'checkin'
  | 'vendorRequest'
  | 'vendorCalendar'
  | 'adminVerification'
  | 'adminOverview'

export const PHONE_SCREENS: Screen[] = ['clientHome', 'explore', 'vendorProfile', 'plannerBoard', 'guests', 'checkin', 'vendorRequest', 'vendorCalendar']
export const TABLET_SCREENS: Screen[] = []
export const WEB_SCREENS: Screen[] = ['adminVerification', 'adminOverview']

export type Who = 'Client' | 'Planner' | 'Vendor' | 'Admin' | 'System'

export interface FlowStep {
  id: string
  title: string
  who: Who
  body: string
  screen: Screen
  /** the time this item is printed at on the programme */
  time: string
}

export interface Feature {
  title: string
  detail: string
  tip?: { term: string; text: string }
}

export interface Role {
  id: 'client' | 'planner' | 'vendor' | 'admin'
  name: string
  device: string
  line: string
  screen: Screen
  img: Img
  features: Feature[]
}

export interface Interaction {
  name: string
  chain: string[]
}

export interface Layer {
  id: string
  code: string
  name: string
  tech: { name: string; icon: string }[]
  detail: string
  carries: string[]
}

export type Phase = 'define' | 'build' | 'release'

export interface Milestone {
  id: string
  name: string
  heading: string
  /** share of the total; amounts derive from it */
  pct: number
  phase: Phase
  body: string
  deliverable: string
  /** when the amount for this item is paid */
  pay: string
  /** the time this item is printed at on the programme */
  time: string
}

export interface SupportLine {
  item: string
  detail: string
  figure: string
  status: 'INCLUDED' | 'OPT-IN' | 'FIXED'
}

export interface ClientMark {
  name: string
  url: string
  /** the typeset treatment of the mark: never an image */
  set: 'heavy' | 'wide' | 'stack' | 'italic' | 'light' | 'mono'
}

export interface Proposal {
  client: { contact: string; product: string; markets: string; programmeNo: string; date: string; eventName: string; eventDate: string }
  project: { name: string; title: string; oneLine: string[]; promise: string }
  heroFacts: { label: string; value: number; unit: string; note: string }[]
  overview: { lead: string; paragraphs: string[]; pull: string; notes: string[] }
  constraints: { title: string; body: string; shapes: string }[]
  flow: FlowStep[]
  interactions: Interaction[]
  roles: Role[]
  featureList: { title: string; body: string }[]
  ingestion: { title: string; body: string }[]
  layers: Layer[]
  integrations: { name: string; status: 'IN SCOPE' | 'LATER PHASE'; body: string }[]
  milestones: Milestone[]
  milestoneNote: string
  howItWorks: { title: string; body: string }[]
  support: SupportLine[]
  deliverables: { title: string; body: string; screen?: Screen }[]
  monetisation: { title: string; body: string }
  future: { title: string; body: string }[]
  clients: ClientMark[]
  whyUs: { title: string; body: string }[]
  faq: { q: string; a: string }[]
  startNeeds: { title: string; body: string }[]
  cta: { line: string; action: string; message: string; done: string }
}

/* ------------------------------------------------------------------ content */

export const P: Proposal = {
  client: {
    contact: 'Dave',
    product: 'Edera',
    markets: 'United Kingdom · Nigeria',
    programmeNo: 'No. 2026-1109',
    date: '9 November 2026',
    eventName: 'The making of Edera',
    eventDate: 'Three months from the kick-start',
  },
  project: {
    name: 'Edera',
    title: 'Event marketplace and management platform',
    oneLine: ['One place', 'for every', 'event.'],
    promise:
      'Edera bridges the communication and operational gap between event hosts, event planners, vendors and venue owners. It replaces scattered coordination over WhatsApp messages, PDF sharing and Instagram searches with one platform: search and discovery, availability tracking, secure booking and on-site logistics, for the UK and Nigeria first.',
  },
  heroFacts: [
    { label: 'Roles on the platform', value: 4, unit: 'roles', note: 'client, planner, vendor or venue, super admin' },
    { label: 'Launch markets', value: 2, unit: 'markets', note: 'the United Kingdom and Nigeria' },
    { label: 'Items on the programme', value: 8, unit: 'milestones', note: 'each reviewed before the next begins' },
  ],
  overview: {
    lead:
      'Edera is a comprehensive event marketplace designed to bridge the communication and operational gap between event hosts (clients), event planners, vendors like DJs, bakers and caterers, and venue owners. Today the work is held together by WhatsApp groups, PDFs of the vision passed from hand to hand, and searches on Instagram and Google for a baker or a caterer somebody once recommended.',
    paragraphs: [
      'The platform puts the whole industry in one place. Vendors and venues create profiles, verify their credentials and publish their services and their calendar. A client signs up, outlines the event and can hand the logistics to an event planner. The planner, or the client, browses the marketplace, reads the vendor’s calendar to see which days are free and which are booked, and sends booking requests to the providers they want.',
      'Vendors accept the requests. The planner manages the digital guest list and sends out QR code invitations, and on the day the planner or the vendor opens the scanner in the mobile app and checks guests in as they arrive. The client watches all of it from their own dashboard: a summary of what has been done, without having to do it.',
      'Targeting the UK and Nigeria initially, Edera offers robust search and discovery, availability tracking, secure booking and integrated on-site logistics to streamline the entire event lifecycle. It launches free of charge to build a user base; the commission model switches on later, once the community is established.',
    ],
    pull: 'When you need a DJ, there is one place to go. You see how long they have been in operation, what other people said about them, and whether your date is free, before you send a single message.',
    notes: ['Replaces: WhatsApp coordination, PDF sharing, Instagram and Google searches for vendors.', 'Keeps: your existing prototype as the reference for the flows and the brand.', 'Produces: four apps that share one record of every event, booking, guest and check-in.'],
  },
  constraints: [
    {
      title: 'Four kinds of user, one record',
      body: 'Clients, event planners, vendors (DJs, bakers, caterers), venue owners and the platform owner each need their own dashboard, but every booking, guest list and check-in must be the same record seen from four sides.',
      shapes: 'Four role-scoped apps on one backend with role-based permissions. A request a planner sends appears in the vendor’s inbox; the vendor’s acceptance updates the planner’s board and the client’s summary at the same moment.',
    },
    {
      title: 'The planner does the heavy lifting',
      body: 'The client initiates the event and delegates the operational flow to the planner. The planner executes the bookings; the client’s dashboard updates with a summary of completed actions.',
      shapes: 'The planner app carries the marketplace search, the booking requests, the timelines, the guest list and the scanner. The client app is deliberately lighter: a summary, the ability to assign and delegate, and the bookings as they happen.',
    },
    {
      title: 'See the calendar before you ask',
      body: 'A vendor’s profile must show how long they have been in operation, their reviews, and a live calendar of free and booked dates, so a planner can decide without unnecessary communication.',
      shapes: 'Dynamic availability calendars are first-class data: every vendor and venue publishes free and booked days, every search can filter by date, and a request is only sent against a day the calendar shows as free.',
    },
    {
      title: 'The UK and Nigeria, in local languages',
      body: 'The first markets are the United Kingdom and Nigeria. People should be able to relate to the platform in their own language.',
      shapes: 'Multilingual support is built into the frontend from the first milestone: every string lives in a language file, English ships first, and the local languages for the UK and Nigerian markets are added as translation sets, not rebuilds.',
    },
    {
      title: 'Free at launch, commission later',
      body: 'The platform launches completely free of charge to build a user base, encourage habitual use and generate engagement. Once enough successful transactions have gone through, potentially one to three years down the line, a commission-based system is activated.',
      shapes: 'The secure payment gateway is built with the commission structure in mind and kept switched off at launch. Turning it on is a configuration in the super admin, not a new project.',
    },
    {
      title: 'A hybrid start to the data',
      body: 'Initially the platform owner manually onboards a small, curated batch of vendors, venues and users to test the app and gather feedback. After that testing phase the platform becomes fully self-serve.',
      shapes: 'The super admin can create and verify vendor and venue profiles directly for the first circle; the same self-serve onboarding flow is live from day one for everyone who downloads the app afterwards.',
    },
  ],
  flow: [
    {
      id: 'onboarding',
      title: 'Onboarding and setup',
      who: 'Vendor',
      body: 'Vendors and venues create profiles, verify their credentials, and publish their services and their calendar availability.',
      screen: 'vendorCalendar',
      time: '14:00',
    },
    {
      id: 'delegation',
      title: 'Discovery and delegation',
      who: 'Client',
      body: 'Clients sign up, outline their event requirements, and can assign an event planner to handle the logistics.',
      screen: 'clientHome',
      time: '14:30',
    },
    {
      id: 'booking',
      title: 'Search and booking',
      who: 'Planner',
      body: 'Planners or clients browse the marketplace, view vendor calendars, and send booking requests to the service providers they want.',
      screen: 'explore',
      time: '15:00',
    },
    {
      id: 'transaction',
      title: 'Transaction',
      who: 'Vendor',
      body: 'Vendors accept the requests. The payment gateway is in place for the client to pay through a secure gateway, and stays switched off until the commission phase.',
      screen: 'vendorRequest',
      time: '16:00',
    },
    {
      id: 'execution',
      title: 'Logistics and execution',
      who: 'Planner',
      body: 'Planners manage digital guest lists and send out QR code invites. On the event day, planners or vendors use the mobile app scanner for seamless guest check-ins.',
      screen: 'checkin',
      time: '18:30',
    },
  ],
  interactions: [
    { name: 'Client to Planner', chain: ['The client initiates the event', 'Delegates the operational flow to the planner', 'The dashboard shows a summary of completed actions'] },
    { name: 'Planner or Client to Vendor', chain: ['Reads the vendor’s live calendar', 'Sends a request for a free date', 'The vendor is notified and accepts'] },
    { name: 'Planner to Guest', chain: ['Inputs the guest list', 'QR codes are generated and distributed', 'The scanner marks each guest as arrived'] },
  ],
  roles: [
    {
      id: 'client',
      name: 'Client / Event host',
      device: 'Mobile app and web',
      line: 'A summary of the event’s progress, and a planner to hand the rest to.',
      screen: 'clientHome',
      img: IMG.adaeze,
      features: [
        { title: 'Event dashboard', detail: 'High-level summaries of event progress: what is booked, what is requested, what is still open.' },
        { title: 'Assign and delegate', detail: 'The ability to assign and delegate tasks to an event planner.' },
        { title: 'Guest list and invites', detail: 'The digital guest list and the QR invitations, visible from the client’s side as RSVPs arrive.' },
        { title: 'Secure payments', detail: 'Payments for booked venues and vendors through a secure gateway, switched on in the commission phase.', tip: { term: 'commission phase', text: 'The platform launches free. Once enough successful transactions have gone through, a percentage of each vendor or venue booking is taken by the platform.' } },
      ],
    },
    {
      id: 'planner',
      name: 'Event planner',
      device: 'Mobile app and web',
      line: 'The operational heavy lifting, from the first search to the last scan.',
      screen: 'plannerBoard',
      img: IMG.tunde,
      features: [
        { title: 'Marketplace search', detail: 'Searches the marketplace for specific vendors and venues based on reviews and availability.' },
        { title: 'Booking requests', detail: 'Sends booking requests and coordinates the event timeline.' },
        { title: 'Digital guest lists', detail: 'Manages the guest list for each event and distributes the QR code invitations.' },
        { title: 'In-app QR scanner', detail: 'Checks guests in on site with the scanner built into the mobile app.', tip: { term: 'QR scanner', text: 'The phone’s camera reads the QR code on the guest’s invitation and marks them as arrived on the live list.' } },
      ],
    },
    {
      id: 'vendor',
      name: 'Vendor / Venue owner',
      device: 'Mobile app and web',
      line: 'A profile that answers the questions, a calendar that shows the days, an inbox that takes the bookings.',
      screen: 'vendorCalendar',
      img: IMG.bola,
      features: [
        { title: 'Profile management', detail: 'Portfolios, years of experience and client reviews on one profile.' },
        { title: 'Calendar management', detail: 'Free and booked dates, published for planners and clients to see.' },
        { title: 'Booking management', detail: 'Accept or decline incoming requests from the inbox.' },
        { title: 'Reviews and ratings', detail: 'The rating and review system that builds the vendor’s record on the platform.' },
      ],
    },
    {
      id: 'admin',
      name: 'Super admin',
      device: 'Web',
      line: 'The platform owner’s dashboard: accounts, verification, analytics, and the commission switch.',
      screen: 'adminVerification',
      img: IMG.london,
      features: [
        { title: 'User accounts', detail: 'Manage every account across the four roles.' },
        { title: 'Vendor verification', detail: 'Oversee the professional verification of vendors and venues.' },
        { title: 'Platform analytics', detail: 'Track the platform: users, events, bookings and check-ins across both markets.' },
        { title: 'Commissions', detail: 'Eventually manage commissions, once the free launch phase is over.' },
      ],
    },
  ],
  featureList: [
    { title: 'Targeted search and discovery', body: 'Event-specific vendors and venues, searchable by category, location, reviews and availability.' },
    { title: 'Dynamic availability calendars', body: 'Vendors and venues show free and booked days; planners read them before they ask.' },
    { title: 'Rating and review system', body: 'Reviews for vendors and venues, written by the clients and planners who booked them.' },
    { title: 'Digital guest list management', body: 'Guests, RSVPs, groups and tables, managed by the planner and visible to the client.' },
    { title: 'QR code invitations', body: 'A QR code generated for every guest on the list and distributed as the invitation.' },
    { title: 'In-app QR scanner', body: 'Seamless day-of check-ins from the planner’s or vendor’s phone.' },
    { title: 'Multilingual support', body: 'Local languages for the UK and Nigerian markets.' },
    { title: 'Secure payment gateway', body: 'Built for the future commission integrations, switched off at launch.' },
  ],
  ingestion: [
    { title: 'A curated first batch', body: 'The platform owner manually onboards a small batch of vendors, venues and users to test the app and gather initial feedback.' },
    { title: 'Then fully self-serve', body: 'New users and vendors download the app, create their profiles and populate their own data natively.' },
    { title: 'Your prototype as the reference', body: 'The existing web prototype on useedera.com is the reference for the flows and the brand; the build is custom-coded from it.' },
  ],
  layers: [
    {
      id: 'L1',
      code: 'L1',
      name: 'Hosting and storage',
      tech: [
        { name: 'AWS EC2', icon: 'aws' },
        { name: 'Amazon S3', icon: 's3' },
      ],
      detail: 'Cloud hosting on AWS for a scalable backend infrastructure. Amazon S3 holds the media, portfolio photographs, verification documents and invitation assets, encrypted and served by signed links.',
      carries: ['AWS EC2 hosting and DevOps', 'Encrypted media storage on S3', 'Backups and scaling'],
    },
    {
      id: 'L2',
      code: 'L2',
      name: 'Data',
      tech: [{ name: 'MongoDB Atlas', icon: 'mongodb' }],
      detail: 'MongoDB Atlas provides flexible cloud database management for users across the four roles, profiles and verification records, calendars, events, bookings, guest lists, QR codes, check-ins and reviews.',
      carries: ['Users, roles and verification', 'Calendars, events and bookings', 'Guest lists, QR codes, check-ins, reviews'],
    },
    {
      id: 'L3',
      code: 'L3',
      name: 'Backend API',
      tech: [
        { name: 'Node.js', icon: 'nodedotjs' },
        { name: 'Express.js', icon: 'express' },
        { name: 'JWT', icon: 'jwt' },
      ],
      detail: 'Node.js with Express.js powers the backend API: the custom REST APIs that connect the frontend applications to the database, authentication with JSON Web Tokens, and role-based permissions for clients, planners, vendors and the super admin.',
      carries: ['Custom REST APIs', 'JWT authentication', 'Role-based permissions'],
    },
    {
      id: 'L4',
      code: 'L4',
      name: 'Integrations',
      tech: [
        { name: 'Stripe', icon: 'stripe' },
        { name: 'Google Maps', icon: 'googlemaps' },
        { name: 'Firebase', icon: 'firebase' },
      ],
      detail: 'A secure payment gateway such as Stripe for holding funds and processing split payments, prepared for the commission structure and switched off at launch. Google Maps for venue locations and local vendor searches. A QR code generator and scanning SDK. Firebase for real-time push notifications on booking alerts.',
      carries: ['Payment gateway, prepared and off', 'Maps and geolocation', 'QR SDK and push notifications'],
    },
    {
      id: 'L5',
      code: 'L5',
      name: 'Apps',
      tech: [
        { name: 'React', icon: 'react' },
        { name: 'React Native', icon: 'reactnative' },
        { name: 'TypeScript', icon: 'typescript' },
        { name: 'Redux Toolkit', icon: 'redux' },
      ],
      detail: 'React.js for the web and the super admin panel, React Native for the cross-platform iOS and Android apps, TypeScript throughout, React Navigation and Redux Toolkit for navigation and state. The MERN stack foundation: MongoDB, Express.js, React.js, Node.js.',
      carries: ['iOS and Android apps', 'Web app and super admin panel', 'Shared language files for every market'],
    },
  ],
  integrations: [
    { name: 'Secure payment gateway (e.g. Stripe)', status: 'IN SCOPE', body: 'For holding funds and processing split payments. Built for the future commission integrations and kept switched off while the platform is free.' },
    { name: 'Mapping and geolocation (e.g. Google Maps)', status: 'IN SCOPE', body: 'Venue locations and local vendor searches.' },
    { name: 'QR code generator and scanning SDK', status: 'IN SCOPE', body: 'Generates the invitation codes and reads them at the door.' },
    { name: 'Push notifications (e.g. Firebase)', status: 'IN SCOPE', body: 'Real-time booking alerts for vendors, planners and clients.' },
    { name: 'Cloud hosting (AWS)', status: 'IN SCOPE', body: 'Scalable backend infrastructure on EC2 with S3 storage.' },
    { name: 'Commission billing', status: 'LATER PHASE', body: 'The percentage cut from every successful vendor or venue booking, activated once the platform is established.' },
  ],
  milestones: [
    { id: 'M01', name: 'Planning', heading: 'Project discovery, architecture planning and scope definition', pct: 10, phase: 'define', body: 'This initial phase sets the foundation for the entire three-month development cycle. We gather all project requirements, map out the detailed user journeys for the client, the event planner, the vendor, the venue owner and the super admin, plan the database architecture and finalise the technical blueprint, so there are no blind spots before design and coding begin.', deliverable: 'Requirements, user journeys for the five roles, database architecture and the technical blueprint', pay: 'The kick-start deposit', time: '14:00' },
    { id: 'M02', name: 'Designing UI', heading: 'Wireframing, prototyping and custom UI/UX design', pct: 10, phase: 'define', body: 'We create the visual identity and the user interface from scratch. Our design team crafts intuitive, modern screens for the cross-platform mobile apps on iOS and Android and for the super admin web panel. You review, give feedback and approve the designs so they align with your vision for Edera.', deliverable: 'Approved designs for the mobile apps and the super admin web panel', pay: 'Paid when you approve the designs', time: '14:45' },
    { id: 'M03', name: 'Frontend development', heading: 'Web and mobile application frontend coding', pct: 15, phase: 'build', body: 'The approved UI designs become functional code. Our developers build the interactive, user-facing interfaces with React Native for the mobile apps and ReactJS for the web panel, with smooth navigation, responsiveness, and the preparation for the multilingual support the UK and Nigerian markets need.', deliverable: 'The mobile app and web panel frontends, navigable and responsive', pay: 'Paid when you sign off this item', time: '15:30' },
    { id: 'M04', name: 'Backend and API integration', heading: 'Server-side logic, database creation and custom APIs', pct: 15, phase: 'build', body: 'We build the core engine of Edera with Node.js and MongoDB: the secure database for user profiles and event data, the data models, and the custom REST APIs that connect the frontend applications to the backend and enable the real-time flow of marketplace data.', deliverable: 'The database, the data models and the REST APIs connected to the apps', pay: 'Paid when you sign off this item', time: '16:15' },
    { id: 'M05', name: 'Integrations', heading: 'Third-party services and module integrations', pct: 15, phase: 'build', body: 'We implement the external services crucial to the platform’s operations: the payment gateway infrastructure prepared for the future commission structure, Google Maps for geolocation and venue searching, Firebase for real-time push notifications, and the SDKs for digital guest list generation and QR code scanning.', deliverable: 'Payment gateway, maps, push notifications and the QR invitation and scanning modules, integrated', pay: 'Paid when you sign off this item', time: '17:00' },
    { id: 'M06', name: 'First release (MVP beta)', heading: 'Functional beta version and core flow verification', pct: 15, phase: 'release', body: 'A working beta of the platform with the core end-to-end workflows: onboarding, marketplace discovery, booking requests and QR check-ins. You test the primary mechanics of the app and confirm the interactions between clients, planners and vendors work seamlessly in a live-like environment.', deliverable: 'A beta you can test end to end with your first circle of vendors and venues', pay: 'Paid when you sign off this item', time: '18:30' },
    { id: 'M07', name: 'Final release (feature complete)', heading: 'Full feature implementation and refinement', pct: 10, phase: 'release', body: 'Based on your feedback from the MVP phase, we add the final layers of functionality and polish. All secondary features, edge-case workflows and UI refinements are finalised, so the platform is comprehensive, scalable and fully matches the agreed scope.', deliverable: 'The feature-complete platform, refined from your beta feedback', pay: 'Paid when you sign off this item', time: '20:00' },
    { id: 'M08', name: 'Testing and deployment', heading: 'Quality assurance, app store submission and go-live', pct: 10, phase: 'release', body: 'Rigorous QA testing across multiple devices to eliminate bugs and optimise performance. Once you approve, we configure the AWS cloud servers, deploy the live web panel and submit the Edera mobile applications to the Apple App Store and Google Play Store. On deployment, full ownership of the source code is handed over and your support period begins.', deliverable: 'Live web panel, apps submitted to both stores, source code and IP handed over', pay: 'Paid at go-live', time: '22:00' },
  ],
  milestoneNote:
    'A strict milestone-based workflow: you are satisfied with the progress before you make a significant payment. A 10% deposit kick-starts the project; the first two milestones are delivered for your review and paid only after you are satisfied; then each payment clears the next item on the programme.',
  howItWorks: [
    { title: 'No large upfront cost', body: 'We do not require the full project amount upfront.' },
    { title: 'Kick-start payment', body: 'A 10% initial deposit formally kick-starts the project and allocates our resources.' },
    { title: 'Performance-based billing', body: 'We deliver the first two milestones for your review. You release the payment for them after you are satisfied with the work delivered.' },
    { title: 'Progressive workflow', body: 'Once a payment clears, we move on to the next set of milestones, repeating the cycle until the project is complete.' },
  ],
  support: [
    { item: 'Investment', detail: 'Eight milestones: a 10% deposit to start, then each item paid when you sign off its deliverable. Nothing is due between items.', figure: '$7,000', status: 'FIXED' },
    { item: 'Schedule', detail: 'Three months from the kick-start payment to the store submissions, with the eight items printed along the way.', figure: '3 months', status: 'FIXED' },
    { item: 'Warranty and support after launch', detail: 'Ninety days of free support and maintenance for bug fixes, from the day the source code is handed over.', figure: '90 days', status: 'INCLUDED' },
    { item: 'Source code and intellectual property', detail: 'Full transfer at the final milestone. Every milestone also hands over its own deliverables, the design files or the code of that module, as it completes.', figure: 'Handover', status: 'INCLUDED' },
    { item: 'Documentation and training', detail: 'Complete documentation and training for your team before go-live.', figure: 'Included', status: 'INCLUDED' },
    { item: 'Maintenance after day ninety', detail: 'Completely optional. No lock-in, no auto-renew. A monthly plan of $500 covers up to 15 hours of bug fixes and light UI/UX or logic improvements; additional hours at $30 an hour or a mutually agreed rate.', figure: '$500 / month', status: 'OPT-IN' },
  ],
  deliverables: [
    { title: 'Custom iOS mobile application', body: 'React Native. The client, planner and vendor experiences on the App Store.', screen: 'clientHome' },
    { title: 'Custom Android mobile application', body: 'React Native. The same apps on Google Play.', screen: 'checkin' },
    { title: 'Super admin web panel', body: 'ReactJS. Accounts, verification, analytics and the commission switch.', screen: 'adminVerification' },
    { title: 'Backend API and database', body: 'Node.js, Express.js and MongoDB Atlas on AWS.' },
    { title: 'Full transfer of source code and IP', body: 'Everything is yours at the final milestone; each milestone hands over its own files as it completes.' },
    { title: 'Ninety days of warranty and support', body: 'Post-launch bug-fixing support for ninety days, then entirely optional maintenance.' },
  ],
  monetisation: {
    title: 'Free to start, commission later',
    body: 'Initially the platform launches completely free of charge to build a user base, encourage habitual use and generate engagement. Once it is established with enough successful transactions, potentially one to three years down the line, a commission-based system is activated: a percentage cut from every successful vendor or venue booking made through the app.',
  },
  future: [
    { title: 'In-app messaging and video consultation', body: 'Modules between planners and vendors.' },
    { title: 'AI-driven vendor recommendations', body: 'Based on event type and budget.' },
    { title: 'Augmented reality venue walkthroughs', body: 'Virtual walkthroughs of a venue before a visit.' },
    { title: 'Contracts and e-signatures', body: 'Integrated legal contract generation and e-signatures for large-scale bookings.' },
    { title: 'Tiered subscriptions', body: 'Premium vendor placements through subscription tiers.' },
  ],
  clients: [
    { name: 'Clientify', url: 'https://clientify.com/', set: 'heavy' },
    { name: 'LeadKlozer', url: 'https://www.leadklozer.com/', set: 'wide' },
    { name: 'Zebra Recovery', url: 'https://zebrarecovery.com/', set: 'stack' },
    { name: 'OneLifeTale', url: 'https://onelifetale.com/', set: 'italic' },
    { name: 'Elomia Health', url: 'https://elomia.com/', set: 'light' },
    { name: 'Laser Bros', url: 'http://laserbros.com/', set: 'mono' },
    { name: 'BRiDDG', url: 'https://www.briddg.com/', set: 'heavy' },
    { name: 'Leadovate', url: 'https://leadovate.com/', set: 'wide' },
    { name: 'knowi', url: 'https://www.knowi.com/', set: 'italic' },
    { name: 'FaMEMEly', url: 'https://famemely.com/', set: 'mono' },
    { name: 'Welfore Health', url: 'https://welforehealth.com/', set: 'light' },
  ],
  whyUs: [
    { title: 'Proven expertise', body: 'MERN stack development and AI integrations, delivered for marketplaces and multi-user booking platforms before.' },
    { title: 'A dedicated in-house team', body: 'Full-stack engineers, AI specialists, UI/UX professionals, quality analysts and a DevOps engineer, assigned to Edera for the whole build.' },
    { title: 'Agile development', body: 'Clearly defined sprints and deliverables, with your review at every item on the programme.' },
    { title: 'A strong focus on quality', body: 'Dedicated QA and testing at every phase, across real devices.' },
    { title: 'Current standards', body: 'The latest web standards, modern techniques and well-documented, commented code.' },
    { title: 'Scalable and secure architecture', body: 'Built for performance and future growth, from the first circle of vendors to both markets.' },
    { title: 'Ninety days of free bug fixes', body: 'Ninety days of free bug-fixing support for a risk-free launch.' },
    { title: 'Flexible engagement', body: 'Optional terms for long-term maintenance and enhancements, with no lock-in.' },
    { title: 'Documentation and training', body: 'Complete documentation, training and client-first communication.' },
  ],
  faq: [
    { q: 'Will I have ownership of the platform and its source code?', a: 'Absolutely. On completion of every milestone you receive the deliverables associated with it, whether that is the design file or the code of the module, and on completion of the project and full payment you have complete ownership of the platform and its source code.' },
    { q: 'Do you provide post-launch support and maintenance?', a: 'Yes. Ninety days of free support and maintenance for bug fixes follow the handover. After that, support and maintenance are completely optional: a monthly plan or an hourly rate if and when you want it, with no lock-in and no auto-renew. The platform stays up to date, secure and performing on the latest devices and operating systems.' },
    { q: 'Can I request changes or updates after it is developed?', a: 'Yes. Requirements evolve. We provide change management procedures where you request updates or changes, we assess the feasibility and impact, and we advise on the best course of action.' },
    { q: 'How do you ensure the security of the application and user data?', a: 'We implement industry-standard security practices: secure data storage, encryption, JWT authentication, role-based permissions and adherence to privacy regulations, with thorough security testing to identify and address vulnerabilities.' },
    { q: 'Can we build on the existing Hostinger Horizons prototype?', a: 'The prototype is the reference for the flows and the brand. The platform itself is custom-coded in React, React Native and Node.js, so the mobile apps, the role-based backend and the integrations are built on a foundation that scales; the first milestone maps every journey the prototype already shows.' },
    { q: 'Why does the build include a payment gateway if the platform launches free?', a: 'The gateway is part of the architecture so that the commission system can be activated later as a configuration, not a new project. It is integrated in milestone five and kept switched off while the platform is free to use.' },
    { q: 'How is the $7,000 paid?', a: 'A 10% deposit of $700 kick-starts the project. Milestones one and two are delivered for your review and paid after you are satisfied. Then 15% each for frontend, backend, integrations and the MVP beta, and 10% each for the final release and for testing and deployment, every one paid when you sign off its deliverable.' },
    { q: 'What happens after the three months?', a: 'The live web panel is deployed, the apps are submitted to the Apple App Store and Google Play Store, the source code and IP are handed over, and your ninety days of free support begin.' },
  ],
  startNeeds: [
    { title: 'Planning', body: 'We assess the technical feasibility, settle the development approach, plan the resources and set the deployment strategy.' },
    { title: 'Design assets', body: 'Any existing brand assets, such as the Edera logo, colour scheme and visual elements, that will be incorporated into the design.' },
    { title: 'Content', body: 'Any text, images or media that need to be included in the application: categories, the first vendor profiles, and the copy for both markets.' },
  ],
  cta: {
    line: 'Shall we put the first item on the programme?',
    action: 'RSVP',
    message: 'Hi, I’ve read through the Edera proposal. $7,000 over 3 months in eight milestones works for me. Let’s set the start date in December.',
    done: 'Message copied. Paste it in our chat.',
  },
}

/* ------------------------------------------------------------------ derived */

export interface ResolvedMilestone extends Milestone {
  no: string
  amount: number
  cumulative: number
}

/** Milestone amounts derive from percentages; running totals accumulate. */
export function resolveMilestones(total = TOTAL_COST): ResolvedMilestone[] {
  let run = 0
  return P.milestones.map((m, i) => {
    const amount = Math.round((total * m.pct) / 100)
    run += amount
    return { ...m, no: String(i + 1).padStart(2, '0'), amount, cumulative: run }
  })
}

export const MILESTONES = resolveMilestones()

/** The programme's running order: the first item and the last. Nav and item lines use it. */
export const PROGRAMME = {
  doors: '14:00',
  lastItem: '23:00',
} as const
