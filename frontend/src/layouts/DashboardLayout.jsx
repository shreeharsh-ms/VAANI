import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Toast from '../components/feedback/Toast';
import { ROUTES } from '../constants';
import { getShortcutNumber, isUserTyping, isKey } from '../utils/keyboard';

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/dashboard' || location.pathname === '/dashboard/';

  // Global Fast Navigation: Ctrl+1..9, Cmd+1..9, Alt+1..9, Ctrl+B, and direct 1..9
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      // Never intercept when user is typing in inputs, textareas, or contenteditables
      if (isUserTyping(e)) return;

      // Check for Home shortcut: Ctrl+B / Cmd+B / Alt+B
      if ((e.ctrlKey || e.metaKey || e.altKey) && isKey(e, 'b')) {
        e.preventDefault();
        e.stopPropagation();
        navigate(ROUTES.DASHBOARD.HOME);
        return;
      }

      // Check for Settings shortcut: Ctrl+S / Cmd+S / Alt+S
      if ((e.ctrlKey || e.metaKey || e.altKey) && isKey(e, 's')) {
        e.preventDefault();
        e.stopPropagation();
        navigate(ROUTES.DASHBOARD.SETTINGS);
        return;
      }

      // Check numeric shortcuts 1..9
      const num = getShortcutNumber(e);
      if (!num || num < 1 || num > 9) return;

      const navMap = {
        1: ROUTES.DASHBOARD.HOME,
        2: ROUTES.DASHBOARD.OVERVIEW,
        3: ROUTES.DASHBOARD.APPOINTMENTS,
        4: ROUTES.DASHBOARD.PATIENTS,
        5: ROUTES.DASHBOARD.REPORTS,
        6: ROUTES.DASHBOARD.BILLING,
        7: ROUTES.DASHBOARD.INVENTORY,
        8: ROUTES.DASHBOARD.RECALLS,
        9: ROUTES.DASHBOARD.BLOGS,
      };

      const targetPath = navMap[num];
      if (!targetPath) return;

      const hasModifier = e.ctrlKey || e.metaKey || e.altKey;

      // 1. If any modifier is held (Ctrl+1, Cmd+1, Alt+1 / Option+1):
      if (hasModifier) {
        e.preventDefault();
        e.stopPropagation();
        navigate(targetPath);
        return;
      }

      // 2. If NO modifier is held (user directly presses key 1, 2, 3..9):
      // Only navigate if no modal dialog or full-screen overlay is currently active
      const isModalOpen = Boolean(
        document.querySelector('[role="dialog"], .fixed.inset-0.z-50, .fixed.inset-0.bg-black\\/50')
      );
      if (!isModalOpen) {
        e.preventDefault();
        e.stopPropagation();
        navigate(targetPath);
      }
    };

    // Use capture phase ({ capture: true }) to intercept keys before child components stop propagation
    window.addEventListener('keydown', handleGlobalKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleGlobalKeyDown, { capture: true });
  }, [navigate]);

  return (
    <div className="relative min-h-screen w-full bg-[#301444] print:bg-white p-2 sm:p-3 lg:p-4 print:p-0 flex flex-col font-sans selection:bg-purple-200 selection:text-purple-900">
      
      {/* ── MAIN INNER CARD: Exact Home Page Santo Frame with Rounded Corners ── */}
      <div className="relative w-full flex-1 bg-white rounded-tr-[20px] sm:rounded-tr-[28px] lg:rounded-tr-[32px] rounded-br-[20px] sm:rounded-br-[28px] lg:rounded-br-[32px] rounded-bl-[20px] sm:rounded-bl-[28px] lg:rounded-bl-[32px] rounded-tl-none overflow-hidden shadow-2xl print:shadow-none print:rounded-none flex flex-col justify-between">
        
        {/* ── BACKGROUND LAYER: FAINT LAVENDER WATERCOLOR ── */}
        <div 
          className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 print:hidden"
          aria-hidden="true"
        >
          <img
            src="/faint-lavender-bg.jpg"
            alt="Vaani Faint Lavender Background"
            className="w-full h-full object-cover object-top opacity-70 mix-blend-multiply"
          />
          {/* Airy soft translucent gradient wash so all cards and text remain crisp */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/70 via-white/50 to-white/75 backdrop-blur-[0.5px]" />
        </div>

        {/* ── TOP NAVBAR: Exact Home Page Santo Navbar with Logo Tab & Fillets ── */}
        <div className="print:hidden">
          <Sidebar />
        </div>

        {/* ── MAIN CONTENT OUTLET ── */}
        <main className={`relative z-10 flex-1 w-full ${isHome ? 'p-0 flex flex-col justify-center' : 'p-2.5 sm:p-3.5 lg:p-4'} print:p-0`}>
          <div className={`w-full mx-auto ${isHome ? '' : 'space-y-3'} print:space-y-0`}>
            <Outlet />
          </div>
        </main>

        {/* ── CLINICAL INSTITUTIONAL FOOTER (Hidden on clean Admin Home Screen) ── */}
        {!isHome && (
          <footer className="relative z-10 w-full py-4.5 text-center bg-white/60 backdrop-blur-xs border-t border-purple-100/80 px-4 sm:px-8 print:hidden">
            <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <p className="text-xs text-purple-900/70 font-medium">
                © {new Date().getFullYear()} Vaani Speech &amp; Hearing Clinic • Clinical Practice Suite (Satara)
              </p>
              <div className="flex items-center gap-3 text-xs text-purple-800/60 font-medium">
                <span>RCI Reg. Practice</span>
                <span>•</span>
                <span>Authorized Clinical Access</span>
              </div>
            </div>
          </footer>
        )}

      </div>

      <Toast />
    </div>
  );
};

export default DashboardLayout;
