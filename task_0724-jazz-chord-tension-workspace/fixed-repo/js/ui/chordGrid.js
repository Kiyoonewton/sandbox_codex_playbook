// ============================================
// CHORD GRID UI (VIZ 1)
// ============================================

import { CHORDS, calcTension, tensionColor } from '../data.js';
import { playChordAudio } from '../audio.js';
import { createStaffSVG, triggerRipples } from '../staff.js';

let activeColIndex = -1;
export const colSVGs = [];

export function renderChordGrid(onActivate) {
  const grid = document.getElementById('chord-grid');

  CHORDS.forEach((chord, idx) => {
    const col = document.createElement('div');
    col.className = 'chord-col';
    col.dataset.index = idx;
    col.tabIndex = 0;
    col.setAttribute('role', 'button');
    col.setAttribute('aria-pressed', 'false');
    col.setAttribute('aria-label', chord.name + ' chord: ' + chord.symbol);

    col.innerHTML =
      '<div class="chord-name">' + chord.symbol + '</div>' +
      '<div class="chord-label-small">' + chord.name + '</div>';

    var wrap = document.createElement('div');
    wrap.className = 'staff-wrap';

    var svg = createStaffSVG(
      chord,
      function(e, name, midi) { showTooltip(e, name + ' (MIDI ' + midi + ')'); },
      function() { hideTooltip(); },
      function(e, n1, n2, iName, tension) { showTooltip(e, n1 + '\u2013' + n2 + ': ' + iName + ' (tension: ' + tension.toFixed(1) + ')'); },
      function() { hideTooltip(); }
    );

    wrap.appendChild(svg);
    col.appendChild(wrap);
    colSVGs.push(svg);

    // Play button
    var playBtn = document.createElement('button');
    playBtn.className = 'play-btn';
    playBtn.innerHTML = '<span>\u25B6</span> PLAY';
    playBtn.setAttribute('aria-label', 'Play ' + chord.name + ' chord');
    playBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      playChordAudio(chord);
      triggerRipples(svg);
      activateCol(col, idx, onActivate);
    });
    col.appendChild(playBtn);

    // Tension meter
    var tension = calcTension(chord.offsets);
    var pct = Math.min((tension / 18) * 100, 100);
    var meter = document.createElement('div');
    meter.className = 'tension-meter';
    meter.setAttribute('role', 'meter');
    meter.setAttribute('aria-label', 'Tension level');
    meter.setAttribute('aria-valuenow', tension.toFixed(1));
    var fill = document.createElement('div');
    fill.className = 'tension-fill';
    fill.style.background = tensionColor(pct);
    fill.dataset.targetWidth = pct;
    meter.appendChild(fill);
    col.appendChild(meter);

    var scoreEl = document.createElement('div');
    scoreEl.className = 'tension-score';
    scoreEl.textContent = tension.toFixed(1);
    col.appendChild(scoreEl);

    col.addEventListener('click', function() {
      playChordAudio(chord);
      triggerRipples(svg);
      activateCol(col, idx, onActivate);
    });
    col.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playChordAudio(chord);
        triggerRipples(svg);
        activateCol(col, idx, onActivate);
      }
    });

    grid.appendChild(col);
  });
}

export function activateCol(col, idx, onActivate) {
  document.querySelectorAll('.chord-col').forEach(function(c) {
    c.classList.remove('active');
    c.setAttribute('aria-pressed', 'false');
  });
  col.classList.add('active');
  col.setAttribute('aria-pressed', 'true');
  activeColIndex = idx;
  if (onActivate) onActivate(idx);
}

export function getActiveColIndex() { return activeColIndex; }
export function setActiveColIndex(idx) { activeColIndex = idx; }

var tooltip = document.getElementById('tooltip');

export function showTooltip(e, text) {
  tooltip.textContent = text;
  tooltip.classList.add('visible');
  moveTooltip(e);
}

export function hideTooltip() {
  tooltip.classList.remove('visible');
}

function moveTooltip(e) {
  var x = e.clientX + 12, y = e.clientY - 28;
  if (x + 240 > window.innerWidth) x = e.clientX - 250;
  if (y < 4) y = e.clientY + 16;
  tooltip.style.left = x + 'px';
  tooltip.style.top = y + 'px';
}

document.addEventListener('mousemove', function(e) {
  if (tooltip.classList.contains('visible')) moveTooltip(e);
});
