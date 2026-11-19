import {
  Aperture,
  Award,
  BadgeCheck,
  BriefcaseBusiness,
  Camera,
  Clapperboard,
  Crown,
  Diamond,
  Landmark,
  Mountain,
  Palette,
  Sparkles,
  Trophy,
  WandSparkles
} from "lucide-react";

export const heroImage = {
  src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1800&q=80",
  alt: "A newly married couple raising their hands by a pool surrounded by red balloons and guests",
  caption: "Destination wedding · Lake Como"
};

export const services = [
  {
    id: "photo-shooting",
    title: "Photo Shooting",
    short: "Portraits, couples & personal shoots",
    category: "Shooting",
    price: 650,
    duration: "2-4 hours",
    delivery: "7 days",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    description: "A signature guided session with lighting design, shot direction, moodboarding, and a polished private gallery."
  },
  {
    id: "wedding-coverage",
    title: "Wedding Coverage",
    short: "Your whole day, documented beautifully",
    category: "Shooting",
    price: 3200,
    duration: "8-12 hours",
    delivery: "21 days",
    icon: Diamond,
    image: "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1200&q=80",
    description: "Documentary wedding coverage with an editorial portrait chapter, drone-ready planning, and heirloom delivery."
  },
  {
    id: "event-coverage",
    title: "Event Coverage",
    short: "Launches, galas, parties & dinners",
    category: "Shooting",
    price: 1400,
    duration: "4-8 hours",
    delivery: "10 days",
    icon: Clapperboard,
    image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80",
    description: "Event storytelling for launches, galas, private dinners, and cultural moments with fast editorial selects."
  },
  {
    id: "fashion-photography",
    title: "Fashion Photography",
    short: "Lookbooks & campaigns",
    category: "Shooting",
    price: 2400,
    duration: "Full day",
    delivery: "14 days",
    icon: Sparkles,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    description: "Campaign and lookbook production with art direction, model pacing, location scouting, and luxury retouching."
  },
  {
    id: "commercial-photography",
    title: "Commercial Photography",
    short: "Brands, spaces & founders",
    category: "Shooting",
    price: 2800,
    duration: "Full day",
    delivery: "14 days",
    icon: BriefcaseBusiness,
    image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1200&q=80",
    description: "High-impact visuals for hospitality, founders, studios, campaigns, spaces, and brand launches."
  },
  {
    id: "product-photography",
    title: "Product Photography",
    short: "E-commerce ready product images",
    category: "Shooting",
    price: 900,
    duration: "Half day",
    delivery: "8 days",
    icon: Aperture,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
    description: "Precise product imagery with styling, macro detail, controlled reflection, and e-commerce ready exports."
  },
  {
    id: "photo-editing",
    title: "Photo Editing",
    short: "Color grading for photos you already have",
    category: "Post-production",
    price: 180,
    duration: "Remote",
    delivery: "3 days",
    icon: Palette,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    description: "Color grading, tonal balancing, cropping, sequencing, and export preparation for digital or print."
  },
  {
    id: "retouching",
    title: "Retouching",
    short: "Natural skin, beauty & product retouch",
    category: "Post-production",
    price: 120,
    duration: "Remote",
    delivery: "48 hours",
    icon: WandSparkles,
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    description: "Beauty, skin, fashion, product, and composite retouching with natural texture and premium finishing."
  }
];

export const getService = (id) => services.find((item) => item.id === id);

export const portfolioCategories = ["All", "Weddings", "Portraits", "Fashion", "Commercial", "Events", "Nature", "Travel"];

/** Which bookable service matches each portfolio category. */
export const categoryService = {
  Weddings: "wedding-coverage",
  Portraits: "photo-shooting",
  Fashion: "fashion-photography",
  Commercial: "commercial-photography",
  Events: "event-coverage",
  Nature: "photo-shooting",
  Travel: "photo-shooting"
};

export const portfolioItems = [
  ["Weddings", "Amber Vows", "Lake Como, Italy", "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80"],
  ["Portraits", "Noir Presence", "London Studio", "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1000&q=80"],
  ["Fashion", "Chrome Season", "Paris", "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=80"],
  ["Commercial", "Atlas Hotel", "Marrakesh", "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=1000&q=80"],
  ["Events", "Midnight Launch", "New York", "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1000&q=80"],
  ["Nature", "Quiet Ridge", "Iceland", "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80"],
  ["Travel", "Golden Route", "Sahara", "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1000&q=80"],
  ["Weddings", "The Last Dance", "Lisbon", "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=80"],
  ["Portraits", "Soft Focus", "Berlin", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=80"],
  ["Fashion", "Velvet Motion", "Milan", "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1000&q=80"],
  ["Commercial", "Founder Signal", "Tokyo", "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80"],
  ["Events", "Cultural Room", "Dubai", "https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=1000&q=80"],
  ["Nature", "Glacial Blue", "Norway", "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80"],
  ["Travel", "City Heat", "Hong Kong", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"]
].map(([category, title, location, image], index) => ({
  id: `${category}-${index}`,
  category,
  title,
  location,
  image,
  ratio: ["4/5", "3/4", "1/1", "4/5", "2/3"][index % 5]
}));

export const achievements = [
  { year: "2026", type: "Award", title: "International Photo Awards, Gold", icon: Trophy, detail: "Editorial wedding series recognized for cinematic composition." },
  { year: "2025", type: "Feature", title: "Vogue Arabia Visual Story", icon: Crown, detail: "Luxury fashion campaign published as a ten-page feature." },
  { year: "2025", type: "Exhibition", title: "The Geography of Light", icon: Landmark, detail: "Solo exhibition hosted across Tunis, Paris, and Milan." },
  { year: "2024", type: "Milestone", title: "400th Commission Delivered", icon: BadgeCheck, detail: "A private travel story for a hospitality group in Japan." },
  { year: "2023", type: "Competition", title: "Sony Alpha Regional Finalist", icon: Award, detail: "Selected for emotional portraiture and controlled natural light." },
  { year: "2022", type: "Magazine", title: "National Geographic Your Shot", icon: Mountain, detail: "Travel image shortlisted for environmental storytelling." }
];

export const testimonials = [
  {
    quote: "PHTXY made our wedding feel like a film still. Nothing posed, nothing loud, everything deeply alive.",
    name: "Maya & Elias",
    role: "Lake Como Wedding"
  },
  {
    quote: "The campaign had restraint, tension, polish, and a sense of scale. The images gave our brand a new vocabulary.",
    name: "Nora Ben Salem",
    role: "Creative Director, Maison Aure"
  },
  {
    quote: "They understand when to disappear and when to direct. That balance is rare, and the final gallery was immaculate.",
    name: "Julian Hart",
    role: "Private Event Client"
  }
];

export const dashboard = {
  metrics: [
    { label: "Booked revenue", value: "$184K", trend: "+18%" },
    { label: "Active clients", value: "127", trend: "+12%" },
    { label: "Upcoming shoots", value: "24", trend: "+7" },
    { label: "Gallery approvals", value: "96%", trend: "+4%" }
  ],
  bookings: [
    { client: "Amira Haddad", service: "Wedding Coverage", date: "Jun 24", status: "Confirmed", value: "$3,200" },
    { client: "Maison Aure", service: "Fashion Photography", date: "Jun 27", status: "Planning", value: "$2,400" },
    { client: "Atlas Hotel", service: "Commercial Photography", date: "Jul 02", status: "Deposit Paid", value: "$2,800" },
    { client: "Leo Chen", service: "Portrait Session", date: "Jul 06", status: "Confirmed", value: "$650" }
  ],
  customers: ["Maya & Elias", "Nora Ben Salem", "Julian Hart", "Atlas Hotel Group", "Kairo Watches"],
  chart: [32, 44, 38, 61, 56, 74, 82, 78, 91, 105, 118, 124]
};

/** Public navigation. Admin stays reachable at /admin (linked from the footer). */
export const navItems = [
  { label: "Services & prices", href: "/services" },
  { label: "Portfolio", href: "/portfolio" },
  { label: "About", href: "/achievements" }
];
