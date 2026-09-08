// ============================================
// INTERVAL TABLE (VIZ 2)
// ============================================

import { CHORDS, calcTension, getChordPairs, tensionColor, midiToName } from '../data.js';

export function renderIntervalTable(onRowClick) {
  var tbody = document.getElementById('interval-tbody');

  var rankedChords = CHORDS.map(function(chord, chordIndex) {
    return { chord: chord, chordIndex: chordIndex, tension: calcTension(chord.offsets) };
  }).sort(function(a, b) {
    return b.tension - a.tension;
  });

  rankedChords.forEach(function(entry, rowIndex) {
    var chord = entry.chord;
    var tension = entry.tension;
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
    tr.dataset.index = rowIndex;
    tr.dataset.chordIndex = entry.chordIndex;
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
      if (onRowClick) onRowClick(entry.chordIndex);
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

export function syncIntervalActive(chordIndex) {
  document.querySelectorAll('#interval-tbody tr').forEach(function(row) {
    var active = Number(row.dataset.chordIndex) === chordIndex;
    row.classList.toggle('active', active);
    row.setAttribute('aria-pressed', active ? 'true' : 'false');
  });
}
