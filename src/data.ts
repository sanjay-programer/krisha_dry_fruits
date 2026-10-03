import type { Product, CashewGrade, StandardCashewGrade, CashewType, Quantity } from './types';

// Pexels image URLs (verified, real, on-topic)
const IMG = {
  rawBowl: 'https://images.pexels.com/photos/36631827/pexels-photo-36631827.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  rawBoard: 'https://images.pexels.com/photos/4499222/pexels-photo-4499222.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  rawGlass: 'https://images.pexels.com/photos/9017852/pexels-photo-9017852.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  rawOrange: 'https://images.pexels.com/photos/12326584/pexels-photo-12326584.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  rawPorcelain: 'https://images.pexels.com/photos/18876242/pexels-photo-18876242.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  rawBlack: 'https://images.pexels.com/photos/6803749/pexels-photo-6803749.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  rawClose: 'https://images.pexels.com/photos/5472144/pexels-photo-5472144.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  rawAssorted: 'https://images.pexels.com/photos/5202113/pexels-photo-5202113.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  roastedTray: 'https://images.pexels.com/photos/6730156/pexels-photo-6730156.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  roastedPaper: 'https://images.pexels.com/photos/19052912/pexels-photo-19052912.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  roastedClose: 'https://images.pexels.com/photos/18876240/pexels-photo-18876240.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  roastedSunlit: 'https://images.pexels.com/photos/32175377/pexels-photo-32175377.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  roastedMarket: 'https://images.pexels.com/photos/29060103/pexels-photo-29060103.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  roastedTexture: 'https://images.pexels.com/photos/4663476/pexels-photo-4663476.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  mixedNuts: 'https://images.pexels.com/photos/9615877/pexels-photo-9615877.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  mixedOrnate: 'https://images.pexels.com/photos/9615878/pexels-photo-9615878.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  handBowl: 'https://images.pexels.com/photos/13682249/pexels-photo-13682249.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  assortedNuts: 'https://images.pexels.com/photos/5425013/pexels-photo-5425013.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  marketDisplay: 'https://images.pexels.com/photos/33315987/pexels-photo-33315987.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  dryFruitsMarket: 'https://images.pexels.com/photos/11135641/pexels-photo-11135641.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
  nutsTray: 'https://images.pexels.com/photos/30308595/pexels-photo-30308595.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
};

const QUANTITIES: Quantity[] = ['250g', '500g', '1kg', '2kg', '5kg'];

// Base price per kg for each grade (higher grade number = larger nut = higher price)
const GRADE_BASE_PRICE: Record<StandardCashewGrade, number> = {
  W180: 1280,
  W210: 1080,
  W240: 880,
  W320: 720,
  W450: 580,
};

// Price multiplier per type
const TYPE_MULTIPLIER: Record<CashewType, number> = {
  'Raw': 1.0,
  'Roasted': 1.15,
  'Roasted & Salted': 1.18,
  'Spiced': 1.22,
  'Honey Glazed': 1.28,
};

// Weight in kg for each quantity option
const WEIGHT_KG: Record<Quantity, number> = {
  '250g': 0.25,
  '500g': 0.5,
  '1kg': 1.0,
  '2kg': 2.0,
  '5kg': 5.0,
};

// Bulk discount for larger quantities
const BULK_DISCOUNT: Record<Quantity, number> = {
  '250g': 1.0,
  '500g': 0.97,
  '1kg': 0.93,
  '2kg': 0.88,
  '5kg': 0.82,
};

function roundToTen(n: number): number {
  return Math.round(n / 10) * 10;
}

function buildPrices(grade: StandardCashewGrade, type: CashewType): { quantity: Quantity; price: number }[] {
  const base = GRADE_BASE_PRICE[grade];
  const mult = TYPE_MULTIPLIER[type];
  return QUANTITIES.map((q) => {
    const raw = base * mult * WEIGHT_KG[q] * BULK_DISCOUNT[q];
    return { quantity: q, price: roundToTen(raw) };
  });
}

const TYPE_INFO: Record<CashewType, { description: string; image: string }> = {
  'Raw': {
    description: 'Unroasted, natural cashews straight from the shell. Creamy and mild — perfect for cooking, baking, or blending into your own recipes.',
    image: IMG.rawBowl,
  },
  'Roasted': {
    description: 'Slow-roasted to a golden crisp with no added oil or salt. Deep, nutty aroma with a satisfying crunch in every bite.',
    image: IMG.roastedTray,
  },
  'Roasted & Salted': {
    description: 'Golden-roasted cashews lightly dusted with sea salt. The classic snack — savoury, crunchy, and impossible to stop at one.',
    image: IMG.roastedClose,
  },
  'Spiced': {
    description: 'Roasted with a blend of black pepper, paprika, and roasted cumin. A bold, savoury kick inspired by Indian street flavours.',
    image: IMG.roastedMarket,
  },
  'Honey Glazed': {
    description: 'Coated in pure honey and lightly toasted for a glossy, golden finish. A delicate balance of sweet and nutty — our most indulgent variety.',
    image: IMG.roastedTexture,
  },
};

const GRADE_INFO: Record<StandardCashewGrade, { name: string; tagline: string; description: string; gradeDescription: string; badge: string; image: string; gallery: string[] }> = {
  W180: {
    name: 'Jumbo King W180',
    tagline: 'The largest, most exclusive cashew grade',
    description: 'Our flagship grade — only the biggest, most uniform cashews make the W180 cut. A true connoisseur\'s choice.',
    gradeDescription: 'Approximately 180 cashews per pound. Extra-large, plump, and visually striking — the rarest grade we offer.',
    badge: 'Premium',
    image: IMG.rawBoard,
    gallery: [IMG.rawBoard, IMG.rawClose, IMG.mixedOrnate, IMG.handBowl],
  },
  W210: {
    name: 'Jumbo W210',
    tagline: 'Large, impressive, and full of flavour',
    description: 'Substantial nuts with a satisfying bite. Ideal for gifting or serving at gatherings where presentation matters.',
    gradeDescription: 'Approximately 210 cashews per pound. Large, elegant, and consistently sized.',
    badge: 'Choice',
    image: IMG.rawGlass,
    gallery: [IMG.rawGlass, IMG.rawPorcelain, IMG.rawAssorted, IMG.mixedNuts],
  },
  W240: {
    name: 'Standard W240',
    tagline: 'The everyday premium — balanced size and value',
    description: 'Our most popular grade. Perfectly proportioned cashews that deliver on both taste and value.',
    gradeDescription: 'Approximately 240 cashews per pound. The benchmark grade — great size, great price.',
    badge: 'Bestseller',
    image: IMG.rawOrange,
    gallery: [IMG.rawOrange, IMG.rawBlack, IMG.rawBowl, IMG.nutsTray],
  },
  W320: {
    name: 'Select W320',
    tagline: 'Medium grade, big on flavour',
    description: 'Slightly smaller but every bit as delicious. A versatile, everyday cashew for snacking and cooking alike.',
    gradeDescription: 'Approximately 320 cashews per pound. Medium-sized, uniform, and excellent value.',
    badge: 'Value',
    image: IMG.rawPorcelain,
    gallery: [IMG.rawPorcelain, IMG.rawBowl, IMG.rawClose, IMG.dryFruitsMarket],
  },
  W450: {
    name: 'Economy W450',
    tagline: 'Compact nuts, incredible value',
    description: 'Our most affordable grade. Smaller nuts that are perfect for cooking, baking, and bulk use.',
    gradeDescription: 'Approximately 450 cashews per pound. Small, economical, and ideal for recipes.',
    badge: 'Economy',
    image: IMG.rawBlack,
    gallery: [IMG.rawBlack, IMG.rawBowl, IMG.rawGlass, IMG.marketDisplay],
  },
};

const ALL_TYPES: CashewType[] = ['Raw', 'Roasted', 'Roasted & Salted', 'Spiced', 'Honey Glazed'];

export const PRODUCTS: Product[] = (Object.keys(GRADE_INFO) as StandardCashewGrade[]).map((grade) => {
  const info = GRADE_INFO[grade];
  return {
    id: grade.toLowerCase().replace('w', 'grade-w'),
    grade,
    name: info.name,
    tagline: info.tagline,
    description: info.description,
    longDescription: `${info.description} Sourced directly from certified farms along India\'s western coast, every batch is hand-sorted, quality-checked, and packed in our facility within 48 hours of processing to lock in freshness.`,
    origin:
      grade === 'W180' || grade === 'W240'
        ? 'Goa Coastal Heritage Belt, India'
        : grade === 'W210' || grade === 'W450'
        ? 'Karnataka Malnad Foothills, India'
        : 'Goa & Karnataka Coast, India',
    gradeDescription: info.gradeDescription,
    image: info.image,
    gallery: info.gallery,
    rating: grade === 'W180' ? 4.9 : grade === 'W210' ? 4.8 : grade === 'W240' ? 4.8 : grade === 'W320' ? 4.7 : 4.6,
    reviewCount: grade === 'W240' ? 1247 : grade === 'W320' ? 892 : grade === 'W180' ? 384 : grade === 'W210' ? 567 : 631,
    badge: info.badge,
    types: ALL_TYPES.map((type) => ({
      type,
      description: TYPE_INFO[type].description,
      image: TYPE_INFO[type].image,
      prices: buildPrices(grade, type),
    })),
  };
});

export const GRADES: { grade: CashewGrade; label: string; description: string }[] = [
  { grade: 'W180', label: 'W180 — Jumbo King', description: '180 nuts/lb · Extra-large' },
  { grade: 'W210', label: 'W210 — Jumbo', description: '210 nuts/lb · Large' },
  { grade: 'W240', label: 'W240 — Standard', description: '240 nuts/lb · Medium-large' },
  { grade: 'W320', label: 'W320 — Select', description: '320 nuts/lb · Medium' },
  { grade: 'W450', label: 'W450 — Economy', description: '450 nuts/lb · Small' },
];

export const ALL_TYPES_INFO = ALL_TYPES.map((t) => ({
  type: t,
  description: TYPE_INFO[t].description,
}));

export function formatPrice(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

export function generateOrderId(): string {
  const prefix = 'KDF';
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${num}`;
}

export function getEstimatedDelivery(): string {
  const now = new Date();
  const delivery = new Date(now);
  delivery.setDate(now.getDate() + 4);
  return delivery.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
}
