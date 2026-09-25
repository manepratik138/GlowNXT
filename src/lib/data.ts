// ============================================================
// BEAUTYCAFE AT HOME — Shared Dummy Data & Types
// ============================================================

export type Service = {
  id: string;
  name: string;
  category: string;
  price: number;
  duration: number; // minutes
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  description: string;
  gender?: "women" | "men" | "unisex";
};

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: string;
  description: string;
  targetGender?: "women" | "men" | "unisex";
};

export type Professional = {
  id: string;
  name: string;
  title: string;
  avatar: string;
  rating: number;
  reviewCount: number;
  location: string;
  experience: number;
  services: string[];
  price: number;
  badge?: string;
  verified: boolean;
  available: boolean;
  bio: string;
  completedJobs: number;
  specializations?: string[];
  certificates?: string[];
  portfolio?: string[];
  availableSlots?: string[];
  priceList?: { service: string; price: number }[];
  gender?: "female" | "male";
};

export type Review = {
  id: string;
  customerName: string;
  customerAvatar: string;
  rating: number;
  comment: string;
  service: string;
  date: string;
  professionalName: string;
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  count: number;
  color: string;
  gradient: string;
  gender?: "women" | "men" | "unisex";
};

export type Booking = {
  id: string;
  service: string;
  professional: string;
  professionalAvatar: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "completed" | "cancelled";
  price: number;
  duration: number;
};

// ============================================================
// CATEGORIES
// ============================================================
export const CATEGORIES: Category[] = [
  { id: "facial", name: "Facial & Skincare", icon: "✨", count: 48, color: "#e11d48", gradient: "from-rose-400 to-pink-600", gender: "women" },
  { id: "hair", name: "Hair Styling", icon: "💇", count: 64, color: "#7c3aed", gradient: "from-violet-500 to-purple-700", gender: "women" },
  { id: "men_hair", name: "Men's Haircut & Styling", icon: "💈", count: 32, color: "#2563eb", gradient: "from-blue-500 to-indigo-700", gender: "men" },
  { id: "beard", name: "Beard Trim & Beard Spa", icon: "🧔", count: 24, color: "#1d4ed8", gradient: "from-indigo-600 to-blue-800", gender: "men" },
  { id: "men_detan", name: "Men's De-Tan & Facial", icon: "⚡", count: 28, color: "#0284c7", gradient: "from-sky-500 to-blue-600", gender: "men" },
  { id: "groom", name: "Groom Wedding Packages", icon: "🤵", count: 16, color: "#4f46e5", gradient: "from-indigo-500 to-purple-700", gender: "men" },
  { id: "nails", name: "Nail Art", icon: "💅", count: 36, color: "#0ea5e9", gradient: "from-sky-400 to-blue-600", gender: "women" },
  { id: "massage", name: "Body Massage", icon: "🧖", count: 29, color: "#059669", gradient: "from-emerald-400 to-teal-600", gender: "unisex" },
  { id: "bridal", name: "Bridal Packages", icon: "👰", count: 18, color: "#d97706", gradient: "from-amber-400 to-orange-500", gender: "women" },
  { id: "makeup", name: "Makeup & Glam", icon: "💄", count: 42, color: "#db2777", gradient: "from-pink-500 to-rose-600", gender: "women" },
  { id: "waxing", name: "Waxing & Threading", icon: "🪮", count: 55, color: "#64748b", gradient: "from-slate-400 to-slate-600", gender: "unisex" },
  { id: "spa", name: "At-Home Spa", icon: "🛁", count: 22, color: "#0d9488", gradient: "from-teal-400 to-cyan-600", gender: "unisex" },
  { id: "elder", name: "Senior Care", icon: "🧓", count: 15, color: "#8b5cf6", gradient: "from-purple-400 to-indigo-600", gender: "unisex" },
  { id: "kids", name: "Kids Grooming", icon: "👶", count: 12, color: "#f59e0b", gradient: "from-yellow-400 to-orange-400", gender: "unisex" },
  { id: "mehendi", name: "Mehendi Art", icon: "🌿", count: 28, color: "#16a34a", gradient: "from-green-500 to-emerald-600", gender: "women" },
  { id: "wedding", name: "Wedding Services", icon: "💍", count: 35, color: "#c026d3", gradient: "from-fuchsia-500 to-pink-700", gender: "unisex" },
];

// ============================================================
// SERVICES
// ============================================================
export const SERVICES: Service[] = [
  {
    id: "s1",
    name: "Luxury Facial Treatment",
    category: "Facial & Skincare",
    price: 1499,
    duration: 60,
    rating: 4.9,
    reviewCount: 328,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80",
    badge: "Bestseller",
    description: "Deep cleansing, exfoliation, mask & moisturizing for glowing skin."
  },
  {
    id: "s2",
    name: "Bridal Makeup",
    category: "Makeup & Glam",
    price: 4999,
    duration: 120,
    rating: 4.8,
    reviewCount: 215,
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&q=80",
    badge: "Premium",
    description: "Full bridal look with airbrush foundation, dramatic eyes, and long-lasting finish."
  },
  {
    id: "s3",
    name: "Thai Body Massage",
    category: "Body Massage",
    price: 1899,
    duration: 90,
    rating: 4.7,
    reviewCount: 189,
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
    badge: "Top Rated",
    description: "Traditional Thai massage techniques to relieve stress and improve circulation."
  },
  {
    id: "s4",
    name: "Keratin Hair Treatment",
    category: "Hair Styling",
    price: 2999,
    duration: 150,
    rating: 4.6,
    reviewCount: 143,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80",
    description: "Protein treatment for frizz-free, silky smooth hair lasting up to 3 months."
  },
  {
    id: "s5",
    name: "3D Nail Art Design",
    category: "Nail Art",
    price: 899,
    duration: 60,
    rating: 4.8,
    reviewCount: 267,
    image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80",
    badge: "Trending",
    description: "Custom nail art with gel extensions, rhinestones, and hand-painted designs."
  },
  {
    id: "s6",
    name: "Waxing Full Body",
    category: "Waxing & Threading",
    price: 1199,
    duration: 75,
    rating: 4.5,
    reviewCount: 412,
    image: "https://images.unsplash.com/photo-1560472355-536de3962603?w=600&q=80",
    description: "Full-body waxing with premium chocolate or honey wax for smooth skin."
  },
  {
    id: "s7",
    name: "At-Home Spa Package",
    category: "At-Home Spa",
    price: 3499,
    duration: 180,
    rating: 4.9,
    reviewCount: 98,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80",
    badge: "New",
    description: "Complete spa experience at home — scrub, wrap, facial, and massage."
  },
  {
    id: "s8",
    name: "HD Eyebrow Threading",
    category: "Waxing & Threading",
    price: 299,
    duration: 20,
    rating: 4.7,
    reviewCount: 589,
    image: "https://images.unsplash.com/photo-1590156206657-aef2e8c8e88b?w=600&q=80",
    description: "Precision eyebrow shaping with threading for perfectly defined brows."
  },
  {
    id: "s_m1",
    name: "Executive Men's Haircut & Head Massage",
    category: "Men's Haircut & Styling",
    price: 499,
    duration: 45,
    rating: 4.9,
    reviewCount: 412,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80",
    badge: "Men's Choice",
    description: "Precision haircut, hair wash, blow dry, and 15-min stress relief head massage.",
    gender: "men",
  },
  {
    id: "s_m2",
    name: "Royal Beard Trim & Beard Spa",
    category: "Beard Trim & Beard Spa",
    price: 399,
    duration: 35,
    rating: 4.8,
    reviewCount: 289,
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&q=80",
    badge: "Trending",
    description: "Beard shaping, hot towel steam, essential oil massage & beard butter shine.",
    gender: "men",
  },
  {
    id: "s_m3",
    name: "Men's De-Tan & Charcoal Detox Facial",
    category: "Men's De-Tan & Facial",
    price: 899,
    duration: 50,
    rating: 4.9,
    reviewCount: 345,
    image: "https://images.unsplash.com/photo-1512290900676-26c2a6a095ae?w=600&q=80",
    badge: "Pollution Defense",
    description: "Deep pore charcoal extraction, tan removal mask, and cooling hydration cream.",
    gender: "men",
  },
  {
    id: "s_m4",
    name: "Groom Royal Wedding Package",
    category: "Groom Wedding Packages",
    price: 3499,
    duration: 120,
    rating: 5.0,
    reviewCount: 156,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    badge: "Groom Special",
    description: "Hair styling, beard perfection, O3+ facial detox, manicure & pre-wedding glow.",
    gender: "men",
  },
  {
    id: "s_m5",
    name: "Men's Foot & Hand Pedicure Spa",
    category: "At-Home Spa",
    price: 699,
    duration: 45,
    rating: 4.7,
    reviewCount: 180,
    image: "https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=600&q=80",
    badge: "Relaxing",
    description: "Nail trimming, exfoliation scrub, cuticle care & relaxing foot reflexology.",
    gender: "men",
  },
];

// ============================================================
// PRODUCTS (AFTER-CARE E-COMMERCE SHOP)
// ============================================================
export const PRODUCTS: Product[] = [
  {
    id: "prod_1",
    name: "Organic Beard Growth & Shine Elixir",
    category: "Beard Care",
    price: 499,
    rating: 4.9,
    reviewCount: 284,
    image: "https://images.unsplash.com/photo-1608248597260-8f9f7431e670?w=600&q=80",
    badge: "Bestseller",
    description: "100% natural cold-pressed Argan & Jojoba oil blend for soft, thick beard growth.",
    targetGender: "men",
  },
  {
    id: "prod_2",
    name: "Herbal Anti-Hairfall Revitalizer Serum",
    category: "Hair Care",
    price: 699,
    rating: 4.8,
    reviewCount: 512,
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=600&q=80",
    badge: "Dermat Recommended",
    description: "Redensyl & Rosemary formula to stimulate scalp hair growth and reduce breakage.",
    targetGender: "unisex",
  },
  {
    id: "prod_3",
    name: "Activated Charcoal De-Tan Scrub & Mask",
    category: "Skincare",
    price: 599,
    rating: 4.9,
    reviewCount: 389,
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80",
    badge: "Instant Glow",
    description: "Pulls out deep blackheads and sun-tan in 10 minutes. 100g jar.",
    targetGender: "unisex",
  },
  {
    id: "prod_4",
    name: "Organic Rosewater Hydrating Sheet Masks (Pack of 5)",
    category: "Skincare",
    price: 399,
    rating: 4.7,
    reviewCount: 195,
    image: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80",
    badge: "Hydration Boost",
    description: "Infused with pure Kannauj Rose extracts for instant plump, glass-skin glow.",
    targetGender: "women",
  },
  {
    id: "prod_5",
    name: "L'Oréal Professionnel Mythic Oil Hair Serum",
    category: "Hair Care",
    price: 850,
    rating: 4.9,
    reviewCount: 620,
    image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&q=80",
    badge: "Salon Grade",
    description: "Nourishing oil enriched with Avocado oil for silky, frizz-free hair.",
    targetGender: "women",
  },
];

// ============================================================
// PROFESSIONALS
// ============================================================
export const PROFESSIONALS: Professional[] = [
  {
    id: "p1",
    name: "Priya Sharma",
    title: "Senior Beauty Therapist",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=300&q=80",
    rating: 4.9,
    reviewCount: 312,
    location: "Bandra, Mumbai",
    experience: 8,
    services: ["Facial", "Massage", "Bridal"],
    price: 1200,
    badge: "Top Rated",
    verified: true,
    available: true,
    bio: "8 years of expertise in luxury beauty treatments. Trained in Thailand and UK.",
    completedJobs: 1248,
    specializations: ["Luxury Facials", "Ayurvedic Massage", "Bridal Prep"],
    certificates: ["CIDESCO Certified", "Thailand Spa Diploma"],
    portfolio: [
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&q=80",
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400&q=80",
    ],
    availableSlots: ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
    priceList: [
      { service: "Luxury Facial", price: 1499 },
      { service: "Thai Massage", price: 1899 },
      { service: "Bridal Prep", price: 5999 },
    ],
  },
  {
    id: "p2",
    name: "Ananya Krishnan",
    title: "Makeup Artist & Stylist",
    avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&q=80",
    rating: 4.8,
    reviewCount: 198,
    location: "Koramangala, Bangalore",
    experience: 6,
    services: ["Makeup", "Bridal", "Party Glam"],
    price: 2500,
    badge: "Certified",
    verified: true,
    available: true,
    bio: "MAC-certified MUA specializing in bridal and editorial makeup for 6+ years.",
    completedJobs: 789,
    specializations: ["Bridal Makeup", "Airbrush", "Editorial"],
    certificates: ["MAC Certified", "VLCC Diploma"],
    portfolio: [
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
    ],
    availableSlots: ["10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
    priceList: [
      { service: "Bridal Makeup", price: 4999 },
      { service: "Party Glam", price: 2499 },
      { service: "Engagement Look", price: 3499 },
    ],
  },
  {
    id: "p3",
    name: "Meera Patel",
    title: "Nail Art Specialist",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=300&q=80",
    rating: 4.9,
    reviewCount: 445,
    location: "Powai, Mumbai",
    experience: 5,
    services: ["Nail Art", "Manicure", "Pedicure"],
    price: 800,
    badge: "Fan Favorite",
    verified: true,
    available: false,
    bio: "Nail art enthusiast creating stunning designs from minimalist to elaborate 3D art.",
    completedJobs: 2156,
    specializations: ["3D Nail Art", "Gel Extensions", "Nail Stamping"],
    portfolio: [
      "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80",
    ],
    availableSlots: ["10:00 AM", "1:00 PM", "3:00 PM"],
    priceList: [
      { service: "3D Nail Art", price: 899 },
      { service: "Gel Manicure", price: 599 },
      { service: "Full Pedicure", price: 799 },
    ],
  },
  {
    id: "p4",
    name: "Kavitha Nair",
    title: "Spa & Wellness Expert",
    avatar: "https://images.unsplash.com/photo-1546961342-ea5f62d6f4b7?w=300&q=80",
    rating: 4.7,
    reviewCount: 167,
    location: "Indiranagar, Bangalore",
    experience: 10,
    services: ["Massage", "Spa", "Ayurveda"],
    price: 1800,
    badge: "Expert",
    verified: true,
    available: true,
    bio: "Certified Ayurveda therapist with 10 years of holistic wellness experience.",
    completedJobs: 934,
    specializations: ["Ayurvedic Treatments", "Aromatherapy", "Hot Stone Massage"],
    availableSlots: ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
    priceList: [
      { service: "At-Home Spa Package", price: 3499 },
      { service: "Ayurvedic Massage", price: 1999 },
    ],
  },
  {
    id: "p5",
    name: "Sunita Reddy",
    title: "Hair Stylist & Colorist",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
    rating: 4.6,
    reviewCount: 234,
    location: "Jubilee Hills, Hyderabad",
    experience: 7,
    services: ["Hair Coloring", "Keratin", "Styling"],
    price: 1500,
    verified: true,
    available: true,
    bio: "Loreal-trained colorist creating gorgeous hair transformations since 2017.",
    completedJobs: 1089,
    specializations: ["Balayage", "Keratin Treatment", "Hair Spa"],
    availableSlots: ["10:00 AM", "12:00 PM", "3:00 PM", "5:00 PM"],
    priceList: [
      { service: "Keratin Treatment", price: 2999 },
      { service: "Global Color", price: 1999 },
      { service: "Balayage", price: 3499 },
    ],
  },
  {
    id: "p6",
    name: "Deepa Menon",
    title: "Skincare & Facial Expert",
    avatar: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=300&q=80",
    rating: 4.8,
    reviewCount: 321,
    location: "Velachery, Chennai",
    experience: 9,
    services: ["Facial", "Chemical Peel", "Anti-aging"],
    price: 1600,
    badge: "Pro Plus",
    verified: true,
    available: true,
    bio: "Dermatology-trained esthetician specializing in advanced skin treatments.",
    completedJobs: 1567,
    specializations: ["Anti-Aging", "Chemical Peels", "Microdermabrasion"],
    availableSlots: ["9:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"],
    priceList: [
      { service: "Luxury Facial", price: 1499 },
      { service: "Chemical Peel", price: 2499 },
      { service: "Anti-Aging Treatment", price: 3199 },
    ],
  },
];

// ============================================================
// REVIEWS
// ============================================================
export const REVIEWS: Review[] = [
  {
    id: "r1",
    customerName: "Ritika Agarwal",
    customerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    rating: 5,
    comment: "Absolutely loved my bridal makeup experience! Ananya was incredible — she listened to exactly what I wanted and delivered perfection. My skin looked flawless all day long. Will definitely book again! ✨",
    service: "Bridal Makeup",
    date: "Jan 28, 2026",
    professionalName: "Ananya Krishnan",
  },
  {
    id: "r2",
    customerName: "Sonia Mehta",
    customerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    rating: 5,
    comment: "Priya gave the most relaxing massage I've ever had. The at-home experience was so convenient — no travel stress, just pure bliss. My husband also booked one after seeing me! 😂",
    service: "Thai Body Massage",
    date: "Feb 5, 2026",
    professionalName: "Priya Sharma",
  },
  {
    id: "r3",
    customerName: "Neha Joshi",
    customerAvatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&q=80",
    rating: 5,
    comment: "Meera's nail art is a work of art! She did custom florals for my sister's wedding. Got SO many compliments. The attention to detail is unmatched. Worth every rupee!",
    service: "3D Nail Art Design",
    date: "Jan 14, 2026",
    professionalName: "Meera Patel",
  },
  {
    id: "r4",
    customerName: "Pooja Rao",
    customerAvatar: "https://images.unsplash.com/photo-1536766768598-e09213fdcf22?w=100&q=80",
    rating: 5,
    comment: "The at-home spa package is life-changing! Kavitha transformed my living room into a luxury spa. The Ayurvedic treatments were so calming. I felt rejuvenated for days after!",
    service: "At-Home Spa Package",
    date: "Feb 12, 2026",
    professionalName: "Kavitha Nair",
  },
  {
    id: "r5",
    customerName: "Divya Krishnamurthy",
    customerAvatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&q=80",
    rating: 5,
    comment: "Deepa's facial left my skin glowing for weeks! Professional, punctual, and the products she uses are top-notch. It's my monthly ritual now. Highly recommend GlowNXT!",
    service: "Luxury Facial Treatment",
    date: "Jan 21, 2026",
    professionalName: "Deepa Menon",
  },
  {
    id: "r6",
    customerName: "Rashmi Verma",
    customerAvatar: "https://images.unsplash.com/photo-1464863979621-258859e62245?w=100&q=80",
    rating: 4,
    comment: "Sunita did an amazing keratin treatment. My hair has never been this manageable! She was very professional and explained each step. Minor scheduling hiccup but overall 10/10.",
    service: "Keratin Hair Treatment",
    date: "Feb 8, 2026",
    professionalName: "Sunita Reddy",
  },
  {
    id: "r7",
    customerName: "Anjali Singh",
    customerAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
    rating: 5,
    comment: "Booked for my mother's birthday — she was so happy! The senior care package was gentle, professional, and absolutely worth it. Will book every month!",
    service: "Senior Facial Care",
    date: "Mar 2, 2026",
    professionalName: "Priya Sharma",
  },
  {
    id: "r8",
    customerName: "Kavya Menon",
    customerAvatar: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=100&q=80",
    rating: 5,
    comment: "The bridal mehendi was absolutely stunning! My hands looked like a work of art. All my wedding guests were amazed. 100% recommend for brides!",
    service: "Bridal Mehendi",
    date: "Feb 22, 2026",
    professionalName: "Fatima Shaikh",
  },
];

// ============================================================
// STATS
// ============================================================
export const STATS = [
  { label: "Happy Customers", value: "50,000+", icon: "😊" },
  { label: "Verified Professionals", value: "2,500+", icon: "⭐" },
  { label: "Cities Covered", value: "35+", icon: "📍" },
  { label: "Services Offered", value: "200+", icon: "💅" },
];

// ============================================================
// HOW IT WORKS
// ============================================================
export const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Choose Your Service",
    desc: "Browse 200+ premium beauty services from facials to full bridal packages.",
    icon: "🔍",
    color: "from-rose-400 to-pink-600",
  },
  {
    step: "02",
    title: "Pick a Professional",
    desc: "Select from verified, top-rated beauty experts near your location.",
    icon: "👩‍💼",
    color: "from-violet-500 to-purple-700",
  },
  {
    step: "03",
    title: "Relax at Home",
    desc: "Your expert arrives on time with all professional equipment. You just enjoy!",
    icon: "✨",
    color: "from-amber-400 to-orange-500",
  },
];

// ============================================================
// ADMIN STATS
// ============================================================
export const ADMIN_STATS = {
  totalUsers: 52847,
  totalPros: 2614,
  totalBookings: 184231,
  todayBookings: 347,
  totalRevenue: 28945600,
  monthRevenue: 3241800,
  pendingApprovals: 23,
  activeDisputes: 4,
};

// ============================================================
// CUSTOMER BOOKINGS
// ============================================================
export const CUSTOMER_BOOKINGS: Booking[] = [
  {
    id: "b1",
    service: "Luxury Facial Treatment",
    professional: "Deepa Menon",
    professionalAvatar: "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=100&q=80",
    date: "Aug 10, 2026",
    time: "11:00 AM",
    status: "confirmed",
    price: 1499,
    duration: 60,
  },
  {
    id: "b2",
    service: "Thai Body Massage",
    professional: "Priya Sharma",
    professionalAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?w=100&q=80",
    date: "Jul 28, 2026",
    time: "3:00 PM",
    status: "completed",
    price: 1899,
    duration: 90,
  },
  {
    id: "b3",
    service: "3D Nail Art Design",
    professional: "Meera Patel",
    professionalAvatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&q=80",
    date: "Aug 15, 2026",
    time: "2:00 PM",
    status: "pending",
    price: 899,
    duration: 60,
  },
];

// ============================================================
// PRO BOOKINGS (professional's view)
// ============================================================
export const PRO_BOOKINGS: Booking[] = [
  {
    id: "pb1",
    service: "Luxury Facial Treatment",
    professional: "Ritika Agarwal",
    professionalAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
    date: "Aug 5, 2026",
    time: "10:00 AM",
    status: "confirmed",
    price: 1499,
    duration: 60,
  },
  {
    id: "pb2",
    service: "Anti-Aging Treatment",
    professional: "Sonia Mehta",
    professionalAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    date: "Aug 5, 2026",
    time: "1:00 PM",
    status: "confirmed",
    price: 2199,
    duration: 75,
  },
  {
    id: "pb3",
    service: "Chemical Peel",
    professional: "Neha Joshi",
    professionalAvatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&q=80",
    date: "Aug 7, 2026",
    time: "11:30 AM",
    status: "pending",
    price: 1899,
    duration: 60,
  },
];

// ============================================================
// WEDDING PACKAGES
// ============================================================
export type WeddingPackage = {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  duration: string;
  services: string[];
  badge?: string;
  popular?: boolean;
};

export const WEDDING_PACKAGES: WeddingPackage[] = [
  {
    id: "w1",
    name: "Royal Bridal Package",
    price: 24999,
    originalPrice: 32000,
    duration: "Full Day",
    badge: "Most Popular",
    popular: true,
    services: [
      "Bridal Makeup (HD/Airbrush)",
      "Bridal Hair Styling",
      "Saree Draping",
      "Bridal Mehendi (Full Hands)",
      "Nail Art (Hands + Feet)",
      "Pre-Bridal Facial",
      "Threading & Waxing",
    ],
  },
  {
    id: "w2",
    name: "Bride + Groom Combo",
    price: 34999,
    originalPrice: 44000,
    duration: "Full Day",
    badge: "Best Value",
    services: [
      "Bridal Makeup & Hair",
      "Groom Grooming (Facial + Hair + Beard)",
      "Bridal Mehendi",
      "Nail Art",
      "Saree Draping",
      "Pre-Wedding Spa for Both",
    ],
  },
  {
    id: "w3",
    name: "Engagement Package",
    price: 12999,
    originalPrice: 17000,
    duration: "Half Day",
    services: [
      "Engagement Makeup",
      "Hair Styling",
      "Mehendi (Small Design)",
      "Nail Art",
      "Threading & Cleanup",
    ],
  },
  {
    id: "w4",
    name: "Haldi & Reception Combo",
    price: 18999,
    originalPrice: 24000,
    duration: "2 Days",
    services: [
      "Haldi Makeup (Natural Look)",
      "Reception Glam Makeup",
      "Hair Styling (Both Days)",
      "Nail Art",
      "Full Body Waxing",
    ],
  },
];

export const WEDDING_SERVICES = [
  { icon: "👰", name: "Bridal Makeup", price: "₹4,999+" },
  { icon: "🤵", name: "Groom Grooming", price: "₹1,999+" },
  { icon: "💇‍♀️", name: "Bridal Hair Styling", price: "₹2,499+" },
  { icon: "🥻", name: "Saree Draping", price: "₹999+" },
  { icon: "💎", name: "Jewellery Setting", price: "₹499+" },
  { icon: "🌿", name: "Mehendi", price: "₹1,499+" },
  { icon: "💅", name: "Nail Art", price: "₹899+" },
  { icon: "✨", name: "Reception Makeup", price: "₹3,999+" },
  { icon: "🌸", name: "Haldi Makeup", price: "₹2,499+" },
  { icon: "💍", name: "Engagement Makeup", price: "₹3,499+" },
];

// ============================================================
// MEHENDI ARTISTS
// ============================================================
export type MehendiArtist = {
  id: string;
  name: string;
  avatar: string;
  speciality: string;
  rating: number;
  reviewCount: number;
  location: string;
  experience: number;
  price: number;
  badge?: string;
  portfolio: string[];
  styles: string[];
};

export const MEHENDI_ARTISTS: MehendiArtist[] = [
  {
    id: "m1",
    name: "Fatima Shaikh",
    avatar: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=300&q=80",
    speciality: "Bridal & Arabic Mehendi",
    rating: 4.9,
    reviewCount: 412,
    location: "Juhu, Mumbai",
    experience: 10,
    price: 2999,
    badge: "Top Artist",
    styles: ["Bridal", "Arabic", "Rajasthani", "Engagement"],
    portfolio: [
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=80",
      "https://images.unsplash.com/photo-1519671282429-b8d9e9cd5e1f?w=400&q=80",
    ],
  },
  {
    id: "m2",
    name: "Zara Khan",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80",
    speciality: "Rajasthani & Festival Mehendi",
    rating: 4.8,
    reviewCount: 287,
    location: "Jaipur & Delhi NCR",
    experience: 7,
    price: 1999,
    badge: "Trending",
    styles: ["Rajasthani", "Festival", "Kids", "Traditional"],
    portfolio: [
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400&q=80",
    ],
  },
  {
    id: "m3",
    name: "Preethi Reddy",
    avatar: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=300&q=80",
    speciality: "Indo-Western & Minimalist",
    rating: 4.7,
    reviewCount: 198,
    location: "Koramangala, Bangalore",
    experience: 5,
    price: 1499,
    styles: ["Indo-Western", "Minimalist", "Arabic", "Engagement"],
    portfolio: [
      "https://images.unsplash.com/photo-1519671282429-b8d9e9cd5e1f?w=400&q=80",
    ],
  },
];

export const MEHENDI_STYLES = [
  { icon: "👰", name: "Bridal Mehendi", desc: "Full hands & feet for the big day", price: "₹2,999+" },
  { icon: "🌙", name: "Arabic Mehendi", desc: "Bold floral & geometric patterns", price: "₹1,499+" },
  { icon: "🏰", name: "Rajasthani Mehendi", desc: "Traditional detailed artwork", price: "₹1,999+" },
  { icon: "🎉", name: "Festival Mehendi", desc: "Quick, vibrant festival designs", price: "₹799+" },
  { icon: "👶", name: "Kids Mehendi", desc: "Fun, safe designs for little ones", price: "₹399+" },
  { icon: "💍", name: "Engagement Mehendi", desc: "Romantic patterns for your special day", price: "₹1,999+" },
];

// ============================================================
// ELDER CARE SERVICES
// ============================================================
export const ELDER_SERVICES = [
  { icon: "✂️", name: "Gentle Haircut", price: 399, desc: "Soft, comfortable haircut at home" },
  { icon: "🎨", name: "Hair Color", price: 799, desc: "Safe, ammonia-free coloring" },
  { icon: "🪒", name: "Beard Trim", price: 299, desc: "Clean beard grooming for men" },
  { icon: "✨", name: "Soothing Facial", price: 999, desc: "Gentle facial for mature skin" },
  { icon: "💅", name: "Nail Care", price: 499, desc: "Careful nail trimming & care" },
  { icon: "🧖", name: "Head Massage", price: 699, desc: "Relaxing oil massage therapy" },
];

export const ELDER_TRUST_POINTS = [
  "Specially trained for senior care",
  "Gentle, hypoallergenic products",
  "No rush — all the time they need",
  "Female professionals for ladies",
  "Wheelchair-friendly service",
  "Family can be present",
];

// ============================================================
// KIDS GROOMING
// ============================================================
export const KIDS_SERVICES = [
  { icon: "✂️", name: "Kids Haircut", price: 299, desc: "Fun, friendly haircut for kids 2-15 yrs" },
  { icon: "👶", name: "Baby Grooming", price: 499, desc: "Safe first haircut & grooming for infants" },
  { icon: "💅", name: "Kids Nail Art", price: 199, desc: "Fun nail designs kids love" },
  { icon: "🧖", name: "Kids Head Spa", price: 399, desc: "Nourishing scalp care for children" },
  { icon: "🌿", name: "Kids Mehendi", price: 199, desc: "Safe, natural mehendi for kids" },
  { icon: "🛁", name: "Baby Massage", price: 599, desc: "Certified baby massage therapy" },
];

export const KIDS_TRUST_POINTS = [
  "100% safe, baby-grade products",
  "Background-checked professionals",
  "Certified child-friendly training",
  "Parents welcome to stay",
  "Fun, stress-free experience",
];

// ============================================================
// FESTIVAL PACKAGES
// ============================================================
export type FestivalPackage = {
  id: string;
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  price: number;
  services: string[];
  month: string;
};

export const FESTIVAL_PACKAGES: FestivalPackage[] = [
  {
    id: "f1",
    name: "Diwali Glow Package",
    icon: "🪔",
    color: "#d97706",
    bgColor: "#fef3c7",
    price: 2999,
    month: "Oct–Nov",
    services: ["Full Body Waxing", "Luxury Facial", "Nail Art", "Mehendi"],
  },
  {
    id: "f2",
    name: "Karwa Chauth Special",
    icon: "🌙",
    color: "#7c3aed",
    bgColor: "#ede9fe",
    price: 3499,
    month: "October",
    services: ["Bridal Mehendi", "Party Makeup", "Hair Styling", "Saree Draping"],
  },
  {
    id: "f3",
    name: "Eid Glam Package",
    icon: "🌙",
    color: "#059669",
    bgColor: "#d1fae5",
    price: 2499,
    month: "March/April",
    services: ["Arabic Mehendi", "Salon Makeup", "Hair Treatment", "Nail Art"],
  },
  {
    id: "f4",
    name: "Navratri Beauty",
    icon: "🎉",
    color: "#e11d48",
    bgColor: "#fce7f3",
    price: 1999,
    month: "September/October",
    services: ["Garba Makeup", "Hair Styling", "Nail Art", "Threading"],
  },
  {
    id: "f5",
    name: "Christmas Glow",
    icon: "🎄",
    color: "#dc2626",
    bgColor: "#fee2e2",
    price: 2999,
    month: "December",
    services: ["Party Makeup", "Hair Blowout", "Nail Art", "Body Polishing"],
  },
  {
    id: "f6",
    name: "Ganesh Festival Look",
    icon: "🐘",
    color: "#ea580c",
    bgColor: "#ffedd5",
    price: 1799,
    month: "August/September",
    services: ["Traditional Makeup", "Hair Styling", "Mehendi", "Bangles Ceremony Prep"],
  },
];

// ============================================================
// GROUP BOOKING OPTIONS
// ============================================================
export const GROUP_PACKAGES = [
  {
    id: "g1",
    icon: "👰🤵",
    name: "Bride + Groom",
    desc: "Complete grooming for both on your special day",
    services: ["Bridal Makeup", "Groom Grooming", "Hair Styling"],
    savings: "Save ₹3,000",
    price: 18999,
    badge: "Wedding Special",
    color: "#e11d48",
  },
  {
    id: "g2",
    icon: "👨‍👩‍👧‍👦",
    name: "Family Package",
    desc: "Beauty for the whole family in one booking",
    services: ["Makeup for 3+", "Hair Styling", "Kids Grooming"],
    savings: "Save ₹2,000",
    price: 7999,
    badge: "Best Value",
    color: "#7c3aed",
  },
  {
    id: "g3",
    icon: "👴👵",
    name: "Parents Special",
    desc: "Premium care for your loving parents",
    services: ["Senior Facial", "Hair Care", "Nail Care"],
    savings: "Save ₹1,000",
    price: 2999,
    badge: "Senior Care",
    color: "#059669",
  },
  {
    id: "g4",
    icon: "👯‍♀️",
    name: "Friends' Pamper",
    desc: "Girl squad beauty session for 3-5 friends",
    services: ["Nail Art", "Facials", "Makeup"],
    savings: "Save ₹1,500",
    price: 5999,
    badge: "Squad Goals",
    color: "#db2777",
  },
];

// ============================================================
// TRUST POINTS
// ============================================================
export const TRUST_POINTS = [
  {
    icon: "🏅",
    title: "Verified Professionals",
    desc: "Every professional undergoes ID verification, skill tests & background checks",
    color: "#e11d48",
  },
  {
    icon: "🔍",
    title: "Background Checked",
    desc: "Police verification & reference checks for all service providers",
    color: "#7c3aed",
  },
  {
    icon: "🧼",
    title: "Sanitized Equipment",
    desc: "All tools are sterilized before every appointment — salon hygiene at home",
    color: "#0ea5e9",
  },
  {
    icon: "🔒",
    title: "Secure Payments",
    desc: "Pay securely via UPI, card, or wallet. 100% refund guarantee",
    color: "#059669",
  },
  {
    icon: "💬",
    title: "24/7 Support",
    desc: "Our care team is available round the clock via chat, call, or email",
    color: "#d97706",
  },
  {
    icon: "⭐",
    title: "Satisfaction Guarantee",
    desc: "Not happy? We'll redo the service for free or give a full refund",
    color: "#db2777",
  },
];

// ============================================================
// BECOME A PRO — TYPES & BENEFITS
// ============================================================
export const PRO_TYPES = [
  { id: "salon", icon: "💈", name: "Salon Owner", desc: "Register your salon & expand online" },
  { id: "parlour", icon: "💅", name: "Parlour", desc: "Beauty parlour looking for more clients" },
  { id: "freelance", icon: "🧴", name: "Freelance Beautician", desc: "Independent beauty expert" },
  { id: "mua", icon: "💄", name: "Makeup Artist", desc: "MUA for weddings, parties & events" },
  { id: "mehendi", icon: "🌿", name: "Mehendi Artist", desc: "Traditional & modern henna designs" },
  { id: "hair", icon: "💇", name: "Hair Stylist", desc: "Cuts, color, keratin & more" },
  { id: "nail", icon: "✨", name: "Nail Artist", desc: "Nail art, gel, extensions & more" },
];

export const PRO_BENEFITS = [
  { icon: "⏰", title: "Flexible Hours", desc: "Work when YOU want, no fixed shifts" },
  { icon: "👥", title: "More Customers", desc: "Access 50,000+ customers from Day 1" },
  { icon: "✅", title: "Verified Profile", desc: "Build credibility with our verified badge" },
  { icon: "💰", title: "Higher Income", desc: "Earn 30–50% more than traditional salons" },
  { icon: "📱", title: "Online Bookings", desc: "Automated bookings, reminders & payments" },
  { icon: "📊", title: "Growth Tools", desc: "Analytics, reviews & portfolio management" },
];

// ============================================================
// QUICK FILTERS
// ============================================================
export const QUICK_FILTERS = [
  { id: "top-rated", label: "⭐ Top Rated" },
  { id: "lowest-price", label: "💰 Lowest Price" },
  { id: "nearest", label: "📍 Nearest" },
  { id: "fast-arrival", label: "⚡ Fast Arrival" },
  { id: "female-pro", label: "👩 Female Pro" },
  { id: "male-pro", label: "👨 Male Pro" },
  { id: "bridal", label: "👰 Bridal Specialist" },
  { id: "mehendi", label: "🌿 Mehendi Artist" },
  { id: "kids", label: "👶 Kids Specialist" },
  { id: "senior", label: "🧓 Senior Care" },
];
