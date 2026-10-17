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
 * Normalize time slot string into unified format (e.g. "10:15 AM", "02:00 PM").
 */
export const normalizeSlotTime = (timeStr) => {
  if (!timeStr) return '';
  const clean = String(timeStr).trim();
  const match = clean.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if (match) {
    let h = parseInt(match[1], 10);
    const m = match[2];
    const modifier = match[3] ? match[3].toUpperCase() : null;

    if (modifier) {
      return `${String(h).padStart(2, '0')}:${m} ${modifier}`;
    } else {
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return `${String(h12).padStart(2, '0')}:${m} ${ampm}`;
    }
  }
  return clean;
};

/**
 * Truncate long text with ellipsis.
 */
export const truncateText = (text, maxLength = 60) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
