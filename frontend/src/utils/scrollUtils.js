/**
 * Helper to guarantee smooth or instant scroll to top / hero section of any page
 */
export function scrollToPageTop(immediate = true) {
  if (typeof window === 'undefined') return;

  try {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: immediate ? 'instant' : 'smooth',
    });
  } catch {
    window.scrollTo(0, 0);
  }

  if (window.lenis) {
    try {
      window.lenis.scrollTo(0, { immediate });
    } catch {}
  }
}

/**
 * Click handler for navigation links in Navbar, Header, and Drawer
 */
export function handleNavbarNavigation(e, targetPath, currentPathname) {
  // If target has a hash (like #booking-section), let hash scrolling take over
  if (targetPath.includes('#')) {
    return;
  }

  // If already on the target page, scroll smoothly to the Hero section
  if (currentPathname === targetPath || (targetPath !== '/' && currentPathname.startsWith(targetPath))) {
    e?.preventDefault();
    scrollToPageTop(false);
    return;
  }

  // When navigating to another page, immediately reset scroll so the new page renders at its Hero section
  scrollToPageTop(true);
}
