// =============================================
// Focus Trap Utility for Dialogs
// =============================================

const _trapMap = new WeakMap();

export function trapFocus(dialog) {
  const focusableSelectors = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  function getFocusable() {
    return [...dialog.querySelectorAll(focusableSelectors)].filter(
      el => el.offsetParent !== null
    );
  }

  function handleKeydown(e) {
    if (e.key !== 'Tab') return;
    const focusable = getFocusable();
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  // Remove any existing trap on this dialog
  releaseFocusTrap(dialog);
  dialog.addEventListener('keydown', handleKeydown);
  _trapMap.set(dialog, handleKeydown);

  return () => {
    dialog.removeEventListener('keydown', handleKeydown);
    _trapMap.delete(dialog);
  };
}

export function releaseFocusTrap(dialog) {
  const existing = _trapMap.get(dialog);
  if (existing) {
    dialog.removeEventListener('keydown', existing);
    _trapMap.delete(dialog);
  }
}
