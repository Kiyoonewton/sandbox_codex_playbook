// ═══════════════════════════════════════════════════════════
// utils.js — Shared helpers: tweening, mobile detection
// ═══════════════════════════════════════════════════════════

export function isMobile() {
  return window.innerWidth < 600;
}

export function showCDNError(name) {
  const el = document.getElementById('error-banner');
  el.style.display = 'block';
  el.textContent = 'CDN load failed: ' + name + '. Some features may be unavailable.';
}

export function smoothTween(obj, opts) {
  const start = { x: obj.x, y: obj.y, z: obj.z };
  const dur = (opts.duration || 1) * 1000;
  const t0 = performance.now();
  (function tick() {
    const t = Math.min(1, (performance.now() - t0) / dur);
    const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    obj.x = start.x + (opts.x - start.x) * ease;
    obj.y = start.y + (opts.y - start.y) * ease;
    obj.z = start.z + (opts.z - start.z) * ease;
    if (t < 1) requestAnimationFrame(tick);
  })();
}

export function syncSlidersFromState(s) {
  const el = (id) => document.getElementById(id);
  el('sl-q0').value = s.q0;
  el('sl-qedge').value = s.qedge;
  el('sl-beta').value = s.beta;
  el('sl-alpha').value = s.alpha;
  el('sl-lines').value = s.linesPerSurface;
  el('sl-circuits').value = s.toroidalCircuits;
  el('val-q0').textContent = s.q0.toFixed(2);
  el('val-qedge').textContent = s.qedge.toFixed(2);
  el('val-beta').textContent = s.beta.toFixed(3);
  el('val-alpha').textContent = s.alpha.toFixed(2);
  el('val-lines').textContent = s.linesPerSurface;
  el('val-circuits').textContent = s.toroidalCircuits;
}
