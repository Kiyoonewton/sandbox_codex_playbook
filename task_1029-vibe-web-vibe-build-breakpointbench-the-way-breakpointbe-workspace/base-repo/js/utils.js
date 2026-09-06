/**
 * BreakpointBench — Utility Helpers
 * Small shared functions used across modules
 */

/** DOM shorthand */
export const $ = (sel) => document.querySelector(sel);
export const $$ = (sel) => document.querySelectorAll(sel);

/** HTML-escape a string */
export function esc(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

/** Get frame height for a given breakpoint width */
export function getFrameHeight(w) {
  if (w <= 320) return 400;
  if (w <= 390) return 450;
  if (w <= 768) return 500;
  if (w <= 1024) return 520;
  if (w <= 1280) return 540;
  return 560;
}

/** Show a toast notification */
let toastTimer;
export function showToast(msg, type = '') {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.className = 'toast';
  if (type) t.classList.add(type);
  void t.offsetWidth; // force reflow for animation restart
  t.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('visible'), 2500);
}

/** Get device icon SVG */
export function getDeviceIcon(t) {
  if (t === 'phone') {
    return `<svg width="12" height="16" viewBox="0 0 12 16" fill="none"><rect x="1" y="1" width="10" height="14" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="M4 12.5h4" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>`;
  }
  if (t === 'tablet') {
    return `<svg width="14" height="16" viewBox="0 0 14 16" fill="none"><rect x="1" y="1" width="12" height="14" rx="2" stroke="currentColor" stroke-width="1.2"/><path d="M5 12.5h4" stroke="currentColor" stroke-width="1" stroke-linecap="round"/></svg>`;
  }
  return `<svg width="16" height="14" viewBox="0 0 16 14" fill="none"><rect x="1" y="1" width="14" height="9" rx="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M5 14h6M8 10v4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>`;
}

/** Start the status bar clock */
export function startClock() {
  const update = () => {
    const n = new Date();
    const el = $('#statusTime');
    if (el) el.textContent = String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0');
  };
  update();
  setInterval(update, 30000);
}

/** Get domain from URL string */
export function getDomain(url) {
  try { return new URL(url).hostname; }
  catch { return url; }
}
