import {
  getStoredConfig,
  testGatewayConnection,
  sendTemplateMessage,
  sendReportMessage,
  sendReviewInviteMessage,
  getRecentLogs,
} from '../../../lib/whatsappService.js';
import { getCollection } from '../../../lib/db.js';

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

  // Determine action from query or URL
  const action = req.query.action || req.url.split('?')[0].split('/').pop();

  try {
    switch (action) {
      case 'config': {
        if (req.method === 'GET') {
          const cfg = await getStoredConfig();
          return res.status(200).json({ success: true, data: cfg });
        }
        if (req.method === 'POST') {
          const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
          const settingsCol = await getCollection('settings');
          await settingsCol.updateOne(
            { key: 'clinic_profile' },
            { $set: { 'value.whatsappConfig': body, updated_at: new Date().toISOString() } },
            { upsert: true }
          );
          return res.status(200).json({ success: true, message: 'WhatsApp configuration updated', data: body });
        }
        return res.status(405).json({ success: false, message: 'Method Not Allowed' });
      }

      case 'test-connection': {
        const result = await testGatewayConnection();
        return res.status(200).json(result);
      }

      case 'send-template': {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const result = await sendTemplateMessage(body || {});
        return res.status(200).json(result);
      }

      case 'send-report': {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const result = await sendReportMessage(body || {});
        return res.status(200).json(result);
      }

      case 'send-review-invite': {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const result = await sendReviewInviteMessage(body || {});
        return res.status(200).json(result);
      }

      case 'sync-patient': {
        const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
        const patientsCol = await getCollection('patients');
        if (body.uhid || body.phone) {
          await patientsCol.updateOne(
            { $or: [{ uhid: body.uhid || '' }, { phone: body.phone || '' }] },
            { $set: { ...body, updated_at: new Date().toISOString() } },
            { upsert: true }
          );
        }
        return res.status(200).json({ success: true, message: 'Patient synced with WhatsApp CRM' });
      }

      case 'logs': {
        const limit = parseInt(req.query.limit || '30', 10);
        const logs = await getRecentLogs(limit);
        return res.status(200).json({ success: true, data: logs });
      }

      default: {
        return res.status(404).json({ success: false, message: `Unknown WhatsApp action: ${action}` });
      }
    }
  } catch (error) {
    console.error(`API /whatsapp/${action} error:`, error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
