// ============================================
// MAIN ENTRY POINT
// ============================================

import { CHORDS } from './data.js';
import { renderChordGrid, activateCol, getActiveColIndex, colSVGs } from './ui/chordGrid.js';
import { renderIntervalTable } from './ui/intervalTable.js';
import { renderBreakdown, syncBreakdownActive } from './ui/breakdown.js';
import { renderRanking } from './ui/ranking.js';
import { renderBuilder } from './ui/builder.js';
import { playChordAudio } from './audio.js';
import { triggerRipples } from './staff.js';

function onActivate(idx) { syncBreakdownActive(idx); }

function init() {
  renderChordGrid(onActivate);

  renderIntervalTable(function(idx) {
    var cols = document.querySelectorAll('.chord-col');
    cols[idx].dispatchEvent(new MouseEvent('click', { bubbles: true }));
    cols[idx].scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  renderBreakdown(function(idx) {
    var cols = document.querySelectorAll('.chord-col');
    var cell = document.querySelectorAll('.breakdown-cell')[idx];
    document.querySelectorAll('.breakdown-cell').forEach(function(c) { c.classList.remove('active'); });
    cell.classList.add('active');
    cols.forEach(function(c) { c.classList.remove('active'); c.setAttribute('aria-pressed', 'false'); });
    cols[idx].classList.add('active');
    cols[idx].setAttribute('aria-pressed', 'true');
    playChordAudio(CHORDS[idx]);
    triggerRipples(colSVGs[idx]);
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
      if (next >= 0 && next < cols.length) {
        playChordAudio(CHORDS[next]);
        activateCol(cols[next], next, onActivate);
        triggerRipples(colSVGs[next]);
        cols[next].focus();
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      var prev = Math.max(currentIdx - 1, 0);
      if (prev >= 0 && prev < cols.length) {
        playChordAudio(CHORDS[prev]);
        activateCol(cols[prev], prev, onActivate);
        triggerRipples(colSVGs[prev]);
        cols[prev].focus();
      }
    }
  });

  requestAnimationFrame(function() {
    setTimeout(function() {
      document.querySelectorAll('.tension-fill').forEach(function(f) { f.style.width = f.dataset.targetWidth + '%'; });
    }, 300);
  });
}

document.addEventListener('DOMContentLoaded', init);
