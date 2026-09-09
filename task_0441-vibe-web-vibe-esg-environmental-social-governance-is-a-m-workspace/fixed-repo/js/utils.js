/* utils.js — Shared helpers */
window.U = {};
U.scoreColor = function(c) { return c >= 70 ? 'var(--env)' : c >= 40 ? 'var(--alert)' : 'var(--crit)'; };
U.scoreGrade = function(c) { return c >= 90 ? 'A+' : c >= 80 ? 'A' : c >= 70 ? 'B+' : c >= 60 ? 'B' : c >= 50 ? 'C+' : c >= 40 ? 'C' : c >= 30 ? 'D' : 'F'; };
U.fmtNum = function(n) { if (n == null) return '—'; if (n >= 1e12) return '$' + (n / 1e12).toFixed(1) + 'T'; if (n >= 1e9) return '$' + (n / 1e9).toFixed(1) + 'B'; if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M'; return typeof n === 'number' ? n.toLocaleString() : String(n); };
U.randVar = function(base, spread) { return Math.max(10, Math.min(95, base + Math.floor((Math.random() - .5) * spread * 2))); };
U.clamp = function(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); };
U.toast = function(msg, type) { type = type || ''; var c = document.getElementById('toastContainer'); var t = document.createElement('div'); t.className = 'toast ' + type; t.textContent = msg; c.appendChild(t); setTimeout(function() { t.remove(); }, 3000); };
U.CIRC = 2 * Math.PI * 78;
U.RING_CIRC = 2 * Math.PI * 52;
U.animArc = function(id, score, color) {
  var arc = document.getElementById(id); if (!arc) return;
  arc.style.transition = 'none';
  arc.setAttribute('stroke-dashoffset', U.CIRC);
  arc.setAttribute('stroke', color);
  requestAnimationFrame(function() { requestAnimationFrame(function() {
    arc.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)';
    arc.setAttribute('stroke-dashoffset', U.CIRC - (score / 100) * U.CIRC);
  }); });
};
U.animRing = function(score, color) {
  var arc = document.getElementById('overallArc'); if (!arc) return;
  arc.style.transition = 'none';
  arc.setAttribute('stroke-dashoffset', U.RING_CIRC);
  arc.setAttribute('stroke', color);
  requestAnimationFrame(function() { requestAnimationFrame(function() {
    arc.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(.4,0,.2,1)';
    arc.setAttribute('stroke-dashoffset', U.RING_CIRC - (score / 100) * U.RING_CIRC);
  }); });
};
U.animNum = function(el, target) {
  var start = performance.now(); var from = parseInt(el.textContent) || 0;
  function tick(now) { var p = Math.min((now - start) / 1500, 1); var ease = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(from + (target - from) * ease); if (p < 1) requestAnimationFrame(tick); }
  requestAnimationFrame(tick);
};
