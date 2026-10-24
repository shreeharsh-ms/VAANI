import { getCollection } from '../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PUT,DELETE');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const collection = await getCollection('blogs');

    if (req.method === 'GET') {
      const { slug, id } = req.query;
      if (slug || id) {
        const query = slug ? { slug } : { id };
        const article = await collection.findOne(query);
        if (!article) {
          return res.status(404).json({ success: false, message: 'Article not found' });
        }
        return res.status(200).json({ success: true, data: article });
      }

      const articles = await collection.find({}).sort({ published_at: -1, created_at: -1 }).toArray();
      return res.status(200).json({ success: true, data: articles });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const article = {
        id: body.id || `blog-${Date.now()}`,
        title: body.title || 'Untitled Article',
        slug: body.slug || (body.title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        excerpt: body.excerpt || '',
        content: body.content || '',
        category: body.category || 'Audiology',
        author: body.author || 'ASLP Palak Paresh Gandhi',
        status: body.status || 'PUBLISHED',
        published_at: body.published_at || new Date().toISOString(),
        created_at: body.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await collection.updateOne({ slug: article.slug }, { $set: article }, { upsert: true });
      return res.status(201).json({ success: true, data: article });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('API /blogs error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
