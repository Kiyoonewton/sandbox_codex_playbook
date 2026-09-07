// Category-card keyboard and accessibility behavior.
(function () {
  'use strict';

  function setCategoryState(card, expanded) {
    if (!card) return;
    card.classList.toggle('expanded', expanded);
    card.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    const toggle = card.querySelector('.category-toggle');
    if (toggle) toggle.textContent = expanded ? '▾' : '▸';
  }

  function activateCategory(card) {
    if (!card || !card.classList.contains('category-card')) return;
    const shouldExpand = !card.classList.contains('expanded');

    document.querySelectorAll('.category-card.expanded').forEach((other) => {
      setCategoryState(other, false);
    });

    if (shouldExpand) {
      setCategoryState(card, true);
      setTimeout(() => card.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }
  }

  // Replace the app's visual-only toggle so mouse clicks and number shortcuts
  // use the same state transition as keyboard activation.
  window.toggleCategory = activateCategory;

  document.addEventListener('keydown', (event) => {
    const card = event.target.closest && event.target.closest('.category-card');

    if (card && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      event.stopImmediatePropagation();
      activateCategory(card);
      return;
    }

    if (event.key === 'Escape') {
      const expanded = document.querySelectorAll('.category-card.expanded');
      if (expanded.length) {
        expanded.forEach((item) => setCategoryState(item, false));
      }
    }
  }, true);
})();
