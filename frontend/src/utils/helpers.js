/**
 * General helper utilities
 */

/**
 * Conditionally join class names into a clean string.
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

/**
 * Debounce a function call.
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
