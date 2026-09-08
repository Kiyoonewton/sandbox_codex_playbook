/**
 * History panel — saved generation history from localStorage
 */

import { FLAVORS } from '../flavors.js';
import { $, esc } from '../utils.js';

const STORAGE_KEY = 'filler_history';
const MAX_HISTORY = 20;

export function initHistoryView(state, { onRestore }) {
  const $historyList = $('historyList');
  const $historyClearBtn = $('historyClearBtn');

  $historyClearBtn.addEventListener('click', () => {
    clearHistory();
    render();
  });

  return { save, render, clearHistory };

  function getHistory() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  }

  function save(item) {
    const h = getHistory();
    h.unshift(item);
    if (h.length > MAX_HISTORY) h.pop();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(h));
    render();
  }

  function clearHistory() {
    localStorage.removeItem(STORAGE_KEY);
  }

  function render() {
    const h = getHistory();
    if (!h.length) {
      $historyList.innerHTML = '<div class="history-empty">No history yet.</div>';
      return;
    }
    $historyList.innerHTML = '';
    h.forEach(item => {
      const div = document.createElement('div');
      div.className = 'history-item';
      div.tabIndex = 0;
      div.setAttribute('role', 'button');
      div.setAttribute('aria-label',
        `Restore: ${FLAVORS[item.flavor]?.label || item.flavor}, ${item.quantity} ${item.unit}`);

      const preview = item.text.length > 55 ? item.text.slice(0, 55) + '…' : item.text;
      const color = FLAVORS[item.flavor]?.color || '#8b3a2a';
      const label = FLAVORS[item.flavor]?.label || item.flavor;

      div.innerHTML =
        `<div class="history-flavor" style="color:${color}">${label}</div>` +
        `<div class="history-meta">${item.quantity} ${item.unit}</div>` +
        `<div class="history-preview">${esc(preview)}</div>`;

      div.addEventListener('click', () => onRestore(item));
      div.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRestore(item); }
      });
      $historyList.appendChild(div);
    });
  }
}
