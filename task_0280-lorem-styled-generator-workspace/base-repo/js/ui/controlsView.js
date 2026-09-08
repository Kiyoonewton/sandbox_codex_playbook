/**
 * Controls panel — flavor tabs, quantity input, unit tabs, generate button, undo/redo
 */

import { FLAVORS, FLAVOR_KEYS } from '../flavors.js';
import { $ } from '../utils.js';

const UNITS = ['paragraphs', 'sentences', 'words'];
const MAX_MAP = { paragraphs: 50, sentences: 100, words: 500 };

export function initControlsView(state, { onFlavorChange, onUnitChange, onGenerate, onUndo, onRedo }) {
  const $flavorTabs = $('flavorTabs');
  const $unitTabs = $('unitTabs');
  const $quantityInput = $('quantityInput');
  const $generateBtn = $('generateBtn');
  const $undoBtn = $('undoBtn');
  const $redoBtn = $('redoBtn');

  // Build flavor tabs
  FLAVOR_KEYS.forEach(key => {
    const btn = document.createElement('button');
    btn.className = 'flavor-tab';
    btn.role = 'tab';
    btn.dataset.flavor = key;
    btn.setAttribute('aria-selected', key === state.flavor);
    btn.textContent = FLAVORS[key].label;
    btn.addEventListener('click', () => {
      state.flavor = key;
      updateFlavorTabs();
      onFlavorChange(key);
    });
    btn.addEventListener('keydown', e => handleFlavorKeyboard(e, key));
    $flavorTabs.appendChild(btn);
  });

  // Unit tab listeners
  $unitTabs.querySelectorAll('.unit-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      state.unit = btn.dataset.unit;
      updateUnitTabs();
      clampQuantity();
      onUnitChange(state.unit);
    });
    btn.addEventListener('keydown', e => handleUnitKeyboard(e, btn.dataset.unit));
  });

  // Quantity input
  $quantityInput.value = state.quantity;
  $quantityInput.addEventListener('change', () => {
    const max = MAX_MAP[state.unit];
    state.quantity = clamp(parseInt($quantityInput.value) || 1, 1, max);
    $quantityInput.value = state.quantity;
    onUnitChange(state.unit);
  });
  $quantityInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); $generateBtn.click(); }
  });

  // Generate
  $generateBtn.addEventListener('click', () => {
    const qty = parseInt($quantityInput.value) || 0;
    const max = MAX_MAP[state.unit];
    if (qty < 1) { onGenerate(null, 'Enter a quantity of at least 1.'); return; }
    if (qty > max) { onGenerate(null, `Max ${max} ${state.unit} at once.`); return; }
    state.quantity = qty;
    onGenerate(state.quantity);
  });

  // Undo / Redo
  $undoBtn.addEventListener('click', onUndo);
  $redoBtn.addEventListener('click', onRedo);

  return {
    updateFlavorTabs() {
      $flavorTabs.querySelectorAll('.flavor-tab').forEach(b => {
        b.setAttribute('aria-selected', b.dataset.flavor === state.flavor);
      });
    },
    updateUnitTabs() {
      $unitTabs.querySelectorAll('.unit-tab').forEach(b => {
        b.setAttribute('aria-selected', b.dataset.unit === state.unit);
      });
    },
    setQuantity(v) { $quantityInput.value = v; state.quantity = v; },
    updateUndoRedo(canUndo, canRedo) {
      $undoBtn.disabled = !canUndo;
      $redoBtn.disabled = !canRedo;
    },
    getQuantityMax() { return MAX_MAP[state.unit]; }
  };

  function updateFlavorTabs() {
    $flavorTabs.querySelectorAll('.flavor-tab').forEach(b => {
      b.setAttribute('aria-selected', b.dataset.flavor === state.flavor);
    });
  }

  function updateUnitTabs() {
    $unitTabs.querySelectorAll('.unit-tab').forEach(b => {
      b.setAttribute('aria-selected', b.dataset.unit === state.unit);
    });
  }

  function clampQuantity() {
    const max = MAX_MAP[state.unit];
    if (state.quantity > max) { state.quantity = max; $quantityInput.value = max; }
  }

  function handleFlavorKeyboard(e, currentKey) {
    const idx = FLAVOR_KEYS.indexOf(currentKey);
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % FLAVOR_KEYS.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + FLAVOR_KEYS.length) % FLAVOR_KEYS.length;
    if (next >= 0) {
      e.preventDefault();
      state.flavor = FLAVOR_KEYS[next];
      updateFlavorTabs();
      $flavorTabs.querySelector(`[data-flavor="${FLAVOR_KEYS[next]}"]`).focus();
      onFlavorChange(FLAVOR_KEYS[next]);
    }
  }

  function handleUnitKeyboard(e, currentUnit) {
    const idx = UNITS.indexOf(currentUnit);
    let next = -1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (idx + 1) % UNITS.length;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (idx - 1 + UNITS.length) % UNITS.length;
    if (next >= 0) {
      e.preventDefault();
      state.unit = UNITS[next];
      updateUnitTabs();
      clampQuantity();
      $unitTabs.querySelector(`[data-unit="${UNITS[next]}"]`).focus();
      onUnitChange(state.unit);
    }
  }
}

function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }
