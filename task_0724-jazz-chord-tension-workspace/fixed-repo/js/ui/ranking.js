// ============================================
// TENSION RANKING (HORIZONTAL BARS)
// ============================================

import { CHORDS, calcTension, tensionColor } from '../data.js';

export function renderRanking() {
  var container = document.getElementById('tension-ranking');
  var data = CHORDS.map(function(c) {
    return { name: c.symbol, tension: calcTension(c.offsets) };
  }).sort(function(a, b) { return b.tension - a.tension; });
  var maxT = data[0].tension;

  data.forEach(function(d) {
    var pct = (d.tension / maxT) * 100;
    var row = document.createElement('div');
    row.className = 'rank-row';
    row.innerHTML =
      '<div class="rank-label">' + d.name + '</div>' +
      '<div class="rank-bar-bg"><div class="rank-bar-fill" style="width:' + pct + '%;background:' + tensionColor(pct) + ';"></div></div>' +
      '<div class="rank-val">' + d.tension.toFixed(1) + '</div>';
    container.appendChild(row);
  });
}
