import { useState, useEffect } from 'react';
export * from './site-content-defaults';
import {
  DEFAULT_SITE_CONTENT,
  type SiteContent,
  type ContactInfo,
} from './site-content-defaults';

const STORAGE_KEY = 'kdf_site_content_v2';
const EVENT_NAME = 'kdf_site_content_change';

export function getStoreGoogleMapsUrl(contact?: Partial<ContactInfo> | null): string {
  if (contact?.latitude && contact?.longitude && !isNaN(Number(contact.latitude)) && !isNaN(Number(contact.longitude))) {
    return `https://www.google.com/maps?q=${contact.latitude.trim()},${contact.longitude.trim()}`;
  }
  if (contact?.googleMapsUrl && contact.googleMapsUrl.trim().startsWith('http')) {
    return contact.googleMapsUrl.trim();
  }
  const query = [contact?.shopName || 'Krisha Dry Fruits', contact?.address || 'Margao, Goa', contact?.landmark]
    .filter(Boolean)
    .join(', ');
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

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

export function syncWithServerContent(serverData: Partial<SiteContent> | null | undefined): SiteContent {
  if (!serverData) return getSiteContent();
  const merged: SiteContent = {
    ...DEFAULT_SITE_CONTENT,
    ...serverData,
    hero: { ...DEFAULT_SITE_CONTENT.hero, ...(serverData.hero || {}) },
    contact: { ...DEFAULT_SITE_CONTENT.contact, ...(serverData.contact || {}) },
    social: { ...DEFAULT_SITE_CONTENT.social, ...(serverData.social || {}) },
    features: Array.isArray(serverData.features) && serverData.features.length > 0 ? serverData.features : DEFAULT_SITE_CONTENT.features,
    locationBanners: Array.isArray(serverData.locationBanners) && serverData.locationBanners.length > 0 ? serverData.locationBanners : DEFAULT_SITE_CONTENT.locationBanners,
  };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: merged }));
  } catch (err) {
    console.error('Failed to sync site content to localStorage', err);
  }
  return merged;
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