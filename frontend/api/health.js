import { getDb } from './lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const db = await getDb();
    const ping = await db.command({ ping: 1 });
    const collections = await db.listCollections().toArray();
    const vaaniCollections = collections
      .map((c) => c.name)
      .filter((name) => name.startsWith('vaani_'));

    return res.status(200).json({
      status: 'healthy',
      database: 'ba_mc_erp',
      connected: ping.ok === 1,
      vaani_collections: vaaniCollections,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({
      status: 'unhealthy',
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
}
