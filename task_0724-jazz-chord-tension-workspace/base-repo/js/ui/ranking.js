// ============================================
// TENSION RANKING (HORIZONTAL BARS)
// ============================================

import { CHORDS, calcTension, tensionColor } from '../data.js';

export function renderRanking(onRowClick) {
  var container = document.getElementById('tension-ranking');
  var data = CHORDS.map(function(c, chordIndex) {
    return { name: c.symbol, tension: calcTension(c.offsets), chordIndex: chordIndex };
  }).sort(function(a, b) { return b.tension - a.tension; });
  var maxT = data[0].tension;

  data.forEach(function(d, rankIndex) {
    var pct = (d.tension / maxT) * 100;
    var row = document.createElement('div');
    row.className = 'rank-row';
    row.dataset.chordIndex = d.chordIndex;
    row.tabIndex = 0;
    row.setAttribute('role', 'button');
    row.setAttribute('aria-label', 'Select ' + d.name + ' from tension spectrum');
    row.setAttribute('aria-pressed', 'false');
    row.innerHTML =
      '<div class="rank-label">' + d.name + '</div>' +
      '<div class="rank-bar-bg"><div class="rank-bar-fill" style="width:' + pct + '%;background:' + tensionColor(pct) + ';"></div></div>' +
      '<div class="rank-val">' + d.tension.toFixed(1) + '</div>';

    function chooseRow() {
      document.querySelectorAll('#tension-ranking .rank-row').forEach(function(item) {
        item.classList.remove('active');
        item.setAttribute('aria-pressed', 'false');
      });
      row.classList.add('active');
      row.setAttribute('aria-pressed', 'true');
      if (onRowClick) onRowClick(rankIndex);
    }

    row.addEventListener('click', chooseRow);
    row.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chooseRow();
      }
    });
    container.appendChild(row);
  });
}
