import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for keyboard navigation across lists, tables, and directories:
 * - ArrowUp / ArrowDown: Move between rows (with subtle, comfortable active highlight)
 * - ArrowLeft / ArrowRight: Navigate between action buttons on the active row
 * - Enter / Space: Trigger the focused action button
 * - Ctrl+Q / Cmd+Q / Alt+Q: Navigate to Previous Page in pagination
 * - Ctrl+E / Cmd+E / Alt+E: Navigate to Next Page in pagination
 */
export function useTableKeyboardNav({
  items = [],
  page = 1,
  totalPages = 1,
  onPageChange,
  getButtonCountForRow, // function(rowIndex) => number of buttons in that row
  isEnabled = true,
  tableId = 'nav-table',
}) {
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);
  const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
  const tableRef = useRef(null);

  // Clamp selectedRowIndex if items length changes
  useEffect(() => {
    if (!items || items.length === 0) {
      setSelectedRowIndex(0);
      setSelectedButtonIndex(0);
      return;
    }
    setSelectedRowIndex((prev) => Math.min(Math.max(prev, 0), items.length - 1));
  }, [items?.length]);

  // When page changes, reset selection to the first row and first button
  useEffect(() => {
    setSelectedRowIndex(0);
    setSelectedButtonIndex(0);
  }, [page]);

  // Scroll active row into view
  useEffect(() => {
    if (!isEnabled || items.length === 0) return;
    const rowEl = document.querySelector(`[data-nav-table="${tableId}"] [data-row-index="${selectedRowIndex}"]`);
    if (rowEl && typeof rowEl.scrollIntoView === 'function') {
      rowEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedRowIndex, isEnabled, items.length, tableId]);

  // Helper to get button count for a row
  const getButtonCount = useCallback(
    (rowIndex) => {
      if (typeof getButtonCountForRow === 'function') {
        return getButtonCountForRow(rowIndex);
      }
      // Or query DOM inside the row
      const rowEl = document.querySelector(`[data-nav-table="${tableId}"] [data-row-index="${rowIndex}"]`);
      if (rowEl) {
        const btns = rowEl.querySelectorAll('[data-btn-index]');
        return btns.length;
      }
      return 1;
    },
    [getButtonCountForRow, tableId]
  );

  // Global keydown handler
  useEffect(() => {
    if (!isEnabled) return;

    const handleKeyDown = (e) => {
      // 1. If typing in an input/textarea/select/editable field, ignore
      const target = e.target;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable);
      if (isInput) return;

      // 2. If a modal is currently open in the DOM, do not intercept table navigation
      const isModalOpen = document.querySelector(
        '[role="dialog"], .fixed.inset-0.z-50, .fixed.inset-0.bg-black\\/50, .fixed.inset-0.bg-slate-900\\/50'
      );
      if (isModalOpen) return;

      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isModifier = e.ctrlKey || e.metaKey || e.altKey;
      const key = e.key.toLowerCase();

      // ── PAGINATION SHORTCUTS: Ctrl+Q / Cmd+Q / Alt+Q (Prev), Ctrl+E / Cmd+E / Alt+E (Next) ──
      if (isModifier && key === 'q') {
        e.preventDefault();
        e.stopPropagation();
        if (onPageChange && page > 1) {
          onPageChange(page - 1);
        }
        return;
      }

      if (isModifier && key === 'e') {
        e.preventDefault();
        e.stopPropagation();
        if (onPageChange && page < totalPages) {
          onPageChange(page + 1);
        }
        return;
      }

      // If no items, skip row navigation
      if (!items || items.length === 0) return;

      // ── ROW NAVIGATION: ArrowDown / ArrowUp ──
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedRowIndex((prev) => {
          const next = Math.min(prev + 1, items.length - 1);
          return next;
        });
        setSelectedButtonIndex(0);
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedRowIndex((prev) => {
          const next = Math.max(prev - 1, 0);
          return next;
        });
        setSelectedButtonIndex(0);
        return;
      }

      // ── BUTTON NAVIGATION: ArrowRight / ArrowLeft ──
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const maxBtns = getButtonCount(selectedRowIndex);
        if (maxBtns > 0) {
          setSelectedButtonIndex((prev) => Math.min(prev + 1, maxBtns - 1));
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedButtonIndex((prev) => Math.max(prev - 1, 0));
        return;
      }

      // ── TRIGGER ACTION: Enter or Space ──
      if (e.key === 'Enter' || e.key === ' ') {
        const btnEl = document.querySelector(
          `[data-nav-table="${tableId}"] [data-row-index="${selectedRowIndex}"] [data-btn-index="${selectedButtonIndex}"]`
        );
        if (btnEl) {
          e.preventDefault();
          btnEl.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEnabled, items, page, totalPages, onPageChange, selectedRowIndex, selectedButtonIndex, getButtonCount, tableId]);

  /**
   * Helper to get row props
   */
  const getRowProps = (rowIndex) => {
    const isSelected = selectedRowIndex === rowIndex;
    return {
      'data-row-index': rowIndex,
      onClick: () => {
        setSelectedRowIndex(rowIndex);
        setSelectedButtonIndex(0);
      },
      className: isSelected
        ? 'bg-purple-50/75 border-l-[3.5px] border-l-purple-600 transition-colors shadow-2xs'
        : 'hover:bg-purple-50/30 transition-colors',
    };
  };

  /**
   * Helper to get button props for action buttons
   */
  const getButtonProps = (rowIndex, buttonIndex) => {
    const isFocused = selectedRowIndex === rowIndex && selectedButtonIndex === buttonIndex;
    return {
      'data-btn-index': buttonIndex,
      onFocus: () => {
        setSelectedRowIndex(rowIndex);
        setSelectedButtonIndex(buttonIndex);
      },
      className: isFocused
        ? 'ring-2 ring-purple-600 ring-offset-1 scale-105 transition-all shadow-xs z-10'
        : 'transition-all',
    };
  };

  return {
    selectedRowIndex,
    setSelectedRowIndex,
    selectedButtonIndex,
    setSelectedButtonIndex,
    getRowProps,
    getButtonProps,
    tableContainerProps: {
      'data-nav-table': tableId,
      ref: tableRef,
    },
  };
}

export default useTableKeyboardNav;
