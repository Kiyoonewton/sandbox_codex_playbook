// ============================================
// CUSTOM CHORD BUILDER
// ============================================

import { NOTE_NAMES, calcTension, getChordPairs, tensionColor, midiToName } from '../data.js';
import { playBuilderAudio } from '../audio.js';

var BUILDER_INIT = [
  { semitone: 0,  name: 'C',  label: 'ROOT' },
  { semitone: 4,  name: 'E',  label: '3RD' },
  { semitone: 7,  name: 'G',  label: '5TH' },
  { semitone: 11, name: 'B',  label: '7TH' },
  { semitone: 6,  name: 'F#', label: 'EXT' },
];

export var builderState = BUILDER_INIT.map(function(n) { return Object.assign({}, n); });

export function renderBuilder() {
  var row = document.getElementById('builder-row');
  row.innerHTML = '';

  builderState.forEach(function(note, i) {
    var col = document.createElement('div');
    col.className = 'builder-note-col';

    var label = document.createElement('div');
    label.className = 'builder-label';
    label.textContent = note.label;
    col.appendChild(label);

    var btn = document.createElement('div');
    btn.className = 'builder-note-btn';
    btn.textContent = note.name;
    btn.tabIndex = 0;
    btn.setAttribute('role', 'slider');
    btn.setAttribute('aria-label', note.label + ' note');
    btn.setAttribute('aria-valuemin', '0');
    btn.setAttribute('aria-valuemax', '11');
    btn.setAttribute('aria-valuenow', note.semitone);
    btn.setAttribute('aria-valuetext', note.name);

    // Drag support
    var startY = null, startSemi = null;
    function onStart(e) {
      e.preventDefault();
      var cy = e.touches ? e.touches[0].clientY : e.clientY;
      startY = cy; startSemi = builderState[i].semitone;
      btn.classList.add('dragging');
      function onM(e2) {
        if (startY === null) return;
        e2.preventDefault();
        var cy2 = e2.touches ? e2.touches[0].clientY : e2.clientY;
        var delta = Math.round((startY - cy2) / 18);
        var ns = ((startSemi + delta) % 12 + 12) % 12;
        if (ns !== builderState[i].semitone) {
          builderState[i].semitone = ns;
          builderState[i].name = NOTE_NAMES[ns];
          btn.textContent = builderState[i].name;
          btn.setAttribute('aria-valuenow', ns);
          btn.setAttribute('aria-valuetext', NOTE_NAMES[ns]);
          updateBuilderTension();
        }
      }
      function onUp() {
        startY = null;
        btn.classList.remove('dragging');
        document.removeEventListener('mousemove', onM);
        document.removeEventListener('mouseup', onUp);
        document.removeEventListener('touchmove', onM);
        document.removeEventListener('touchend', onUp);
      }
      document.addEventListener('mousemove', onM);
      document.addEventListener('mouseup', onUp);
      document.addEventListener('touchmove', onM, { passive: false });
      document.addEventListener('touchend', onUp);
    }
    btn.addEventListener('mousedown', onStart);
    btn.addEventListener('touchstart', onStart, { passive: false });

    // Keyboard
    btn.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        builderState[i].semitone = (builderState[i].semitone + 1) % 12;
        builderState[i].name = NOTE_NAMES[builderState[i].semitone];
        btn.textContent = builderState[i].name;
        btn.setAttribute('aria-valuenow', builderState[i].semitone);
        updateBuilderTension();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        builderState[i].semitone = ((builderState[i].semitone - 1) % 12 + 12) % 12;
        builderState[i].name = NOTE_NAMES[builderState[i].semitone];
        btn.textContent = builderState[i].name;
        btn.setAttribute('aria-valuenow', builderState[i].semitone);
        updateBuilderTension();
      }
    });

    col.appendChild(btn);

    // Arrow buttons
    var arrows = document.createElement('div');
    arrows.className = 'builder-arrows';
    var up = document.createElement('button');
    up.className = 'arrow-btn'; up.textContent = '\u25B2';
    up.setAttribute('aria-label', 'Raise ' + note.label);
    up.addEventListener('click', function(e) {
      e.stopPropagation();
      builderState[i].semitone = (builderState[i].semitone + 1) % 12;
      builderState[i].name = NOTE_NAMES[builderState[i].semitone];
      btn.textContent = builderState[i].name;
      btn.setAttribute('aria-valuenow', builderState[i].semitone);
      updateBuilderTension();
    });
    var down = document.createElement('button');
    down.className = 'arrow-btn'; down.textContent = '\u25BC';
    down.setAttribute('aria-label', 'Lower ' + note.label);
    down.addEventListener('click', function(e) {
      e.stopPropagation();
      builderState[i].semitone = ((builderState[i].semitone - 1) % 12 + 12) % 12;
      builderState[i].name = NOTE_NAMES[builderState[i].semitone];
      btn.textContent = builderState[i].name;
      btn.setAttribute('aria-valuenow', builderState[i].semitone);
      updateBuilderTension();
    });
    arrows.appendChild(up); arrows.appendChild(down);
    col.appendChild(arrows);
    row.appendChild(col);
  });
  updateBuilderTension();
}

function updateBuilderTension() {
  var offsets = builderState.map(function(n) { return n.semitone; });
  var tension = calcTension(offsets);
  var pct = Math.min((tension / 18) * 100, 100);
  document.getElementById('builder-score-text').textContent = tension.toFixed(1);
  var fill = document.getElementById('builder-tension-fill');
  fill.style.width = pct + '%';
  fill.style.background = tensionColor(pct);

  // Interval tags
  var tagsContainer = document.getElementById('builder-intervals');
  tagsContainer.innerHTML = '';
  var pairs = getChordPairs(offsets);
  var midis = offsets.map(function(o) { return 60 + o; });
  pairs.forEach(function(p) {
    var n1 = midiToName(midis[p.i]), n2 = midiToName(midis[p.j]);
    var cls = 'consonant';
    if (p.isHighTension) cls = 'high';
    else if (p.isTritone || p.type === 'dissonant') cls = 'dissonant';
    else if (p.type === 'neutral') cls = 'neutral';
    var tag = document.createElement('span');
    tag.className = 'builder-int-tag ' + cls;
    tag.textContent = n1 + '\u2013' + n2 + ' ' + p.name;
    tagsContainer.appendChild(tag);
  });
}

// Play button
document.getElementById('builder-play').addEventListener('click', function() {
  playBuilderAudio(builderState);
});

// Reset button
document.getElementById('builder-reset').addEventListener('click', function() {
  BUILDER_INIT.forEach(function(init, i) {
    builderState[i].semitone = init.semitone;
    builderState[i].name = init.name;
  });
  renderBuilder();
});
