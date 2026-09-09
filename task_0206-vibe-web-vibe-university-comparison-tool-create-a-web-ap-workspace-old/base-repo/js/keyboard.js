// =============================================
// Keyboard Shortcuts & Command Handler
// =============================================

import { $ } from './utils.js';
import { trapFocus, releaseFocusTrap } from './focus-trap.js';

export function initKeyboard({ onSearch, onFilter, onUndo, onRedo, onReset, onExport, onViewChange, onAddSchool }) {
  document.addEventListener('keydown', (e) => {
    const isInput = document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA' || document.activeElement?.tagName === 'SELECT';
    const searchInput = $('#search-input');

    // "/" to focus search
    if (e.key === '/' && !isInput) {
      e.preventDefault();
      searchInput?.focus();
    }
    // Esc to blur search / close modal
    if (e.key === 'Escape') {
      const addModal = $('#add-school-modal');
      const deleteModal = $('#delete-confirm-modal');
      const shortcutsModal = $('#shortcuts-modal');
      // Let dialogs handle their own Escape
      if (addModal?.open || deleteModal?.open || shortcutsModal?.open) return;
      if (document.activeElement === searchInput) {
        searchInput.value = '';
        onSearch('');
        searchInput.blur();
      }
    }
    // ? to toggle shortcuts (not in input)
    if (e.key === '?' && !isInput) {
      const modal = $('#shortcuts-modal');
      if (modal?.open) {
        releaseFocusTrap(modal);
        modal.close();
      } else if (modal) {
        modal.showModal();
        trapFocus(modal);
      }
    }
    // 1 for cards view (not in input)
    if (e.key === '1' && !isInput && !e.ctrlKey && !e.metaKey) {
      onViewChange('cards');
    }
    // 2 for table view (not in input)
    if (e.key === '2' && !isInput && !e.ctrlKey && !e.metaKey) {
      onViewChange('table');
    }
    // n for new school (not in input)
    if (e.key === 'n' && !isInput && !e.ctrlKey && !e.metaKey) {
      onAddSchool?.();
    }
    // Ctrl+Z undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      if (isInput && document.activeElement === searchInput) return;
      e.preventDefault();
      onUndo();
    }
    // Ctrl+Shift+Z or Ctrl+Y redo
    if (((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) ||
        ((e.ctrlKey || e.metaKey) && e.key === 'y')) {
      if (isInput && document.activeElement === searchInput) return;
      e.preventDefault();
      onRedo();
    }
    // Ctrl+E export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
      e.preventDefault();
      onExport();
    }
    // Ctrl+R reset (prevent page reload)
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
      e.preventDefault();
      onReset();
    }
  });
}
