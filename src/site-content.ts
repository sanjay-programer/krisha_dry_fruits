import { useState, useEffect } from 'react';

export interface FeatureItem {
  id: string;
  iconName: 'Leaf' | 'Award' | 'Truck' | 'ShieldCheck' | 'Heart' | 'Clock' | 'Check';
  title: string;
  subtitle: string;
}

export interface LocationBanner {
  id: string;
  tag: string;
  locationKey: string;
  title: string;
  subtitle: string;
  image: string;
  linkText: string;
}

export interface HeroContent {
  badge: string;
  titleLine1: string;
  titleLine2: string;
  titleHighlight: string;
  subtitle: string;
  buttonText: string;
  image: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
  fssaiNumber: string;
  fssaiText: string;
}

export interface SocialLinks {
  facebook: string;
  instagram: string;
  twitter: string;
  whatsapp: string;
}

export interface SiteContent {
  announcement: string;
  hero: HeroContent;
  features: FeatureItem[];
  locationBanners: LocationBanner[];
  contact: ContactInfo;
  social: SocialLinks;
  footerBio: string;
}

export const DEFAULT_SITE_CONTENT: SiteContent = {
  announcement: 'Free pan-India shipping over ₹2,000 • Freshly hand-sorted & packed within 48h',
  hero: {
    badge: "India's Premium Cashew Brand",
    titleLine1: 'Cashews,',
    titleLine2: 'crafted to',
    titleHighlight: 'perfection.',
    subtitle: 'From the sun-drenched coast of Goa to your home — hand-sorted, freshly packed, and available in hand-curated premium grades.',
    buttonText: 'Shop Now',
    image: '/hero_cashew_bowl.jpg',
  },
  features: [
    { id: '1', iconName: 'Leaf', title: '100%', subtitle: 'Natural' },
    { id: '2', iconName: 'Award', title: 'Premium', subtitle: 'Quality' },
    { id: '3', iconName: 'Truck', title: 'Pan-India', subtitle: 'Delivery' },
    { id: '4', iconName: 'ShieldCheck', title: 'Trusted by', subtitle: 'Thousands' },
  ],
  locationBanners: [
    {
      id: 'loc-1',
      tag: '100% Sourced in Goa & Karnataka',
      locationKey: 'Goa & Karnataka',
      title: 'Explore Entire Premium Collection',
      subtitle: 'Sun-dried along the Konkan & Malabar coastline with rich natural buttery sweetness',
      image: '/hero_cashew_bowl.jpg',
      linkText: 'View All Cashews',
    },
    {
      id: 'loc-2',
      tag: 'Goa Coastal Heritage Belt',
      locationKey: 'Goa',
      title: 'Margao & Panaji Coastal Groves',
      subtitle: 'Artisanal harvesting from certified generational family farms along the Arabian Sea',
      image: '/hero_cashew_bowl.jpg',
      linkText: 'Explore Goa Harvest',
    },
    {
      id: 'loc-3',
      tag: 'Karnataka Malnad Foothills',
      locationKey: 'Karnataka',
      title: 'Jumbo W180 King Cashews',
      subtitle: 'Hand-picked mammoth kernels with delicate crunch and naturally high nutrient profile',
      image: '/hero_cashew_bowl.jpg',
      linkText: 'Discover W180 Grade',
    },
  ],
  contact: {
    phone: '+91 98765 43210',
    email: 'care@krishadryfruits.in',
    address: '123 Plantation Road, Margao, Goa 403601, India',
    hours: 'Mon - Sat: 9:00 AM - 7:00 PM',
    fssaiNumber: '10020021000123',
    fssaiText: 'FSSAI Certified Unit • Govt. Registered Premium Agri-Produce Facility',
  },
  social: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
    whatsapp: 'https://wa.me/919876543210',
  },
  footerBio:
    'Connoisseur cashews directly sourced from certified multi-generation family farms along the Goa and Karnataka coastal belt. Freshly packed within 48 hours of artisanal processing.',
};

const STORAGE_KEY = 'kdf_site_content_v2';
const EVENT_NAME = 'kdf_site_content_change';

export function getSiteContent(): SiteContent {
  if (typeof window === 'undefined') return DEFAULT_SITE_CONTENT;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_CONTENT;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SITE_CONTENT,
      ...parsed,
      hero: { ...DEFAULT_SITE_CONTENT.hero, ...(parsed.hero || {}) },
      contact: { ...DEFAULT_SITE_CONTENT.contact, ...(parsed.contact || {}) },
      social: { ...DEFAULT_SITE_CONTENT.social, ...(parsed.social || {}) },
      features: Array.isArray(parsed.features) && parsed.features.length > 0 ? parsed.features : DEFAULT_SITE_CONTENT.features,
      locationBanners: Array.isArray(parsed.locationBanners) && parsed.locationBanners.length > 0 ? parsed.locationBanners : DEFAULT_SITE_CONTENT.locationBanners,
    };
  } catch {
    return DEFAULT_SITE_CONTENT;
  }
}

export function saveSiteContent(content: SiteContent): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: content }));
  } catch (err) {
    console.error('Failed to save site content to localStorage', err);
  }
}

export function resetSiteContent(): SiteContent {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_SITE_CONTENT }));
  } catch (err) {
    console.error('Failed to reset site content', err);
  }
  return DEFAULT_SITE_CONTENT;
}

export function useSiteContent(): SiteContent {
  const [content, setContent] = useState<SiteContent>(getSiteContent);

  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<SiteContent>;
      if (customEvent.detail) {
        setContent(customEvent.detail);
      } else {
        setContent(getSiteContent());
      }
    };
    window.addEventListener(EVENT_NAME, handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener(EVENT_NAME, handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  return content;
}
