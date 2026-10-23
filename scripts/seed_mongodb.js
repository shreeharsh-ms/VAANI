import { MongoClient } from '../frontend/node_modules/mongodb/lib/index.js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const uri =
  process.env.MONGO_URI ||
  'mongodb+srv://graham:aGUi9njxs%40b6F5v@cluster0.ccjkejl.mongodb.net/ba_mc_erp?appName=Cluster0';

async function seed() {
  console.log('Connecting to MongoDB Atlas at ba_mc_erp...');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db('ba_mc_erp');
    console.log('Connected successfully!');

    // 1. Seed Patients
    const patientsCol = db.collection('vaani_patients');
    const patientCount = await patientsCol.countDocuments();
    console.log(`Current vaani_patients count: ${patientCount}`);

    if (patientCount === 0) {
      console.log('Seeding initial clinical patients...');
      const initialPatients = [
        {
          id: 'p_1',
          uhid: 'VN-26-0001',
          first_name: 'Aarav',
          last_name: 'Shinde',
          full_name: 'Aarav Sachin Shinde',
          date_of_birth: '2020-04-12',
          gender: 'MALE',
          phone: '+91 98220 11223',
          email: 'shinde.family@gmail.com',
          guardian_name: 'Sachin Shinde',
          guardian_relationship: 'Father',
          service_line: 'SPEECH_LANGUAGE',
          primary_concern: 'Expressive Language Delay & Mild Articulation Impairment',
          diagnosis: 'Expressive Language Delay & Mild Articulation Impairment',
          city: 'Sadashiv Peth, Satara',
          status: 'ACTIVE',
          created_at: '2026-01-15T10:30:00Z',
        },
        {
          id: 'p_2',
          uhid: 'VN-26-0002',
          first_name: 'Sunita',
          last_name: 'More',
          full_name: 'Sunita Dattatray More',
          date_of_birth: '1962-08-25',
          gender: 'FEMALE',
          phone: '+91 94220 44556',
          email: 'sunita.more@yahoo.co.in',
          guardian_name: 'Dattatray More',
          guardian_relationship: 'Husband',
          service_line: 'AUDIOLOGY',
          primary_concern: 'Bilateral Hearing Loss & Tinnitus',
          diagnosis: 'Moderate-to-Severe Sensorineural Hearing Loss (Bilateral)',
          city: 'Koregaon, Satara',
          status: 'ACTIVE',
          created_at: '2026-02-01T11:00:00Z',
        },
        {
          id: 'p_3',
          uhid: 'VN-26-0003',
          first_name: 'Vijay',
          last_name: 'Kadam',
          full_name: 'Vijay Narayan Kadam',
          date_of_birth: '1955-12-10',
          gender: 'MALE',
          phone: '+91 98901 77889',
          email: 'vijay.kadam@outlook.com',
          guardian_name: 'Self',
          guardian_relationship: 'Self',
          service_line: 'AUDIOLOGY',
          primary_concern: 'Difficulty understanding speech in noise',
          diagnosis: 'Age-Related High Frequency Sensorineural Hearing Loss',
          city: 'Powai Naka, Satara',
          status: 'ACTIVE',
          created_at: '2026-02-10T14:30:00Z',
        },
        {
          id: 'p_4',
          uhid: 'VN-26-0004',
          first_name: 'Ananya',
          last_name: 'Patil',
          full_name: 'Ananya Rahul Patil',
          date_of_birth: '2021-09-05',
          gender: 'FEMALE',
          phone: '+91 98500 22334',
          email: 'rahul.patil.satara@gmail.com',
          guardian_name: 'Rahul Patil',
          guardian_relationship: 'Father',
          service_line: 'SPEECH_LANGUAGE',
          primary_concern: 'Phonological delays & sound substitutions',
          diagnosis: 'Functional Speech Sound Disorder',
          city: 'Karanje Turf, Satara',
          status: 'ACTIVE',
          created_at: '2026-02-18T09:15:00Z',
        },
      ];
      await patientsCol.insertMany(initialPatients);
      console.log(`Inserted ${initialPatients.length} seed patients into vaani_patients.`);
    }

    // 2. Seed Appointments
    const appointmentsCol = db.collection('vaani_appointments');
    const aptCount = await appointmentsCol.countDocuments();
    console.log(`Current vaani_appointments count: ${aptCount}`);

    if (aptCount === 0) {
      console.log('Seeding initial appointments...');
      const initialAppointments = [
        {
          id: 'apt-001',
          booking_ref: 'VAA-BK-2601',
          patient_id: 'p_1',
          patient_name: 'Aarav Sachin Shinde',
          uhid: 'VN-26-0001',
          phone: '+91 98220 11223',
          service_line: 'SPEECH_LANGUAGE',
          service_name: 'Speech Therapy Session',
          practitioner: 'Ms. Palak Paresh Gandhi',
          date: '2026-10-24',
          time: '10:00 AM',
          duration_minutes: 45,
          status: 'CONFIRMED',
          fee: 1000,
          created_at: new Date().toISOString(),
        },
        {
          id: 'apt-002',
          booking_ref: 'VAA-BK-2602',
          patient_id: 'p_2',
          patient_name: 'Sunita Dattatray More',
          uhid: 'VN-26-0002',
          phone: '+91 94220 44556',
          service_line: 'AUDIOLOGY',
          service_name: 'Pure Tone Audiometry (PTA)',
          practitioner: 'Ms. Palak Paresh Gandhi',
          date: '2026-10-24',
          time: '11:30 AM',
          duration_minutes: 45,
          status: 'CONFIRMED',
          fee: 800,
          created_at: new Date().toISOString(),
        },
      ];
      await appointmentsCol.insertMany(initialAppointments);
      console.log(`Inserted ${initialAppointments.length} seed appointments.`);
    }

    // 3. Seed Reports
    const reportsCol = db.collection('vaani_reports');
    const repCount = await reportsCol.countDocuments();
    console.log(`Current vaani_reports count: ${repCount}`);

    if (repCount === 0) {
      console.log('Seeding initial clinical reports...');
      const initialReports = [
        {
          id: 'rep-5227',
          report_number: 'REP-26-5227',
          date: '2026-10-18',
          type: 'Pure Tone Audiometry (PTA)',
          patient_id: 'p_1',
          uhid: 'VN-26-0001',
          patient_name: 'Aarav Sachin Shinde',
          examiner: 'Ms. Palak Paresh Gandhi, MASLP, RCI',
          rci_number: 'A79214',
          patient: {
            id: 'p_1',
            uhid: 'VN-26-0001',
            full_name: 'Aarav Sachin Shinde',
            age: 6,
            gender: 'Male',
            contact: '+91 98220 11223',
            email: 'shinde.family@gmail.com',
            referringDoctor: 'Dr. S. K. Joshi (ENT Specialist)',
          },
          computed: {
            rightPTA: '15 dB HL',
            leftPTA: '18 dB HL',
            rightDegree: 'Normal Hearing Sensitivity',
            leftDegree: 'Normal Hearing Sensitivity',
          },
          status: 'VERIFIED_AND_SIGNED',
          created_at: new Date().toISOString(),
        },
      ];
      await reportsCol.insertMany(initialReports);
      console.log(`Inserted ${initialReports.length} seed reports.`);
    }

    // 4. Seed Settings
    const settingsCol = db.collection('vaani_settings');
    const settingsDoc = await settingsCol.findOne({ key: 'clinic_profile' });
    if (!settingsDoc) {
      console.log('Seeding clinic profile settings...');
      await settingsCol.insertOne({
        key: 'clinic_profile',
        value: {
          clinicName: 'VAANI - Speech & Hearing Clinic',
          tagline: 'Speak • Hear • Connect',
          location: 'Sadashiv Peth, Satara, Maharashtra 415002',
          phone: '+91 98765 43210',
          email: 'contact@vaaniclinic.com',
          workingHours: 'Mon - Sat: 09:30 AM - 06:30 PM (Sun Closed)',
          credentials: {
            leadPractitioner: 'Ms. Palak Paresh Gandhi',
            leadDegree: 'MASLP, RCI',
            rciNumber: 'A79214',
          },
        },
        created_at: new Date().toISOString(),
      });
      console.log('Seeded clinic settings.');
    }

    console.log('All seeding successfully completed!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await client.close();
  }
}

seed();
