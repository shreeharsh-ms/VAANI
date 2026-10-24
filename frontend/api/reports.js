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
    const collection = await getCollection('reports');

    if (req.method === 'GET') {
      const { id, reportNumber, uhid, patientName } = req.query;

      // Single report search
      if (id || reportNumber) {
        const target = (id || reportNumber).trim();
        const report = await collection.findOne({
          $or: [
            { id: target },
            { report_number: target },
            { report_number: new RegExp(`^${target}$`, 'i') },
          ],
        });

        if (!report) {
          return res.status(404).json({ success: false, message: 'Report not found' });
        }
        return res.status(200).json({ success: true, data: report });
      }

      // Filter by patient
      const filter = {};
      if (uhid) filter.uhid = new RegExp(`^${uhid.trim()}$`, 'i');
      if (patientName) filter.patient_name = new RegExp(patientName.trim(), 'i');

      const reports = await collection.find(filter).sort({ date: -1, created_at: -1 }).toArray();
      return res.status(200).json({ success: true, data: reports });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const count = await collection.countDocuments();
      const nextNum = count + 1;

      const reportRecord = {
        id: body.id || `rep-${Date.now()}-${String(nextNum).padStart(3, '0')}`,
        report_number:
          body.report_number || body.reportNumber || `REP-26-${String(nextNum + 5220).padStart(4, '0')}`,
        date: body.date || body.reportDate || new Date().toISOString().split('T')[0],
        type: body.type || body.service || 'Pure Tone Audiometry (PTA)',
        patient_id: body.patient_id || body.patient?.id || '',
        uhid: body.uhid || body.patient?.uhid || '',
        patient_name: body.patient_name || body.patient?.full_name || '',
        examiner: body.examiner || body.examinerName || 'Ms. Palak Paresh Gandhi, MASLP, RCI',
        rci_number: body.rci_number || body.rciNumber || 'A79214',
        patient: body.patient || null,
        patientDossier: body.patientDossier || null,
        parameters: body.parameters || null,
        computed: body.computed || body.computedPTA || null,
        notes: body.notes || '',
        status: body.status || 'VERIFIED_AND_SIGNED',
        created_at: body.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await collection.updateOne(
        { report_number: reportRecord.report_number },
        { $set: reportRecord },
        { upsert: true }
      );

      return res.status(201).json({
        success: true,
        message: 'Clinical report saved to MongoDB successfully',
        data: reportRecord,
      });
    }

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { id, reportNumber } = req.query;
      const target = id || reportNumber || body.id || body.report_number;

      if (!target) {
        return res.status(400).json({ success: false, message: 'Report ID or Number required' });
      }

      const updateData = {
        ...body,
        updated_at: new Date().toISOString(),
      };
      delete updateData._id;

      await collection.updateOne(
        { $or: [{ id: target }, { report_number: target }] },
        { $set: updateData }
      );

      const updated = await collection.findOne({
        $or: [{ id: target }, { report_number: target }],
      });
      return res.status(200).json({ success: true, data: updated });
    }

    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    console.error('API /reports error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
