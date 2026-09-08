// ============================================================
// Keyboard Navigation & Shortcuts
// ============================================================

import { closeDetail } from './ui/detail-panel.js';

export function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDetail();
      return;
    }

    // Number keys switch sections (1-5)
    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      const sections = ['plants', 'doctor', 'light', 'water', 'quiz'];
      const num = parseInt(e.key);
      if (num >= 1 && num <= 5 && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
        e.preventDefault();
        const targetSection = sections[num - 1];
        document.querySelector(`[data-section="${targetSection}"]`)?.click();
      }

      // / focuses search
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'SELECT') {
        e.preventDefault();
        const searchInput = document.querySelector('#filter-search');
        if (searchInput) {
          document.querySelector('[data-section="plants"]')?.click();
          setTimeout(() => searchInput.focus(), 100);
        }
      }
    }

    // Arrow key navigation for plant cards
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      const cards = Array.from(document.querySelectorAll('.plant-card'));
      const current = cards.indexOf(document.activeElement);
      if (current >= 0 && current < cards.length - 1) {
        e.preventDefault();
        cards[current + 1].focus();
        cards[current + 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      const cards = Array.from(document.querySelectorAll('.plant-card'));
      const current = cards.indexOf(document.activeElement);
      if (current > 0) {
        e.preventDefault();
        cards[current - 1].focus();
        cards[current - 1].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }

    // Tab traps inside detail panel
    if (e.key === 'Tab') {
      const panel = document.querySelector('#detail-panel.open');
      if (panel) {
        const focusable = panel.querySelectorAll('button, [tabindex]');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    }
  });

  // Keyboard shortcut hints for nav buttons
  const sectionKeys = ['1', '2', '3', '4', '5'];
  document.querySelectorAll('.nav-btn').forEach((btn, i) => {
    if (sectionKeys[i]) {
      btn.setAttribute('title', `Keyboard shortcut: ${sectionKeys[i]}`);
    }
  });
}
