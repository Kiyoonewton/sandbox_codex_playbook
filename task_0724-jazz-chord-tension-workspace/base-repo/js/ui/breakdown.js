// ============================================
// TENSION COMPOSITION DONUTS (VIZ 3)
// ============================================

import { CHORDS, getChordPairs } from '../data.js';

export function renderBreakdown(onCellClick) {
  var grid = document.getElementById('breakdown-grid');

  CHORDS.forEach(function(chord, idx) {
    var cell = document.createElement('div');
    cell.className = 'breakdown-cell';
    cell.dataset.index = idx;
    cell.tabIndex = 0;
    cell.setAttribute('role', 'button');
    cell.setAttribute('aria-label', 'View tension composition for ' + chord.symbol);

    var canvas = document.createElement('canvas');
    canvas.width = 130; canvas.height = 130;
    cell.appendChild(canvas);

    var label = document.createElement('div');
    label.className = 'breakdown-label';
    label.textContent = chord.symbol;
    cell.appendChild(label);

    // Compute segments
    var pairs = getChordPairs(chord.offsets);
    var cons = 0, diss = 0, high = 0;
    pairs.forEach(function(p) {
      if (p.isHighTension) high += p.t;
      else if (p.isTritone || p.type === 'dissonant') diss += p.t;
      else cons += p.t;
    });
    var total = cons + diss + high || 1;

    // Draw donut
    var ctx = canvas.getContext('2d');
    var cx = 65, cy = 65, outerR = 48, innerR = 30;

    ctx.beginPath(); ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerR, Math.PI * 2, 0, true);
    ctx.fillStyle = '#111'; ctx.fill();

    var angle = -Math.PI / 2;
    var segments = [
      { val: cons, color: '#2ecc71' },
      { val: diss, color: '#f5a623' },
      { val: high, color: '#e74c3c' },
    ];
    segments.forEach(function(seg) {
      if (seg.val <= 0) return;
      var sweep = (seg.val / total) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx, cy, outerR, angle, angle + sweep);
      ctx.arc(cx, cy, innerR, angle + sweep, angle, true);
      ctx.closePath();
      ctx.fillStyle = seg.color; ctx.globalAlpha = 0.85; ctx.fill();
      ctx.globalAlpha = 1;
      angle += sweep;
    });

    var pctDissonant = ((diss + high) / total * 100).toFixed(0);
    ctx.fillStyle = '#888'; ctx.font = '700 15px "Space Mono"'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(pctDissonant + '%', cx, cy - 3);
    ctx.fillStyle = '#444'; ctx.font = '7px "Space Mono"';
    ctx.fillText('dissonant', cx, cy + 10);

    cell.addEventListener('click', function() {
      if (onCellClick) onCellClick(idx);
    });
    cell.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (onCellClick) onCellClick(idx);
      }
    });

    grid.appendChild(cell);
  });
}

export function syncBreakdownActive(idx) {
  document.querySelectorAll('.breakdown-cell').forEach(function(c, i) {
    c.classList.toggle('active', i === idx);
  });
}
