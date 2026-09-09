// =============================================
// Shared Helpers
// =============================================

export function $(sel, parent = document) { return parent.querySelector(sel); }
export function $$(sel, parent = document) { return [...parent.querySelectorAll(sel)]; }

export function formatCurrency(n) {
  return '$' + n.toLocaleString('en-US');
}

export function formatNumber(n) {
  return n.toLocaleString('en-US');
}

export function formatPercent(n) {
  return n.toFixed(1) + '%';
}

export function highlightMatch(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark style="background:var(--accent-light);color:var(--accent);border-radius:2px;padding:0 1px;">$1</mark>');
}
