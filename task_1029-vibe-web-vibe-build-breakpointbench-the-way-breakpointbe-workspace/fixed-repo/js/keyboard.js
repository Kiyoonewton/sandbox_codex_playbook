/**
 * BreakpointBench — Keyboard Handler
 * All keyboard shortcuts and command palette
 */

import { state } from './state.js';
import { $ } from './utils.js';

let handlers = {};

/** Register action handlers from main UI */
export function registerHandlers(h) {
  handlers = h;
}

/** Main keyboard handler */
export function handleKeyboard(e) {
  const active = document.activeElement?.id;
  const isInput = active === 'urlInput' || active === 'modalInput' || active === 'modalLabel';

  // Cmd/Ctrl + K → focus URL
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    $('#urlInput')?.focus();
    $('#urlInput')?.select();
    return;
  }

  // Cmd/Ctrl+Z / Cmd/Ctrl+Y → undo/redo
  if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
    e.preventDefault();
    handlers.undo?.(e.shiftKey);
    return;
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
    e.preventDefault();
    handlers.redo?.();
    return;
  }

  // Don't capture when typing in inputs
  if (isInput) return;

  switch (e.key) {
    case 's':
      e.preventDefault();
      handlers.toggleSync?.();
      break;
    case 'f':
      e.preventDefault();
      handlers.toggleFitMode?.();
      break;
    case 'e':
      e.preventDefault();
      handlers.export?.();
      break;
    case '=':
    case '+':
      e.preventDefault();
      handlers.zoomIn?.();
      break;
    case '-':
      e.preventDefault();
      handlers.zoomOut?.();
      break;
    case '0':
      e.preventDefault();
      handlers.zoomReset?.();
      break;
    case 'Escape':
      handlers.closeModal?.();
      break;
  }
}
