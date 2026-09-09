/**
 * Chord Forge - Main Application
 * A chord progression & scale generator for songwriters
 */

import {
  NOTE_NAMES, SCALES, CHORD_TYPES, PROGRESSIONS,
  getNoteName, getNoteSemitone, getScaleNotes, getChordNotes,
  getDiatonicChords, formatProgression, getAvailableProgressions,
  getScaleDegrees, getFretboardNotes, getFretPositions,
} from './music.js';

import { Fretboard } from './fretboard.js';
import {
  playNote, playChord, playArpeggio, playScale,
  resumeAudio, setVolume
} from './audio.js';

// ─── State ───
const state = {
  root: 'C',
  scale: 'Major',
  selectedProgression: null,   // name of a preset progression, or null
  customProgression: [],       // array of diatonic chord indices
  isCustom: false,             // true = using custom, false = using preset
  customEdit: false,           // true = editing custom builder in sidebar
  progressionIndex: 0,
  playMode: 'chord',
  waveform: 'triangle',
  volume: 0.3,
  fretboardStart: 0,
  visibleFrets: 15,
  flatPreference: false,
  savedProgressions: JSON.parse(localStorage.getItem('chordforge_saved') || '[]'),
  autoAdvance: false,
  tempo: 120,
};

let fretboard = null;
let progressionTimer = null;

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  initFretboard();
  updateAll();
  loadSavedProgressions();

  document.addEventListener('click', () => resumeAudio(), { once: true });
  document.addEventListener('keydown', () => resumeAudio(), { once: true });
});

// ─── UI Initialization ───
function initUI() {
  // Root note selector
  const rootGrid = document.getElementById('root-grid');
  NOTE_NAMES.forEach(note => {
    const btn = document.createElement('button');
    btn.className = 'root-btn';
    btn.dataset.note = note;
    btn.textContent = note;
    btn.setAttribute('aria-label', `Select ${note} as root note`);
    btn.addEventListener('click', () => {
      state.root = note;
      updateAll();
      animateSelection(btn);
    });
    rootGrid.appendChild(btn);
  });

  // Scale selector
  const scaleSelect = document.getElementById('scale-select');
  const scaleGroups = {
    'Diatonic Modes': ['Major', 'Natural Minor', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian'],
    'Harmonic / Melodic': ['Harmonic Minor', 'Melodic Minor'],
    'Pentatonic & Blues': ['Pentatonic Major', 'Pentatonic Minor', 'Blues'],
    'Other': ['Whole Tone', 'Diminished (HW)', 'Chromatic'],
  };
  for (const [group, scales] of Object.entries(scaleGroups)) {
    const optgroup = document.createElement('optgroup');
    optgroup.label = group;
    scales.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s;
      opt.textContent = s;
      optgroup.appendChild(opt);
    });
    scaleSelect.appendChild(optgroup);
  }
  scaleSelect.addEventListener('change', () => {
    state.scale = scaleSelect.value;
    // Clear progression when scale changes
    state.selectedProgression = null;
    state.customProgression = [];
    state.isCustom = false;
    state.progressionIndex = 0;
    updateAll();
  });

  // Play mode selector
  document.querySelectorAll('.play-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.playMode = btn.dataset.mode;
      document.querySelectorAll('.play-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Waveform selector
  document.querySelectorAll('.wave-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.waveform = btn.dataset.wave;
      document.querySelectorAll('.wave-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Volume
  const volSlider = document.getElementById('volume-slider');
  volSlider.addEventListener('input', () => {
    state.volume = parseFloat(volSlider.value);
    setVolume(state.volume);
    document.getElementById('volume-label').textContent = Math.round(state.volume * 100) + '%';
  });

  // Play scale button
  document.getElementById('btn-play-scale').addEventListener('click', () => {
    resumeAudio();
    const scaleNotes = getScaleNotes(state.root, state.scale);
    playScale(scaleNotes, { waveform: state.waveform });
  });

  // Play all chords
  document.getElementById('btn-play-all').addEventListener('click', () => {
    resumeAudio();
    playFullProgression();
  });

  // Fret range controls
  document.getElementById('btn-fret-prev').addEventListener('click', () => {
    state.fretboardStart = Math.max(0, state.fretboardStart - state.visibleFrets);
    updateFretboard();
  });
  document.getElementById('btn-fret-next').addEventListener('click', () => {
    state.fretboardStart = Math.min(24 - state.visibleFrets, state.fretboardStart + state.visibleFrets);
    updateFretboard();
  });
  document.getElementById('btn-fret-full').addEventListener('click', () => {
    state.fretboardStart = 0;
    state.visibleFrets = 24;
    updateFretboard();
  });
  document.getElementById('btn-fret-half').addEventListener('click', () => {
    state.visibleFrets = state.visibleFrets <= 15 ? 7 : 15;
    state.fretboardStart = 0;
    updateFretboard();
  });

  // Play/stop/next/prev progression controls
  document.getElementById('btn-play-prog').addEventListener('click', () => {
    resumeAudio();
    playCurrentChord();
  });
  document.getElementById('btn-stop').addEventListener('click', () => {
    stopAutoAdvance();
  });
  document.getElementById('btn-next-chord').addEventListener('click', () => {
    advanceChord(1);
  });
  document.getElementById('btn-prev-chord').addEventListener('click', () => {
    advanceChord(-1);
  });

  // Save
  document.getElementById('btn-save').addEventListener('click', () => {
    saveCurrentProgression();
  });

  // Toggle custom builder
  document.getElementById('btn-custom-mode').addEventListener('click', () => {
    state.customEdit = !state.customEdit;
    document.getElementById('btn-custom-mode').classList.toggle('active', state.customEdit);
    renderProgressions();
  });

  // Tempo
  document.getElementById('tempo-slider').addEventListener('input', (e) => {
    state.tempo = parseInt(e.target.value);
    document.getElementById('tempo-label').textContent = state.tempo + ' BPM';
    if (state.autoAdvance) {
      stopAutoAdvance();
      startAutoAdvance();
    }
  });

  // Flat preference
  document.getElementById('toggle-flats').addEventListener('change', (e) => {
    state.flatPreference = e.target.checked;
    updateAll();
  });
}

// ─── Fretboard ───
function initFretboard() {
  const container = document.getElementById('fretboard-container');
  fretboard = new Fretboard(container, {
    visibleFrets: state.visibleFrets,
    startFret: state.fretboardStart,
    onNoteClick: (note, string, fret) => {
      resumeAudio();
      playNote(note, { octave: fret < 12 ? 3 : 4, waveform: state.waveform });
      fretboard.pulseNote(note);
    },
    onNoteHover: (note, string, fret, action) => {
      const tooltip = document.getElementById('fret-tooltip');
      if (action === 'enter') {
        tooltip.textContent = `Fret ${fret} — ${getNoteName(note, state.flatPreference)}`;
        tooltip.classList.add('visible');
      } else {
        tooltip.classList.remove('visible');
      }
    },
  });
}

function updateFretboard() {
  if (!fretboard) return;
  fretboard.visibleFrets = state.visibleFrets;
  fretboard.startFret = state.fretboardStart;
  fretboard.render();

  const highlightedNotes = buildHighlightedNotes();
  fretboard.updateNotes(highlightedNotes, buildNoteLabels());

  const rangeText = state.visibleFrets >= 24
    ? 'Full Fretboard'
    : `Frets ${state.fretboardStart + 1}–${state.fretboardStart + state.visibleFrets}`;
  document.getElementById('fret-range-label').textContent = rangeText;
}

function buildHighlightedNotes() {
  const map = new Map();
  const scaleNotes = getScaleNotes(state.root, state.scale);
  const degrees = getScaleDegrees(state.root, state.scale);

  let chordTones = new Set();
  let rootNote = getNoteSemitone(state.root);

  const chord = getCurrentChord();
  if (chord) {
    chord.notes.forEach(n => chordTones.add(n));
    rootNote = getNoteSemitone(chord.root);
  }

  scaleNotes.forEach(note => {
    map.set(note, {
      isRoot: note === rootNote,
      isChordTone: chordTones.has(note),
      degree: degrees[note] || '',
    });
  });

  return map;
}

function buildNoteLabels() {
  const labels = new Map();
  const degrees = getScaleDegrees(state.root, state.scale);
  const chord = getCurrentChord();
  if (chord) {
    chord.notes.forEach(n => {
      labels.set(n, chord.root === getNoteName(n) ? 'R' : degrees[n] || '');
    });
  }
  return labels;
}

// ─── Progression Logic ───

/**
 * Select a preset progression
 */
function selectPreset(name) {
  state.selectedProgression = name;
  state.isCustom = false;
  state.progressionIndex = 0;
  updateAll();
}

/**
 * Add a chord to the custom progression
 */
function addToCustom(degreeIndex) {
  state.customProgression.push(degreeIndex);
  state.isCustom = true;
  state.selectedProgression = null;
  state.progressionIndex = 0;
  updateChordDisplay();
  updateFretboard();
  renderCustomProgressionChips();
}

/**
 * Remove a chord from the custom progression
 */
function removeFromCustom(index) {
  state.customProgression.splice(index, 1);
  if (state.customProgression.length === 0) {
    state.isCustom = false;
  }
  state.progressionIndex = 0;
  updateChordDisplay();
  updateFretboard();
  renderCustomProgressionChips();
}

/**
 * Clear the custom progression
 */
function clearCustom() {
  state.customProgression = [];
  state.isCustom = false;
  state.progressionIndex = 0;
  updateChordDisplay();
  updateFretboard();
  renderCustomProgressionChips();
}

function getCurrentChord() {
  if (state.isCustom && state.customProgression.length > 0) {
    const diatonic = getDiatonicChords(state.root, state.scale);
    const idx = state.customProgression[state.progressionIndex % state.customProgression.length];
    return diatonic[idx] || null;
  }
  if (state.selectedProgression) {
    const result = formatProgression(state.selectedProgression, state.root, state.scale);
    if (result) {
      return result.chords[state.progressionIndex % result.chords.length] || null;
    }
  }
  const diatonic = getDiatonicChords(state.root, state.scale);
  return diatonic[0] || null;
}

function getChordSequence() {
  if (state.isCustom && state.customProgression.length > 0) {
    const diatonic = getDiatonicChords(state.root, state.scale);
    return state.customProgression.map(idx => diatonic[idx]).filter(Boolean);
  }
  if (state.selectedProgression) {
    const result = formatProgression(state.selectedProgression, state.root, state.scale);
    if (result) return result.chords;
  }
  return [];
}

// ─── Rendering ───

function updateAll() {
  // Root buttons
  document.querySelectorAll('.root-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.note === state.root);
  });

  // Key display
  document.getElementById('current-key').textContent = `${state.root} ${state.scale}`;

  // Custom mode button state
  document.getElementById('btn-custom-mode').classList.toggle('active', state.customEdit);

  renderScaleNotes();
  renderProgressions();
  updateChordDisplay();
  renderDiatonicChords();
  updateFretboard();
  updateScaleInfo();
}

function updateChordDisplay() {
  const chord = getCurrentChord();
  const sequence = getChordSequence();
  const display = document.getElementById('chord-display');
  const seqDisplay = document.getElementById('progression-sequence');

  if (!chord) {
    display.innerHTML = '<div class="chord-name">—</div><div class="chord-notes">Select a key and scale</div>';
    seqDisplay.innerHTML = '';
    return;
  }

  display.innerHTML = `
    <div class="chord-name">${chord.symbol}</div>
    <div class="chord-notes">${chord.notes.map(n => getNoteName(n, state.flatPreference)).join(' – ')}</div>
    <div class="chord-type">${chord.type}</div>
  `;

  if (sequence.length > 0) {
    const seqHTML = sequence.map((c, i) => {
      const isActive = i === state.progressionIndex % sequence.length;
      return `<div class="seq-chord ${isActive ? 'active' : ''}" data-index="${i}">
        <span class="seq-numeral">${c.roman}</span>
        <span class="seq-name">${c.symbol}</span>
      </div>`;
    }).join('');
    seqDisplay.innerHTML = `<div class="seq-scroll">${seqHTML}</div>`;

    seqDisplay.querySelectorAll('.seq-chord').forEach(el => {
      el.addEventListener('click', () => {
        state.progressionIndex = parseInt(el.dataset.index);
        const c = sequence[state.progressionIndex];
        if (c) {
          updateChordDisplay();
          updateFretboard();
          playChord(c.notes, { waveform: state.waveform, volume: state.volume });
        }
      });
    });
  } else {
    seqDisplay.innerHTML = '';
  }
}

function renderProgressions() {
  const container = document.getElementById('progression-list');
  container.innerHTML = '';

  if (state.customEdit) {
    renderCustomBuilder(container);
    return;
  }

  // Show preset progressions
  const available = getAvailableProgressions(state.root, state.scale);
  const byGenre = {};
  available.forEach(p => {
    if (!byGenre[p.genre]) byGenre[p.genre] = [];
    byGenre[p.genre].push(p);
  });

  for (const [genre, progs] of Object.entries(byGenre)) {
    const group = document.createElement('div');
    group.className = 'prog-group';

    const header = document.createElement('h4');
    header.className = 'prog-group-title';
    header.textContent = genre;
    group.appendChild(header);

    progs.forEach(p => {
      const item = document.createElement('button');
      item.className = 'prog-item';
      if (state.selectedProgression === p.name && !state.isCustom) item.classList.add('selected');

      item.innerHTML = `
        <span class="prog-name">${p.name}</span>
        <span class="prog-label">${p.label}</span>
      `;
      item.addEventListener('click', () => selectPreset(p.name));
      group.appendChild(item);
    });

    container.appendChild(group);
  }

  if (available.length === 0) {
    container.innerHTML = '<div class="empty-state">No standard progressions for this scale. Try Major or Minor.</div>';
  }
}

function renderCustomBuilder(container) {
  const diatonic = getDiatonicChords(state.root, state.scale);
  if (diatonic.length === 0) {
    container.innerHTML = '<div class="empty-state">Cannot build chords for this scale.</div>';
    return;
  }

  const builder = document.createElement('div');
  builder.className = 'custom-builder';

  const label = document.createElement('h4');
  label.className = 'prog-group-title';
  label.textContent = 'Tap chords to build a progression';
  builder.appendChild(label);

  // Chord palette
  const palette = document.createElement('div');
  palette.className = 'chord-palette';
  diatonic.forEach((chord, i) => {
    const btn = document.createElement('button');
    btn.className = 'chord-palette-btn';
    btn.innerHTML = `<span class="chord-roman">${chord.roman}</span><span class="chord-symbol">${chord.symbol}</span>`;
    btn.addEventListener('click', () => addToCustom(i));
    palette.appendChild(btn);
  });
  builder.appendChild(palette);

  // Sequence chips (in sidebar)
  const chipsContainer = document.createElement('div');
  chipsContainer.id = 'sidebar-custom-chips';
  builder.appendChild(chipsContainer);

  // Clear button
  const controls = document.createElement('div');
  controls.className = 'custom-controls';
  const clearBtn = document.createElement('button');
  clearBtn.className = 'btn btn-ghost';
  clearBtn.textContent = 'Clear';
  clearBtn.addEventListener('click', clearCustom);
  controls.appendChild(clearBtn);
  builder.appendChild(controls);

  container.appendChild(builder);

  renderCustomProgressionChips();
}

function renderCustomProgressionChips() {
  const container = document.getElementById('sidebar-custom-chips');
  if (!container) return;

  const diatonic = getDiatonicChords(state.root, state.scale);

  if (state.customProgression.length === 0) {
    container.innerHTML = '<div class="empty-sequence">Click chords above to add them</div>';
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.className = 'sequence-chords';

  state.customProgression.forEach((idx, i) => {
    const chord = diatonic[idx];
    if (!chord) return;

    const chip = document.createElement('div');
    chip.className = 'sequence-chip';
    chip.innerHTML = `
      <span class="chip-num">${i + 1}</span>
      <span class="chip-chord">${chord.symbol}</span>
      <button class="chip-remove" aria-label="Remove chord">&times;</button>
    `;
    chip.querySelector('.chip-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      removeFromCustom(i);
    });
    wrapper.appendChild(chip);
  });

  container.innerHTML = '';
  container.appendChild(wrapper);
}

function renderScaleNotes() {
  const container = document.getElementById('scale-notes');
  const scaleNotes = getScaleNotes(state.root, state.scale);
  const scale = SCALES[state.scale];

  container.innerHTML = scaleNotes.map((note, i) => {
    const name = getNoteName(note, state.flatPreference);
    const deg = scale.degrees[i] || '';
    return `<div class="scale-note-chip ${i === 0 ? 'root' : ''}">
      <span class="chip-degree">${deg}</span>
      <span class="chip-note">${name}</span>
    </div>`;
  }).join('');
}

function renderDiatonicChords() {
  const container = document.getElementById('diatonic-chords');
  const diatonic = getDiatonicChords(state.root, state.scale);
  if (diatonic.length === 0) { container.innerHTML = ''; return; }

  container.innerHTML = diatonic.map(chord => `
    <div class="diatonic-item" data-chord='${JSON.stringify(chord)}'>
      <span class="dia-roman">${chord.roman}</span>
      <span class="dia-name">${chord.symbol}</span>
      <span class="dia-notes">${chord.notes.map(n => getNoteName(n, state.flatPreference)).join('-')}</span>
    </div>
  `).join('');

  container.querySelectorAll('.diatonic-item').forEach(el => {
    el.addEventListener('click', () => {
      const chord = JSON.parse(el.dataset.chord);
      resumeAudio();
      playChord(chord.notes, { waveform: state.waveform, volume: state.volume });
    });
  });
}

function updateScaleInfo() {
  const scale = SCALES[state.scale];
  if (!scale) return;
  const info = document.getElementById('scale-info');
  info.innerHTML = `
    <div class="info-row"><span class="info-label">Notes:</span> <span class="info-value">${scale.intervals.length}</span></div>
    <div class="info-row"><span class="info-label">Intervals:</span> <span class="info-value mono">${scale.intervals.join(', ')}</span></div>
    <div class="info-row"><span class="info-label">Formula:</span> <span class="info-value">${scale.degrees.join(' – ')}</span></div>
  `;
}

// ─── Playback ───
function playCurrentChord() {
  const chord = getCurrentChord();
  if (!chord) return;

  switch (state.playMode) {
    case 'chord':
      playChord(chord.notes, { waveform: state.waveform, volume: state.volume });
      break;
    case 'arpeggio':
      playArpeggio(chord.notes, { waveform: state.waveform, volume: state.volume });
      break;
    case 'scale':
      playScale(getScaleNotes(state.root, state.scale), { waveform: state.waveform });
      break;
    case 'single':
      playNote(chord.notes[0], { waveform: state.waveform, octave: 3 });
      break;
  }

  if (fretboard) fretboard.pulseNote(chord.notes[0]);
}

function playFullProgression() {
  const sequence = getChordSequence();
  if (sequence.length === 0) return;

  stopAutoAdvance();
  state.progressionIndex = 0;

  function playNext() {
    const chord = sequence[state.progressionIndex % sequence.length];
    if (chord) {
      updateChordDisplay();
      updateFretboard();
      if (state.playMode === 'arpeggio') {
        playArpeggio(chord.notes, { waveform: state.waveform, volume: state.volume });
      } else {
        playChord(chord.notes, { waveform: state.waveform, volume: state.volume });
      }
    }

    state.progressionIndex++;
    if (state.progressionIndex >= sequence.length) {
      state.progressionIndex = 0;
      return;
    }

    const interval = (60 / state.tempo) * 1000;
    progressionTimer = setTimeout(playNext, interval);
  }

  playNext();
}

function startAutoAdvance() {
  const sequence = getChordSequence();
  if (sequence.length === 0) return;

  state.autoAdvance = true;
  document.getElementById('btn-play-prog').classList.add('playing');
  const interval = (60 / state.tempo) * 1000;

  function advance() {
    if (!state.autoAdvance) return;
    const chord = sequence[state.progressionIndex % sequence.length];
    if (chord) {
      updateChordDisplay();
      updateFretboard();
      if (state.playMode === 'arpeggio') {
        playArpeggio(chord.notes, { waveform: state.waveform, volume: state.volume });
      } else {
        playChord(chord.notes, { waveform: state.waveform, volume: state.volume });
      }
    }
    state.progressionIndex = (state.progressionIndex + 1) % sequence.length;
    progressionTimer = setTimeout(advance, interval);
  }
  advance();
}

function stopAutoAdvance() {
  state.autoAdvance = false;
  clearTimeout(progressionTimer);
  document.getElementById('btn-play-prog').classList.remove('playing');
}

function advanceChord(direction) {
  const sequence = getChordSequence();
  if (sequence.length === 0) return;

  state.progressionIndex = (state.progressionIndex + direction + sequence.length) % sequence.length;
  const chord = sequence[state.progressionIndex];
  if (chord) {
    updateChordDisplay();
    updateFretboard();
    playChord(chord.notes, { waveform: state.waveform, volume: state.volume });
  }
}

// ─── Persistence ───
function saveCurrentProgression() {
  let progression;
  if (state.isCustom && state.customProgression.length > 0) {
    progression = { type: 'custom', indices: [...state.customProgression] };
  } else if (state.selectedProgression) {
    progression = { type: 'preset', name: state.selectedProgression };
  } else {
    return; // Nothing to save
  }

  const entry = {
    id: Date.now(),
    root: state.root,
    scale: state.scale,
    progression,
    label: `${state.root} ${state.scale}`,
    date: new Date().toISOString(),
  };

  state.savedProgressions.push(entry);
  localStorage.setItem('chordforge_saved', JSON.stringify(state.savedProgressions));
  loadSavedProgressions();
}

function loadSavedProgressions() {
  const container = document.getElementById('saved-list');
  const emptyState = document.getElementById('saved-empty');

  if (state.savedProgressions.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = '';
    return;
  }

  emptyState.style.display = 'none';
  container.innerHTML = state.savedProgressions.map(entry => {
    const dateStr = new Date(entry.date).toLocaleDateString();
    const progLabel = entry.progression.type === 'preset'
      ? entry.progression.name
      : `Custom (${entry.progression.indices.length} chords)`;

    return `<div class="saved-item" data-id="${entry.id}">
      <div class="saved-info">
        <span class="saved-title">${entry.label}</span>
        <span class="saved-prog">${progLabel}</span>
        <span class="saved-date">${dateStr}</span>
      </div>
      <div class="saved-actions">
        <button class="btn-icon btn-load" title="Load" aria-label="Load progression">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"/></svg>
        </button>
        <button class="btn-icon btn-delete" title="Delete" aria-label="Delete saved progression">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
        </button>
      </div>
    </div>`;
  }).join('');

  container.querySelectorAll('.btn-load').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      loadSavedProgression(parseInt(btn.closest('.saved-item').dataset.id));
    });
  });

  container.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.closest('.saved-item').dataset.id);
      state.savedProgressions = state.savedProgressions.filter(p => p.id !== id);
      localStorage.setItem('chordforge_saved', JSON.stringify(state.savedProgressions));
      loadSavedProgressions();
    });
  });
}

function loadSavedProgression(id) {
  const entry = state.savedProgressions.find(p => p.id === id);
  if (!entry) return;

  state.root = entry.root;
  state.scale = entry.scale;

  // Set the scale select dropdown
  const sel = document.getElementById('scale-select');
  for (let opt of sel.options) {
    if (opt.value === entry.scale) { opt.selected = true; break; }
  }

  if (entry.progression.type === 'preset') {
    state.selectedProgression = entry.progression.name;
    state.isCustom = false;
    state.customProgression = [];
    state.customEdit = false;
  } else {
    state.selectedProgression = null;
    state.isCustom = true;
    state.customProgression = entry.progression.indices;
    state.customEdit = false;
  }

  document.getElementById('btn-custom-mode').classList.remove('active');
  state.progressionIndex = 0;
  updateAll();
}

// ─── Utilities ───
function animateSelection(element) {
  element.classList.add('pulse-select');
  setTimeout(() => element.classList.remove('pulse-select'), 300);
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !e.target.matches('input, textarea, select')) {
    e.preventDefault();
    resumeAudio();
    playCurrentChord();
  }
  if (e.code === 'ArrowRight' && !e.target.matches('input, textarea, select')) {
    e.preventDefault();
    advanceChord(1);
  }
  if (e.code === 'ArrowLeft' && !e.target.matches('input, textarea, select')) {
    e.preventDefault();
    advanceChord(-1);
  }
  if (e.key >= '1' && e.key <= '9' && !e.target.matches('input, textarea, select')) {
    const idx = parseInt(e.key) - 1;
    const sequence = getChordSequence();
    if (idx < sequence.length) {
      state.progressionIndex = idx;
      updateChordDisplay();
      updateFretboard();
      playChord(sequence[idx].notes, { waveform: state.waveform, volume: state.volume });
    }
  }
});
