import type { Handler } from '@netlify/functions';
import { connectDB } from '../../src/lib/mongodb';
import Order from '../../src/lib/models/Order';

export const handler: Handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers, body: '' };

  try {
    await connectDB();

    if (event.httpMethod === 'POST') {
      const body = JSON.parse(event.body || '{}');
      const order = await Order.create(body);
      return { statusCode: 201, headers, body: JSON.stringify(order) };
    }

    if (event.httpMethod === 'GET') {
      const orderId = event.queryStringParameters?.orderId;
      if (!orderId) return { statusCode: 400, headers, body: JSON.stringify({ error: 'orderId required' }) };
      const order = await Order.findOne({ orderId }).lean();
      if (!order) return { statusCode: 404, headers, body: JSON.stringify({ error: 'Not found' }) };
      return { statusCode: 200, headers, body: JSON.stringify(order) };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  } catch (err: any) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
