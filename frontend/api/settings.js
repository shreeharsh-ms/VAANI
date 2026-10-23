import { getCollection } from './lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,PATCH');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const collection = await getCollection('settings');

    if (req.method === 'GET') {
      const settings = await collection.findOne({ key: 'clinic_profile' });
      return res.status(200).json({
        success: true,
        data: settings?.value || null,
      });
    }

    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const existing = await collection.findOne({ key: 'clinic_profile' });
      const mergedValue = existing?.value ? { ...existing.value, ...body } : body;

      const settingsPayload = {
        key: 'clinic_profile',
        value: mergedValue,
        updated_at: new Date().toISOString(),
      };

      await collection.updateOne(
        { key: 'clinic_profile' },
        { $set: settingsPayload },
        { upsert: true }
      );

      return res.status(200).json({
        success: true,
        message: 'Clinic settings updated in MongoDB',
        data: mergedValue,
      });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('API /settings error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
