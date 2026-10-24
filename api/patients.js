import { getCollection } from '../lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const collection = await getCollection('patients');

    if (req.method === 'GET') {
      const { id, uhid, search, service_line, status } = req.query;

      if (id || uhid) {
        const query = id ? { $or: [{ id }, { uhid: id }] } : { uhid };
        const patient = await collection.findOne(query);
        if (!patient) {
          return res.status(404).json({ success: false, message: 'Patient not found' });
        }
        return res.status(200).json({ success: true, data: patient });
      }

      const filter = {};
      if (service_line) filter.service_line = service_line;
      if (status) filter.status = status;
      if (search) {
        const regex = new RegExp(search, 'i');
        filter.$or = [
          { first_name: regex },
          { last_name: regex },
          { full_name: regex },
          { uhid: regex },
          { phone: regex },
        ];
      }

      const patients = await collection.find(filter).sort({ created_at: -1 }).toArray();
      return res.status(200).json({ success: true, data: patients });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const count = await collection.countDocuments();
      const nextNum = count + 1;

      const patientRecord = {
        id: body.id || `pat-${String(nextNum).padStart(3, '0')}`,
        uhid: body.uhid || `VAA-2026-${String(nextNum).padStart(4, '0')}`,
        first_name: (body.first_name || '').trim(),
        last_name: (body.last_name || '').trim(),
        full_name: `${(body.first_name || '').trim()} ${(body.last_name || '').trim()}`.trim(),
        gender: body.gender || 'Other',
        date_of_birth: body.date_of_birth || '',
        phone: body.phone || '',
        email: body.email || '',
        address: body.address || '',
        city: body.city || 'Satara',
        guardian_name: body.guardian_name || '',
        guardian_relationship: body.guardian_relationship || '',
        primary_concern: body.primary_concern || '',
        service_line: body.service_line || 'SPEECH_LANGUAGE',
        medical_history: body.medical_history || '',
        notes: body.notes || '',
        status: body.status || 'ACTIVE',
        created_at: body.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await collection.updateOne(
        { id: patientRecord.id },
        { $set: patientRecord },
        { upsert: true }
      );

      return res.status(201).json({
        success: true,
        message: 'Patient stored successfully in MongoDB',
        data: patientRecord,
      });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id } = req.query;
      const targetId = id || body.id;

      if (!targetId) {
        return res.status(400).json({ success: false, message: 'Patient ID is required' });
      }

      const updateData = {
        ...body,
        updated_at: new Date().toISOString(),
      };
      delete updateData._id;

      await collection.updateOne(
        { $or: [{ id: targetId }, { uhid: targetId }] },
        { $set: updateData }
      );

      const updated = await collection.findOne({ $or: [{ id: targetId }, { uhid: targetId }] });
      return res.status(200).json({ success: true, data: updated });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Patient ID is required' });
      }

      await collection.deleteOne({ $or: [{ id }, { uhid: id }] });
      return res.status(200).json({ success: true, message: 'Patient deleted successfully' });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('API /patients error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
