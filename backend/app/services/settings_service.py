"""Clinic Settings service with SQLite persistence."""
import os
import sqlite3
import json
from typing import Dict, Any

DEFAULT_SETTINGS = {
    "identity": {
        "legalName": "Vaani Speech & Hearing Clinic",
        "tradeName": "Vaani Clinic",
        "taglineEn": "Speak • Hear • Connect",
        "taglineMr": "स्पष्ट बोला, सुस्पष्ट ऐका, आनंदाने जगा",
        "logoUrl": "/vaani-logo.png",
        "logoWhiteUrl": "/vaani-logo-white.png",
        "letterheadTitle": "VAANI SPEECH & HEARING REHABILITATION CENTER",
        "stampNote": "RCI Registered Practitioner Seal (CRR No. A79214)",
    },
    "contact": {
        "primaryPhone": "+91 8857830151",
        "whatsappEnabled": True,
        "consultationPhone": "+91 8857830151",
        "officialEmail": "info@vaaniclinic.com",
        "websiteUrl": "https://vaaniclinic.com",
        "addressLine1": "Shop No. 4, Ground Floor, Sadashiv Arcade",
        "addressLine2": "Opp. Satara Zilla Parishad, Sadashiv Peth",
        "locality": "Sadashiv Peth",
        "taluka": "Satara",
        "district": "Satara",
        "state": "Maharashtra",
        "pin": "415002",
        "landmarkEn": "Opposite Zilla Parishad Gate",
        "landmarkMr": "जिल्हा परिषद गेटसमोर",
        "mapsUrl": "https://maps.google.com/?q=Vaani+Speech+and+Hearing+Clinic+Satara",
        "geoCoordinates": "73.9934, 17.6833",
        "parkingNote": "Dedicated two-wheeler parking in front; four-wheeler street parking on main road.",
        "accessibilityNote": "Ground-floor wheelchair accessible entrance with permanent entrance ramp.",
    },
    "credentials": {
        "rciNumber": "A79214",
        "rciVerified": True,
        "rciValidUntil": "2031-10-15",
        "titlePermitted": True,
        "leadPractitioner": "Ms. Palak Paresh Gandhi",
        "leadDegree": "BASLP, RCI",
        "cbtQualificationVerified": True,
        "cbtDegree": "Postgraduate Cognitive Behavioural Interventions (SASLP / BVDU)",
        "clinicalEstablishmentNo": "MH-STR-CEA-2024-0081",
        "shopActNo": "STR-SA-2024-0192",
        "udyamNo": "UDYAM-MH-28-0012345",
        "gstin": "27AAAAA0000A1Z5",
        "panMasked": "ABCDE****F",
    },
    "billing": {
        "sacCode": "999312",
        "hsnCode": "9021",
        "serviceTaxPercent": 0,
        "productTaxPercent": 18,
        "showGstOnInvoice": False,
        "uhidPrefix": "VN-",
        "invoicePrefix": "INV-2026-",
        "upiId": "vaaniclinic@okaxis",
        "upiName": "Vaani Speech & Hearing Clinic",
        "bankAccountName": "Vaani Speech & Hearing Clinic",
        "bankName": "HDFC Bank Ltd, Sadashiv Peth Branch, Satara",
        "bankIfsc": "HDFC0000123",
        "bankAccountMasked": "**** **** **** 4892",
    },
    "hours": {
        "workingHoursText": "Mon – Sat: 9:30 AM – 7:30 PM",
        "sundayHoursText": "Sundays: By Prior Appointment",
        "morningStart": "09:30",
        "morningEnd": "13:30",
        "eveningStart": "15:30",
        "eveningEnd": "19:30",
        "workingDays": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        "sundayClosed": False,
    },
    "social": {
        "instagramUrl": "https://instagram.com/palakgandhi_maslp",
        "instagramHandle": "@palakgandhi_maslp",
        "youtubeUrl": "https://youtube.com/@vaaniclinic",
        "facebookUrl": "https://facebook.com/vaaniclinic",
        "whatsappPhone": "+91 98220 12349",
    },
}


class SettingsService:
    DB_PATH = os.path.join(os.path.dirname(__file__), "../../instance/vaani_clinic.db")

    @classmethod
    def _init_db(cls):
        """Ensure SQLite database and settings table exist."""
        os.makedirs(os.path.dirname(cls.DB_PATH), exist_ok=True)
        conn = sqlite3.connect(cls.DB_PATH)
        try:
            with conn:
                conn.execute(
                    """
                    CREATE TABLE IF NOT EXISTS clinic_settings (
                        id TEXT PRIMARY KEY,
                        data_json TEXT NOT NULL,
                        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                    """
                )
                cur = conn.cursor()
                cur.execute("SELECT data_json FROM clinic_settings WHERE id = 'default'")
                row = cur.fetchone()
                if not row:
                    cur.execute(
                        "INSERT INTO clinic_settings (id, data_json) VALUES ('default', ?)",
                        (json.dumps(DEFAULT_SETTINGS),),
                    )
        finally:
            conn.close()

    @classmethod
    def get_settings(cls) -> Dict[str, Any]:
        """Fetch current settings from database with default fallbacks."""
        cls._init_db()
        conn = sqlite3.connect(cls.DB_PATH)
        try:
            cur = conn.cursor()
            cur.execute("SELECT data_json FROM clinic_settings WHERE id = 'default'")
            row = cur.fetchone()
            if row:
                try:
                    stored = json.loads(row[0])
                    # Deep merge with defaults
                    merged = dict(DEFAULT_SETTINGS)
                    for k, v in stored.items():
                        if isinstance(v, dict) and k in merged and isinstance(merged[k], dict):
                            merged[k] = {**merged[k], **v}
                        else:
                            merged[k] = v
                    return merged
                except Exception:
                    return DEFAULT_SETTINGS
            return DEFAULT_SETTINGS
        finally:
            conn.close()

    @classmethod
    def save_settings(cls, new_settings: Dict[str, Any]) -> Dict[str, Any]:
        """Save updated settings to SQLite database."""
        cls._init_db()
        current = cls.get_settings()
        # Deep merge new_settings into current
        for k, v in new_settings.items():
            if isinstance(v, dict) and k in current and isinstance(current[k], dict):
                current[k] = {**current[k], **v}
            else:
                current[k] = v

        conn = sqlite3.connect(cls.DB_PATH)
        try:
            with conn:
                conn.execute(
                    """
                    INSERT INTO clinic_settings (id, data_json, updated_at)
                    VALUES ('default', ?, CURRENT_TIMESTAMP)
                    ON CONFLICT(id) DO UPDATE SET
                        data_json = excluded.data_json,
                        updated_at = CURRENT_TIMESTAMP
                    """,
                    (json.dumps(current),),
                )
            return current
        finally:
            conn.close()
