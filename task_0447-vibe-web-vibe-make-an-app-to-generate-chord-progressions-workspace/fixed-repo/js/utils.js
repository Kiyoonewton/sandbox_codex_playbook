/**
 * Shared Utilities — Chord Forge
 */

/**
 * Animate a button selection with a pulse effect
 */
export function animateSelection(element) {
  element.classList.add('pulse-select');
  setTimeout(() => element.classList.remove('pulse-select'), 300);
}

/**
 * Set the select dropdown value and trigger change event
 * (Workaround for optgroup select value issues in some browsers)
 */
export function setSelectValue(selectId, value) {
  const sel = document.getElementById(selectId);
  for (const opt of sel.options) {
    if (opt.value === value) {
      opt.selected = true;
      break;
    }
  }
  sel.dispatchEvent(new Event('change', { bubbles: true }));
}

/**
 * Format a date for display
 */
export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString();
}
