export type ServiceId =
  | "event-security"
  | "close-protection"
  | "hotel-security"
  | "construction-security"
  | "hospitality-security"
  | "private-security"
  | "static-guarding"
  | "cctv-monitoring";

export type Service = {
  id: ServiceId;
  order: number;
  title: string;
  eyebrow: string;
  summary: string;
  detail: string;
  outcomes: readonly string[];
  icon: "calendar" | "user" | "hotel" | "hard-hat" | "wine" | "key" | "shield" | "camera";
};

export const navigation = [
  { label: "Services", href: "#services" },
  { label: "Why Liberty", href: "#why-liberty" },
  { label: "How it works", href: "#process" },
  { label: "About", href: "#about" },
] as const;

export const heroContent = {
  eyebrow: "Security services · Auckland Region",
  heading: "People protecting people.",
  lead: "Professional security built around experienced people, clear communication and a genuine commitment to every assignment.",
  primaryCta: "Discuss your security needs",
  secondaryCta: "Explore our services",
  proof: ["Proactive communication", "Tailored planning", "Hands-on leadership"],
} as const;

const serviceList = [
  {
    id: "event-security",
    order: 1,
    title: "Event Security",
    eyebrow: "Public, private and corporate events",
    summary: "Calm, professional teams that help people feel safe while your event keeps moving.",
    detail: "From early planning through pack-down, Liberty works with organisers and venue teams to understand the environment, anticipate pressure points and maintain clear communication on the day.",
    outcomes: ["A plan shaped around your event", "Professional public-facing presence", "Clear coordination with your team"],
    icon: "calendar",
  },
  {
    id: "close-protection",
    order: 2,
    title: "Close Protection",
    eyebrow: "Discreet personal security",
    summary: "Considered protection for people whose safety, privacy and schedule matter.",
    detail: "A discreet service planned around the individual, their movements and the environments they need to enter, without adding unnecessary friction to the day.",
    outcomes: ["Context-led risk planning", "Discreet professional conduct", "Responsive communication"],
    icon: "user",
  },
  {
    id: "hotel-security",
    order: 3,
    title: "Hotel Security",
    eyebrow: "Guest, team and property support",
    summary: "A composed security presence aligned with your standard of hospitality.",
    detail: "Liberty supports hotel operations with personnel who understand the balance between vigilance, discretion and a respectful guest experience.",
    outcomes: ["Guest-aware approach", "Support for hotel procedures", "Professional incident response"],
    icon: "hotel",
  },
  {
    id: "construction-security",
    order: 4,
    title: "Construction Site Security",
    eyebrow: "Sites, assets and access",
    summary: "Reliable guarding that supports site controls and protects what keeps your project moving.",
    detail: "We work to the needs of each site, helping monitor access, maintain an observable presence and communicate issues promptly to the people responsible.",
    outcomes: ["Site-specific briefing", "Access and perimeter awareness", "Clear issue escalation"],
    icon: "hard-hat",
  },
  {
    id: "hospitality-security",
    order: 5,
    title: "Club & Hospitality Security",
    eyebrow: "Venues and nightlife",
    summary: "Confident front-of-house security delivered with judgement, respect and consistency.",
    detail: "Liberty helps venues create a safer experience for guests and staff through professional presentation, measured communication and early intervention.",
    outcomes: ["Respectful guest interactions", "Proactive issue management", "Alignment with venue teams"],
    icon: "wine",
  },
  {
    id: "private-security",
    order: 6,
    title: "Private Security",
    eyebrow: "People, homes and private occasions",
    summary: "Personal, considered security shaped around sensitive circumstances.",
    detail: "Every private assignment begins with listening. We define what protection should feel like, what must remain discreet and how communication will work throughout.",
    outcomes: ["Confidential conversation", "Tailored scope", "Professional discretion"],
    icon: "key",
  },
  {
    id: "static-guarding",
    order: 7,
    title: "Static Guarding",
    eyebrow: "Visible, dependable presence",
    summary: "Professional guarding for locations that need consistency and accountability.",
    detail: "Static guarding is tailored to the responsibilities of the site, with clear briefing, professional conduct and communication that keeps stakeholders informed.",
    outcomes: ["Defined post instructions", "Consistent professional presence", "Accountable reporting"],
    icon: "shield",
  },
  {
    id: "cctv-monitoring",
    order: 8,
    title: "CCTV Monitoring",
    eyebrow: "On-site CCTV surveillance",
    summary: "Attentive on-site monitoring that turns camera coverage into timely human awareness.",
    detail: "Liberty personnel monitor CCTV from your site, following agreed procedures and escalating observed activity to the right people when needed.",
    outcomes: ["On-site camera observation", "Site-aligned escalation", "Clear communication"],
    icon: "camera",
  },
] satisfies readonly Service[];

export const services: readonly Service[] = [...serviceList].sort((a, b) => a.order - b.order);

export const valuePillars = [
  { title: "Respect", copy: "Professional, courteous and fair with every client, employee and member of the public." },
  { title: "Communication", copy: "Clear, proactive updates before, during and after an assignment." },
  { title: "Honesty", copy: "Open communication, ownership and transparency when it matters." },
  { title: "Initiative", copy: "Awareness and early action before small problems become larger ones." },
  { title: "Professionalism", copy: "Preparation, attitude, accountability and consistency in every interaction." },
] as const;

export const processSteps = [
  { number: "01", title: "Initial conversation", copy: "Tell us what you are protecting, where, when and what a successful service should feel like." },
  { number: "02", title: "Planning", copy: "We shape the personnel, responsibilities and communication approach around your environment." },
  { number: "03", title: "Deployment", copy: "Your team arrives briefed, prepared and aligned with the people responsible on site." },
  { number: "04", title: "Live communication", copy: "We stay connected, raise issues early and adapt when the situation changes." },
  { number: "05", title: "Review & feedback", copy: "We close the loop and carry what we learn into the next assignment." },
] as const;

export const industries = [
  "Public & private events",
  "Corporate events",
  "Hotels & accommodation",
  "Hospitality & nightlife",
  "Construction & infrastructure",
  "Commercial properties",
  "Residential developments",
  "Retail environments",
  "Government & community facilities",
  "VIP & executive protection",
  "Private clients",
  "Asset & property protection",
] as const;

export const aboutContent = {
  eyebrow: "Built for better security relationships",
  heading: "Experience with a more human standard of service.",
  body: [
    "Liberty Security was founded by two owners with more than fifteen years of combined industry experience.",
    "They created Liberty to move beyond simply filling shifts — bringing experienced people, proactive communication and genuine accountability together in one dependable service.",
  ],
  founderNote: "Founder profiles and approved photography are pending and intentionally not published yet.",
} as const;

export const contactContent = {
  eyebrow: "Start a conversation",
  heading: "Let’s make security feel clear from the start.",
  lead: "Share what you are planning or protecting. We’ll use the details to understand your needs and continue the conversation.",
  phoneDisplay: "027 111 1111",
  phoneHref: "tel:+64271111111",
} as const;

export const socialLinks = [
  { label: "LinkedIn", href: null },
  { label: "Facebook", href: null },
  { label: "Instagram", href: null },
] as const;

export const siteNotice = "Liberty Security operates across the Auckland Region. Service details are confirmed for each enquiry.";
