import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongodb';
import SiteContent from '../../src/lib/models/SiteContent';
import { DEFAULT_SITE_CONTENT } from '../../src/site-content-defaults';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    await connectDB();
    const doc = await SiteContent.findOne({ key: 'current' }).lean();

    if (!doc) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(DEFAULT_SITE_CONTENT),
      };
    }

    // Merge with DEFAULT_SITE_CONTENT to guarantee all fields exist
    const merged = {
      ...DEFAULT_SITE_CONTENT,
      announcement: doc.announcement ?? DEFAULT_SITE_CONTENT.announcement,
      hero: { ...DEFAULT_SITE_CONTENT.hero, ...(doc.hero || {}) },
      features: Array.isArray(doc.features) && doc.features.length > 0 ? doc.features : DEFAULT_SITE_CONTENT.features,
      locationBanners: Array.isArray(doc.locationBanners) && doc.locationBanners.length > 0 ? doc.locationBanners : DEFAULT_SITE_CONTENT.locationBanners,
      contact: { ...DEFAULT_SITE_CONTENT.contact, ...(doc.contact || {}) },
      social: { ...DEFAULT_SITE_CONTENT.social, ...(doc.social || {}) },
      footerBio: doc.footerBio ?? DEFAULT_SITE_CONTENT.footerBio,
    };

    return { statusCode: 200, headers, body: JSON.stringify(merged) };
  } catch (err: any) {
    // If DB is unreachable or timing out, gracefully return default content without breaking frontend
    return { statusCode: 200, headers, body: JSON.stringify(DEFAULT_SITE_CONTENT) };
  }
};
