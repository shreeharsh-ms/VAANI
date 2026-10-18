/**
 * Universal keyboard matching helper supporting macOS Option (⌥) dead keys,
 * Windows Alt combinations, physical e.code events, and browser shortcut overrides.
 */

export const isKey = (e, targetKey) => {
  if (!e) return false;
  const target = targetKey.toLowerCase();

  if (target === 'enter') {
    return e.key === 'Enter' || e.code === 'Enter' || e.code === 'NumpadEnter';
  }

  if (target === 'escape' || target === 'esc') {
    return e.key === 'Escape' || e.code === 'Escape';
  }

  // Character checks covering e.code (physical key), e.key, and Mac Option-character glyphs
  if (target === 'n') {
    return e.code === 'KeyN' || e.key === 'n' || e.key === 'N' || e.key === '˜' || e.key === '~';
  }
  if (target === 'e') {
    return e.code === 'KeyE' || e.key === 'e' || e.key === 'E' || e.key === '´' || e.key === 'Dead';
  }
  if (target === 'a') {
    return e.code === 'KeyA' || e.key === 'a' || e.key === 'A' || e.key === 'å' || e.key === 'Å';
  }
  if (target === 'r') {
    return e.code === 'KeyR' || e.key === 'r' || e.key === 'R' || e.key === '®';
  }
  if (target === 's') {
    return e.code === 'KeyS' || e.key === 's' || e.key === 'S' || e.key === 'ß';
  }
  if (target === 'k') {
    return e.code === 'KeyK' || e.key === 'k' || e.key === 'K';
  }
  if (target === 'b') {
    return e.code === 'KeyB' || e.key === 'b' || e.key === 'B' || e.key === '∫';
  }
  if (target === 'i') {
    return e.code === 'KeyI' || e.key === 'i' || e.key === 'I' || e.key === 'ˆ';
  }

  // Digits 1 to 9 (handling standard number row, numpad, and Mac Option symbols)
  if (/^[1-9]$/.test(target)) {
    const num = parseInt(target, 10);
    return getShortcutNumber(e) === num;
  }

  return e.code?.toLowerCase() === `key${target}` || e.key?.toLowerCase() === target;
};

/**
 * Robustly extracts a numeric digit 1-9 from any keyboard event.
 * Handles:
 * - e.code: 'Digit1'..'Digit9', 'Numpad1'..'Numpad9'
 * - e.key: '1'..'9'
 * - macOS Option dead keys: '¡', '™', '£', '¢', '∞', '§', '¶', '•', 'ª'
 */
export const getShortcutNumber = (e) => {
  if (!e) return null;

  // 1. Check physical key code (independent of modifier changes to e.key)
  if (e.code) {
    const digitMatch = e.code.match(/^Digit([1-9])$/);
    if (digitMatch) return parseInt(digitMatch[1], 10);
    const numpadMatch = e.code.match(/^Numpad([1-9])$/);
    if (numpadMatch) return parseInt(numpadMatch[1], 10);
  }

  // 2. Check e.key
  if (e.key && /^[1-9]$/.test(e.key)) {
    return parseInt(e.key, 10);
  }

  // 3. Check macOS Option/Alt characters generated when pressing Option + 1..9
  const macOptionMap = {
    '¡': 1,
    '™': 2,
    '£': 3,
    '¢': 4,
    '∞': 5,
    '§': 6,
    '¶': 7,
    '•': 8,
    'ª': 9,
  };
  if (e.key && macOptionMap[e.key]) {
    return macOptionMap[e.key];
  }

  return null;
};

export const isAlt = (e) => Boolean(e.altKey);
export const isCmdOrCtrl = (e) => Boolean(e.ctrlKey || e.metaKey);

/**
 * Returns true if the user is currently typing in an input, textarea, select, or contentEditable element.
 */
export const isUserTyping = (e) => {
  if (!e || !e.target) return false;
  const target = e.target;
  const tag = target.tagName?.toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select') return true;
  if (target.isContentEditable) return true;
  if (typeof target.closest === 'function') {
    return Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
  }
  return false;
};

export default { isKey, isAlt, isCmdOrCtrl, getShortcutNumber, isUserTyping };
