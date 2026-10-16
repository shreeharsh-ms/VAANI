/**
 * Form Validation Utilities
 */

export const isValidEmail = (email) => {
  if (!email) return false;
  const re = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
  return re.test(String(email).toLowerCase().trim());
};

export const isValidPhone = (phone) => {
  if (!phone) return false;
  const clean = String(phone).replace(/[\s-]/g, '');
  return /^[+]?[0-9]{10,14}$/.test(clean);
};

export const isNotEmpty = (val) => {
  if (val === null || val === undefined) return false;
  if (typeof val === 'string') return val.trim().length > 0;
  return true;
};
