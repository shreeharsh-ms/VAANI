import { MongoClient } from 'mongodb';

const uri =
  process.env.MONGO_URI ||
  'mongodb+srv://graham:aGUi9njxs%40b6F5v@cluster0.ccjkejl.mongodb.net/ba_mc_erp?appName=Cluster0';

const canonicalSettings = {
  identity: {
    legalName: 'Vaani Speech & Hearing Clinic',
    tradeName: 'Vaani Clinic',
    taglineEn: 'Speak • Hear • Connect',
    taglineMr: 'स्पष्ट बोला, सुस्पष्ट ऐका, आनंदाने जगा',
    logoUrl: '/vaani-logo.png',
    logoWhiteUrl: '/vaani-logo-white.png',
    letterheadTitle: 'VAANI SPEECH & HEARING REHABILITATION CENTER',
    stampNote: 'RCI Registered Practitioner Seal (CRR No. A79214)',
  },
  contact: {
    primaryPhone: '+91 8857830151',
    whatsappEnabled: true,
    consultationPhone: '+91 8857830151',
    officialEmail: 'info@vaaniclinic.com',
    websiteUrl: 'https://vaaniclinic.com',
    addressLine1: 'Shop No. 4, Ground Floor, Sadashiv Arcade',
    addressLine2: 'Opp. Satara Zilla Parishad, Sadashiv Peth',
    locality: 'Sadashiv Peth',
    taluka: 'Satara',
    district: 'Satara',
    state: 'Maharashtra',
    pin: '415002',
    landmarkEn: 'Opposite Zilla Parishad Gate',
    landmarkMr: 'जिल्हा परिषद गेटसमोर',
    mapsUrl: 'https://maps.google.com/?q=Vaani+Speech+and+Hearing+Clinic+Satara',
    geoCoordinates: '73.9934, 17.6833',
    parkingNote: 'Dedicated two-wheeler parking in front; four-wheeler street parking on main road.',
    accessibilityNote: 'Ground-floor wheelchair accessible entrance with permanent entrance ramp.',
  },
  credentials: {
    rciNumber: 'A79214',
    rciVerified: true,
    rciValidUntil: '2031-10-15',
    titlePermitted: true,
    leadPractitioner: 'Ms. Palak Paresh Gandhi',
    leadDegree: 'BASLP, RCI',
    cbtQualificationVerified: true,
    cbtDegree: 'Postgraduate Cognitive Behavioural Interventions (SASLP / BVDU)',
    clinicalEstablishmentNo: 'MH-STR-CEA-2024-0081',
    shopActNo: 'STR-SA-2024-0192',
    udyamNo: 'UDYAM-MH-28-0012345',
    gstin: '27AAAAA0000A1Z5',
    panMasked: 'ABCDE****F',
  },
  hours: {
    workingHoursText: 'Mon – Sat: 9:30 AM – 7:30 PM',
    sundayHoursText: 'Sundays: By Prior Appointment',
    slotGranularityMin: 15,
    timezone: 'Asia/Kolkata',
    morningStart: '09:30',
    morningEnd: '13:30',
    eveningStart: '15:30',
    eveningEnd: '19:30',
    workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    sundayClosed: false,
  },
  social: {
    instagramUrl: 'https://instagram.com/palakgandhi_maslp',
    instagramHandle: '@palakgandhi_maslp',
    youtubeUrl: 'https://youtube.com/@vaaniclinic',
    facebookUrl: 'https://facebook.com/vaaniclinic',
    whatsappPhone: '+91 98220 12349',
  },
  bookingPolicy: {
    minNoticeMin: 120,
    maxAdvanceDays: 30,
    holdHours: 24,
    autoConfirm: false,
    cancelWindowHours: 4,
    rescheduleLimit: 2,
    sameDayAllowed: true,
    graceNoShowMin: 15,
    ptaDailyCap: 5,
    speechTherapyDailyCap: 8,
  },
  billing: {
    uhidPrefix: 'VN-',
    uhidFormat: 'VN-YY-######',
    invoicePrefix: 'INV-2026-',
    receiptPrefix: 'REC-2026-',
    resetFiscalCycle: '04-01',
    serviceTaxPercent: 0,
    productTaxPercent: 18,
    sacCode: '999312',
    hsnCode: '9021',
    showGstOnInvoice: false,
    roundingMode: 'NEAREST_INTEGER',
    upiId: 'vaaniclinic@okaxis',
    upiName: 'Vaani Speech & Hearing Clinic',
    bankAccountName: 'Vaani Speech & Hearing Clinic',
    bankName: 'HDFC Bank Ltd, Sadashiv Peth Branch, Satara',
    bankIfsc: 'HDFC0000123',
    bankAccountMasked: '**** **** **** 4892',
  },
  notifications: {
    quietHoursStart: '21:00',
    quietHoursEnd: '08:00',
    reminderOffset1Hours: 24,
    reminderOffset2Hours: 2,
    senderEmail: 'appointments@vaaniclinic.com',
    senderDisplayName: 'Vaani Speech & Hearing Clinic',
    grievanceOfficerName: 'Ms. Palak Paresh Gandhi',
    grievanceEmail: 'grievance@vaaniclinic.com',
    grievancePhone: '+91 98220 12345',
    adultRetentionYears: 7,
    minorRetentionAge: 21,
    billingRetentionYears: 8,
    auditRetentionYears: 7,
  },
  features: {
    inventory: true,
    expenses: true,
    packages: true,
    cbt: true,
    onlineBooking: true,
    waitlist: true,
    referralInbox: true,
    twoFactorEnforced: true,
    idleTimeoutMin: 15,
  },
  smtp: {
    host: 'smtp.gmail.com',
    port: 587,
    encryption: 'STARTTLS',
    senderName: 'Vaani Speech & Hearing Clinic',
    senderEmail: 'info@vaaniclinic.com',
    password: '',
    hasPasswordStored: false,
    enableAutoDispatch: true,
  },
};

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('ba_mc_erp');
    const settingsCol = db.collection('vaani_settings');

    await settingsCol.updateOne(
      { key: 'clinic_profile' },
      {
        $set: {
          key: 'clinic_profile',
          value: canonicalSettings,
          updated_at: new Date().toISOString(),
        },
      },
      { upsert: true }
    );

    console.log('Successfully updated vaani_settings with full canonical structure!');
  } finally {
    await client.close();
  }
}

main().catch(console.error);
