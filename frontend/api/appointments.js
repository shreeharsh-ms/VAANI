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
    const collection = await getCollection('appointments');

    if (req.method === 'GET') {
      const { id, date, patient_id, status } = req.query;

      if (id) {
        const appointment = await collection.findOne({ id });
        if (!appointment) {
          return res.status(404).json({ success: false, message: 'Appointment not found' });
        }
        return res.status(200).json({ success: true, data: appointment });
      }

      const filter = {};
      if (date) filter.date = date;
      if (patient_id) filter.patient_id = patient_id;
      if (status) filter.status = status;

      const appointments = await collection.find(filter).sort({ date: -1, time: 1 }).toArray();
      return res.status(200).json({ success: true, data: appointments });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const count = await collection.countDocuments();
      const nextNum = count + 1;

      const appointmentRecord = {
        id: body.id || `apt-${Date.now()}-${String(nextNum).padStart(3, '0')}`,
        booking_ref: body.booking_ref || `VAA-BK-${Date.now().toString(36).toUpperCase()}`,
        patient_id: body.patient_id || '',
        patient_name: body.patient_name || body.name || '',
        uhid: body.uhid || '',
        phone: body.phone || '',
        email: body.email || '',
        service_id: body.service_id || '',
        service_name: body.service_name || body.service || '',
        service_line: body.service_line || 'SPEECH_LANGUAGE',
        practitioner: body.practitioner || 'ASLP Palak Paresh Gandhi',
        date: body.date || new Date().toISOString().split('T')[0],
        time: body.time || '10:00 AM',
        duration_minutes: body.duration_minutes || 45,
        status: body.status || 'CONFIRMED',
        fee: body.fee || 1000,
        notes: body.notes || '',
        source: body.source || 'ONLINE_PORTAL',
        created_at: body.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await collection.updateOne(
        { id: appointmentRecord.id },
        { $set: appointmentRecord },
        { upsert: true }
      );

      return res.status(201).json({
        success: true,
        message: 'Appointment booked & stored in MongoDB successfully',
        data: appointmentRecord,
      });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id } = req.query;
      const targetId = id || body.id;

      if (!targetId) {
        return res.status(400).json({ success: false, message: 'Appointment ID required' });
      }

      const updateData = {
        ...body,
        updated_at: new Date().toISOString(),
      };
      delete updateData._id;

      await collection.updateOne({ id: targetId }, { $set: updateData });
      const updated = await collection.findOne({ id: targetId });

      return res.status(200).json({ success: true, data: updated });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ success: false, message: 'Appointment ID required' });
      }

      await collection.deleteOne({ id });
      return res.status(200).json({ success: true, message: 'Appointment cancelled/deleted' });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('API /appointments error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
