/**
 * Universal keyboard matching helper supporting macOS Option (⌥) dead keys,
 * Windows Alt combinations, and physical e.code events.
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
  if (target === 'i') {
    return e.code === 'KeyI' || e.key === 'i' || e.key === 'I' || e.key === 'ˆ';
  }

  // Digits 1 to 9 (handling standard number row, numpad, and Mac Option symbols)
  if (/^[1-9]$/.test(target)) {
    return (
      e.code === `Digit${target}` ||
      e.code === `Numpad${target}` ||
      e.key === target ||
      (target === '1' && e.key === '¡') ||
      (target === '2' && e.key === '™') ||
      (target === '3' && e.key === '£') ||
      (target === '4' && e.key === '¢') ||
      (target === '5' && e.key === '∞') ||
      (target === '6' && e.key === '§')
    );
  }

  return e.code?.toLowerCase() === `key${target}` || e.key?.toLowerCase() === target;
};

export const isAlt = (e) => Boolean(e.altKey);
export const isCmdOrCtrl = (e) => Boolean(e.ctrlKey || e.metaKey);

export default { isKey, isAlt, isCmdOrCtrl };
