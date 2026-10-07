import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongodb';
import SiteContent from '../../src/lib/models/SiteContent';
import { DEFAULT_SITE_CONTENT } from '../../src/site-content-defaults';

const headers = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
};

function isAuthorized(event: Parameters<Handler>[0]): boolean {
  const auth = event.headers['authorization'] || event.headers['Authorization'];
  return auth === `Bearer ${process.env.ADMIN_SECRET}`;
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };
  if (!isAuthorized(event)) return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };

  try {
    await connectDB();
    const method = event.httpMethod;
    const action = event.queryStringParameters?.action;

    if (action === 'reset') {
      await SiteContent.deleteOne({ key: 'current' });
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, message: 'Reset to defaults', content: DEFAULT_SITE_CONTENT }),
      };
    }

    if (method === 'GET') {
      const doc = await SiteContent.findOne({ key: 'current' }).lean();
      return { statusCode: 200, headers, body: JSON.stringify(doc || DEFAULT_SITE_CONTENT) };
    }

    if (method === 'PUT' || method === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const updated = await SiteContent.findOneAndUpdate(
        { key: 'current' },
        {
          key: 'current',
          announcement: body.announcement,
          hero: body.hero,
          features: body.features,
          locationBanners: body.locationBanners,
          contact: body.contact,
          social: body.social,
          footerBio: body.footerBio,
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      ).lean();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, content: updated }),
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
