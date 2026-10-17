/**
 * Formatting Utilities
 */

/**
 * Format paise or INR to standard Indian Rupee representation (e.g. ₹800.00).
 */
export const formatCurrency = (amount, isPaise = false) => {
  if (amount === undefined || amount === null) return '₹0';
  const inr = isPaise ? amount / 100 : amount;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inr);
};

/**
 * Format ISO date string to readable format e.g. "14 Oct 2026".
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
};

/**
 * Format time string e.g. "14:30" to "2:30 PM", or pass through if already formatted.
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  const str = String(timeString).trim();
  if (str.toUpperCase().includes('AM') || str.toUpperCase().includes('PM')) {
    return str;
  }
  const [hours, minutes] = str.split(':');
  if (!hours) return str;
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  const displayM = (minutes || '00').substring(0, 2);
  return `${displayH}:${displayM} ${ampm}`;
};

/**
 * Canonical Clinic Time Slots (30/45 min intervals covering mornings & afternoons)
 */
export const CLINICAL_TIME_SLOTS = [
  '09:30 AM',
  '10:15 AM',
  '10:45 AM',
  '11:00 AM',
  '11:45 AM',
  '02:00 PM',
  '02:45 PM',
  '03:30 PM',
  '04:15 PM',
  '05:00 PM',
  '05:45 PM',
];

/**
 * Normalizes any date representation (YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY, ISO) to standard 'YYYY-MM-DD'.
 */
export const normalizeDate = (dStr) => {
  if (!dStr) return '';
  const s = String(dStr).trim().split('T')[0];
  // Match DD/MM/YYYY or DD-MM-YYYY
  const dmy = s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (dmy) {
    return `${dmy[3]}-${String(dmy[2]).padStart(2, '0')}-${String(dmy[1]).padStart(2, '0')}`;
  }
  // Match YYYY-MM-DD or YYYY/MM/DD
  const ymd = s.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/);
  if (ymd) {
    return `${ymd[1]}-${String(ymd[2]).padStart(2, '0')}-${String(ymd[3]).padStart(2, '0')}`;
  }
  try {
    const d = new Date(s);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
  } catch {}
  return s;
};

/**
 * Parse time string to minutes from midnight (0..1439).
 * Robust against ranges, durations, suffixes e.g. "10:15 AM - 10:45", "10:15 - 45m", "10:15".
 */
export const timeToMinutes = (timeStr) => {
  if (!timeStr) return null;
  const s = String(timeStr).trim();
  const m = s.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const mod = m[3] ? m[3].toUpperCase() : null;

  if (mod === 'PM' && h < 12) h += 12;
  if (mod === 'AM' && h === 12) h = 0;
  // If no AM/PM provided and h is 1..7, in an outpatient clinic context it is PM (13..19)
  if (!mod && h >= 1 && h <= 7) h += 12;

  return h * 60 + min;
};

/**
 * Format minutes from midnight to standard "HH:MM AM/PM" (e.g. 615 -> "10:15 AM").
 */
export const minutesToSlotTime = (totalMinutes) => {
  if (totalMinutes === null || totalMinutes === undefined || isNaN(totalMinutes)) return '';
  const h24 = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  const ampm = h24 >= 12 ? 'PM' : 'AM';
  const h12 = h24 % 12 || 12;
  return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
};

/**
 * Normalize time slot string into unified format (e.g. "10:15 AM", "02:00 PM").
 * Handles partial strings, ranges, and durations seamlessly.
 */
export const normalizeSlotTime = (timeStr) => {
  if (!timeStr) return '';
  const mins = timeToMinutes(timeStr);
  if (mins === null) return String(timeStr).trim();
  return minutesToSlotTime(mins);
};

/**
 * Extract all clinical slots covered or overlapped by an appointment.
 * Ensures if 10:15 and 10:45 are filled, or an appointment spans 10:15-10:45 / 45m,
 * BOTH slots are returned as booked.
 */
export const getAppointmentSlotsCovered = (appointment) => {
  const slots = new Set();
  if (!appointment) return [];

  // 1. Extract all explicit time matches in start_time and end_time
  const combined = `${appointment.start_time || ''} ${appointment.end_time || ''} ${appointment.notes || ''}`;
  const timeMatches = combined.matchAll(/(\d{1,2}:\d{2}(?:\s*(?:AM|PM))?)/gi);
  for (const m of timeMatches) {
    const norm = normalizeSlotTime(m[1]);
    if (norm) slots.add(norm);
  }

  // 2. Interval coverage: check starting time and duration
  const startMins = timeToMinutes(appointment.start_time);
  if (startMins !== null) {
    slots.add(minutesToSlotTime(startMins));

    let endMins = timeToMinutes(appointment.end_time);
    if (!endMins || endMins <= startMins) {
      // Default clinical slot duration is 45 mins (or 60 mins for comprehensive evaluations)
      const isLong = /60|hour|1 hr|diagnostic|evaluation|screening/i.test(appointment.service_name || '');
      endMins = startMins + (isLong ? 60 : 45);
    }

    // Standard clinical slot minute points
    const STANDARD_SLOT_MINS = [
      570,  // 09:30 AM
      615,  // 10:15 AM
      645,  // 10:45 AM
      660,  // 11:00 AM
      705,  // 11:45 AM
      840,  // 02:00 PM
      885,  // 02:45 PM
      930,  // 03:30 PM
      975,  // 04:15 PM
      1020, // 05:00 PM
      1065, // 05:45 PM
    ];

    for (const sm of STANDARD_SLOT_MINS) {
      if (sm >= startMins && sm < endMins) {
        slots.add(minutesToSlotTime(sm));
      }
    }
  }

  return Array.from(slots);
};

/**
 * Truncate long text with ellipsis.
 */
export const truncateText = (text, maxLength = 60) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
