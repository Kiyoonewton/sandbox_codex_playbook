// ============================================
// INTERVAL TABLE (VIZ 2)
// ============================================

import { CHORDS, calcTension, getChordPairs, tensionColor, midiToName } from '../data.js';

export function renderIntervalTable(onRowClick) {
  var tbody = document.getElementById('interval-tbody');

  CHORDS.forEach(function(chord, idx) {
    var tension = calcTension(chord.offsets);
    var pairs = getChordPairs(chord.offsets);
    var midis = chord.offsets.map(function(o) { return chord.root + o; });

    var html = pairs.map(function(p) {
      var n1 = midiToName(midis[p.i], chord.flats), n2 = midiToName(midis[p.j], chord.flats);
      var cls = 'int-consonant';
      if (p.isHighTension) cls = 'int-high';
      else if (p.isTritone || p.type === 'dissonant') cls = 'int-dissonant';
      else if (p.type === 'neutral') cls = 'int-neutral';
      return '<span class="' + cls + '">' + n1 + '\u2013' + n2 + ' ' + p.name + '</span>';
    }).join(', ');

    var pct = Math.min((tension / 18) * 100, 100);
    var tr = document.createElement('tr');
    tr.dataset.index = idx;
    tr.tabIndex = 0;
    tr.setAttribute('role', 'button');
    tr.setAttribute('aria-label', 'Select ' + chord.symbol + ' interval analysis');
    tr.setAttribute('aria-pressed', 'false');
    tr.innerHTML =
      '<td style="color:' + chord.color + ';font-weight:bold;white-space:nowrap;">' + chord.symbol + '</td>' +
      '<td>' + html + '</td>' +
      '<td style="font-weight:bold;color:' + tensionColor(pct) + ';white-space:nowrap;">' + tension.toFixed(1) + '</td>' +
      '<td style="color:#555;">' + chord.desc + '</td>';

    function chooseRow() {
      if (onRowClick) onRowClick(idx);
    }

    tr.addEventListener('click', chooseRow);
    tr.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        chooseRow();
      }
    });

    tbody.appendChild(tr);
  });
}

export function syncIntervalActive(idx) {
  document.querySelectorAll('#interval-tbody tr').forEach(function(row, i) {
    var active = i === idx;
    row.classList.toggle('active', active);
    row.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}
