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
 * Format time string e.g. "14:30" to "2:30 PM".
 */
export const formatTime = (timeString) => {
  if (!timeString) return '';
  const [hours, minutes] = timeString.split(':');
  if (!hours) return timeString;
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${ampm}`;
};

/**
 * Truncate long text with ellipsis.
 */
export const truncateText = (text, maxLength = 60) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};
