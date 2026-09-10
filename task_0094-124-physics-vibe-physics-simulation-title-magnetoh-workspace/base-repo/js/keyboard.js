// ═══════════════════════════════════════════════════════════
// keyboard.js — Keyboard shortcuts + help overlay
// ═══════════════════════════════════════════════════════════

import { popUndo, popRedo } from './state.js';

export function setupKeyboard(app) {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT') return;

    // Ctrl+Z / Ctrl+Y
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); app.undo(); return; }
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); app.redo(); return; }

    switch (e.key.toLowerCase()) {
      case 'r': app.reset(); break;
      case ' ': e.preventDefault(); app.togglePause(); break;
      case 'k': app.triggerMode(1, 1); break;
      case 's': app.triggerMode(0, 0); break;
      case 'b': app.triggerMode(2, 1); break;
      case 'c': app.toggleAutoRotate(); break;
      case 'f': app.toggleFieldLines(); break;
      case 'p': app.screenshot(); break;
      case '?': toggleHelp(); break;
    }
  });
}

function toggleHelp() {
  const hp = document.getElementById('keyboard-help');
  hp.style.display = hp.style.display === 'none' ? 'flex' : 'none';
}

export function setupHelpButton() {
  document.getElementById('btn-help').addEventListener('click', toggleHelp);
}
