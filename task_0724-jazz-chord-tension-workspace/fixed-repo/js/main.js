// ============================================
// MAIN ENTRY POINT
// ============================================

import { CHORDS } from './data.js';
import { renderChordGrid, activateCol, getActiveColIndex, colSVGs } from './ui/chordGrid.js';
import { renderIntervalTable, syncIntervalActive } from './ui/intervalTable.js';
import { renderBreakdown, syncBreakdownActive } from './ui/breakdown.js';
import { renderRanking } from './ui/ranking.js';
import { renderBuilder } from './ui/builder.js';
import { playChordAudio } from './audio.js';
import { triggerRipples } from './staff.js';

function syncSelection(idx) {
  syncBreakdownActive(idx);
  syncIntervalActive(idx);
}

function selectChord(idx, options) {
  var cols = document.querySelectorAll('.chord-col');
  if (idx < 0 || idx >= cols.length) return;
  activateCol(cols[idx], idx, syncSelection);
  playChordAudio(CHORDS[idx]);
  triggerRipples(colSVGs[idx]);
  if (options && options.focus) cols[idx].focus();
  if (options && options.scroll) cols[idx].scrollIntoView({ block: 'center', behavior: 'smooth' });
}

function init() {
  renderChordGrid(syncSelection);

  renderIntervalTable(function(idx) {
    selectChord(idx, { scroll: true });
  });

  renderBreakdown(function(idx) {
    selectChord(idx);
  });

  renderRanking();
  renderBuilder();

  document.addEventListener('keydown', function(e) {
    if (e.target.closest('.builder-note-col') || e.target.closest('.builder-panel')) return;
    var cols = document.querySelectorAll('.chord-col');
    var currentIdx = getActiveColIndex();

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      var next = Math.min(currentIdx + 1, cols.length - 1);
      if (next >= 0 && next < cols.length) selectChord(next, { focus: true });
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      var prev = Math.max(currentIdx - 1, 0);
      if (prev >= 0 && prev < cols.length) selectChord(prev, { focus: true });
    }
  });

  requestAnimationFrame(function() {
    setTimeout(function() {
      document.querySelectorAll('.tension-fill').forEach(function(f) {
        f.style.width = f.dataset.targetWidth + '%';
      });
    }, 300);
  });
}

document.addEventListener('DOMContentLoaded', init);
