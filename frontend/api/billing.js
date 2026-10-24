import { getCollection } from '../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const collection = await getCollection('billing');

    if (req.method === 'GET') {
      const records = await collection.find({}).sort({ created_at: -1 }).toArray();
      return res.status(200).json({ success: true, data: records });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const count = await collection.countDocuments();
      const invoiceNumber = body.invoice_number || `INV-26-${String(count + 101).padStart(4, '0')}`;

      const billingRecord = {
        ...body,
        invoice_number: invoiceNumber,
        created_at: body.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await collection.insertOne(billingRecord);
      return res.status(201).json({ success: true, data: billingRecord });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('API /billing error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
