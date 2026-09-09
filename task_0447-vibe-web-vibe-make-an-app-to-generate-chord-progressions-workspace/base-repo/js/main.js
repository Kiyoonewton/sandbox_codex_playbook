/**
 * Chord Forge - Main Entry Point
 * Wires together state, UI, fretboard, audio, and keyboard
 */

import { state, saveProgressionsToStorage } from './state.js';
import { initKeyboard } from './keyboard.js';
import { animateSelection, setSelectValue, formatDate } from './utils.js';
import {
  NOTE_NAMES, SCALES, PROGRESSIONS, DIATONIC_CHORDS,
  getNoteName, getNoteSemitone, getScaleNotes,
  getDiatonicChords, formatProgression, getAvailableProgressions,
  getScaleDegrees,
} from './music.js';
import { Fretboard } from './fretboard.js';
import {
  playNote, playChord, playArpeggio, playScale,
  resumeAudio, setVolume
} from './audio.js';

let fretboard = null;
let progressionTimer = null;

// ─── Init ───
document.addEventListener('DOMContentLoaded', () => {
  initUI();
  initFretboard();
  initKeyboard({
    playChord: () => { resumeAudio(); playCurrentChord(); },
    nextChord: () => advanceChord(1),
    prevChord: () => advanceChord(-1),
    selectChord: selectChordByIndex,
    randomize: () => document.getElementById('btn-randomize').click(),
    save: () => document.getElementById('btn-save').click(),
    stop: () => stopAutoAdvance(),
  });
  updateAll();
  loadSavedProgressions();

  document.addEventListener('click', () => resumeAudio(), { once: true });
  document.addEventListener('keydown', () => resumeAudio(), { once: true });
});

// ─── UI Initialization ───
function initUI() {
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
      opt.value = s; opt.textContent = s;
      optgroup.appendChild(opt);
    });
    scaleSelect.appendChild(optgroup);
  }
  scaleSelect.addEventListener('change', () => {
    state.scale = scaleSelect.value;
    state.selectedProgression = null;
    state.customProgression = [];
    state.isCustom = false;
    state.progressionIndex = 0;
    updateAll();
  });

  document.querySelectorAll('.play-mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.playMode = btn.dataset.mode;
      document.querySelectorAll('.play-mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  document.querySelectorAll('.wave-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.waveform = btn.dataset.wave;
      document.querySelectorAll('.wave-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  const volSlider = document.getElementById('volume-slider');
  volSlider.addEventListener('input', () => {
    state.volume = parseFloat(volSlider.value);
    setVolume(state.volume);
    document.getElementById('volume-label').textContent = Math.round(state.volume * 100) + '%';
  });

  document.getElementById('btn-play-scale').addEventListener('click', () => {
    resumeAudio();
    playScale(getScaleNotes(state.root, state.scale), { waveform: state.waveform });
  });
  document.getElementById('btn-play-all').addEventListener('click', () => {
    resumeAudio();
    playFullProgression();
  });

  document.getElementById('btn-fret-prev').addEventListener('click', () => {
    state.fretboardStart = Math.max(0, state.fretboardStart - state.visibleFrets);
    updateFretboard();
  });
  document.getElementById('btn-fret-next').addEventListener('click', () => {
    state.fretboardStart = Math.min(24 - state.visibleFrets, state.fretboardStart + state.visibleFrets);
    updateFretboard();
  });
  document.getElementById('btn-fret-full').addEventListener('click', () => {
    state.fretboardStart = 0; state.visibleFrets = 24; updateFretboard();
  });
  document.getElementById('btn-fret-half').addEventListener('click', () => {
    state.visibleFrets = state.visibleFrets <= 15 ? 7 : 15;
    state.fretboardStart = 0; updateFretboard();
  });

  document.getElementById('btn-play-prog').addEventListener('click', () => {
    resumeAudio(); playCurrentChord();
  });
  document.getElementById('btn-stop').addEventListener('click', stopAutoAdvance);
  document.getElementById('btn-next-chord').addEventListener('click', () => advanceChord(1));
  document.getElementById('btn-prev-chord').addEventListener('click', () => advanceChord(-1));
  document.getElementById('btn-save').addEventListener('click', saveCurrentProgression);

  document.getElementById('btn-custom-mode').addEventListener('click', () => {
    state.customEdit = !state.customEdit;
    document.getElementById('btn-custom-mode').classList.toggle('active', state.customEdit);
    renderProgressions();
  });

  document.getElementById('tempo-slider').addEventListener('input', (e) => {
    state.tempo = parseInt(e.target.value);
    document.getElementById('tempo-label').textContent = state.tempo + ' BPM';
    if (state.autoAdvance) { stopAutoAdvance(); startAutoAdvance(); }
  });

  document.getElementById('toggle-flats').addEventListener('change', (e) => {
    state.flatPreference = e.target.checked;
    updateAll();
  });

  // Randomize button
  document.getElementById('btn-randomize').addEventListener('click', () => {
    const roots = NOTE_NAMES;
    // Only pick scales that support diatonic chords AND have available progressions
    const scalesWithProgs = Object.keys(SCALES).filter(s => {
      if (!DIATONIC_CHORDS[s]) return false;
      // Check if at least one progression works with a random root
      const randomRoot = roots[Math.floor(Math.random() * roots.length)];
      return getAvailableProgressions(randomRoot, s).length > 0;
    });
    
    if (scalesWithProgs.length === 0) {
      showToast('No progressions available');
      return;
    }
    
    // Pick random root
    state.root = roots[Math.floor(Math.random() * roots.length)];
    // Pick random scale
    state.scale = scalesWithProgs[Math.floor(Math.random() * scalesWithProgs.length)];
    // Set the dropdown
    setSelectValue('scale-select', state.scale);
    
    // Pick a random progression that works with this scale
    const progs = getAvailableProgressions(state.root, state.scale);
    if (progs.length > 0) {
      const randomProg = progs[Math.floor(Math.random() * progs.length)];
      state.selectedProgression = randomProg.name;
      state.isCustom = false;
      state.customProgression = [];
    } else {
      state.selectedProgression = null;
    }
    state.progressionIndex = 0;
    updateAll();
    showToast(`✨ ${state.root} ${state.scale}`);
  });

  // Mobile sidebar toggle
  const mobileMenuBtn = document.getElementById('btn-mobile-menu');
  const sidebarOverlay = document.getElementById('sidebar-overlay');
  if (mobileMenuBtn && sidebarOverlay) {
    function openSidebar() {
      document.querySelector('.sidebar').classList.add('open');
      sidebarOverlay.classList.add('visible');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    }
    function closeSidebar() {
      document.querySelector('.sidebar').classList.remove('open');
      sidebarOverlay.classList.remove('visible');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
    mobileMenuBtn.addEventListener('click', () => {
      const sidebar = document.querySelector('.sidebar');
      sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
    });
    sidebarOverlay.addEventListener('click', closeSidebar);
    // Close sidebar on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.querySelector('.sidebar.open')) {
        closeSidebar();
      }
    });
  }
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
        // Position near cursor
        const moveHandler = (e) => {
          tooltip.style.left = (e.clientX + 14) + 'px';
          tooltip.style.top = (e.clientY - 10) + 'px';
        };
        tooltip._moveHandler = moveHandler;
        document.addEventListener('mousemove', moveHandler);
      } else {
        tooltip.classList.remove('visible');
        if (tooltip._moveHandler) {
          document.removeEventListener('mousemove', tooltip._moveHandler);
          tooltip._moveHandler = null;
        }
      }
    },
  });
}

function updateFretboard() {
  if (!fretboard) return;
  fretboard.visibleFrets = state.visibleFrets;
  fretboard.startFret = state.fretboardStart;
  fretboard.render();
  fretboard.updateNotes(buildHighlightedNotes(), buildNoteLabels());
  document.getElementById('fret-range-label').textContent =
    state.visibleFrets >= 24 ? 'Full Fretboard'
    : `Frets ${state.fretboardStart + 1}–${state.fretboardStart + state.visibleFrets}`;
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
    map.set(note, { isRoot: note === rootNote, isChordTone: chordTones.has(note), degree: degrees[note] || '' });
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
function selectPreset(name) {
  state.selectedProgression = name;
  state.isCustom = false;
  state.progressionIndex = 0;
  updateAll();
}

function addToCustom(degreeIndex) {
  state.customProgression.push(degreeIndex);
  state.isCustom = true;
  state.selectedProgression = null;
  state.progressionIndex = 0;
  updateChordDisplay();
  updateFretboard();
  renderCustomProgressionChips();
}

function removeFromCustom(index) {
  state.customProgression.splice(index, 1);
  if (state.customProgression.length === 0) state.isCustom = false;
  state.progressionIndex = 0;
  updateChordDisplay();
  updateFretboard();
  renderCustomProgressionChips();
}

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
    return diatonic[state.customProgression[state.progressionIndex % state.customProgression.length]] || null;
  }
  if (state.selectedProgression) {
    const result = formatProgression(state.selectedProgression, state.root, state.scale);
    if (result) return result.chords[state.progressionIndex % result.chords.length] || null;
  }
  return getDiatonicChords(state.root, state.scale)[0] || null;
}

function getChordSequence() {
  if (state.isCustom && state.customProgression.length > 0) {
    return state.customProgression.map(idx => getDiatonicChords(state.root, state.scale)[idx]).filter(Boolean);
  }
  if (state.selectedProgression) {
    const result = formatProgression(state.selectedProgression, state.root, state.scale);
    if (result) return result.chords;
  }
  return [];
}

// ─── Rendering ───
function updateAll() {
  document.querySelectorAll('.root-btn').forEach(btn => {
    btn.classList.toggle('selected', btn.dataset.note === state.root);
  });
  document.getElementById('current-key').textContent = `${state.root} ${state.scale}`;
  document.getElementById('btn-custom-mode').classList.toggle('active', state.customEdit);
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
  // Trigger entrance animation
  display.classList.remove('chord-changed');
  void display.offsetWidth; // force reflow
  display.classList.add('chord-changed');
  display.style.opacity = '0';
  display.style.transform = 'translateY(4px)';
  requestAnimationFrame(() => {
    display.style.transition = 'opacity 0.3s var(--ease-out), transform 0.3s var(--ease-out)';
    display.style.opacity = '1';
    display.style.transform = 'translateY(0)';
  });

  if (sequence.length > 0) {
    seqDisplay.innerHTML = `<div class="seq-scroll">${sequence.map((c, i) => {
      const isActive = i === state.progressionIndex % sequence.length;
      return `<div class="seq-chord ${isActive ? 'active' : ''}" data-index="${i}">
        <span class="seq-numeral">${c.roman}</span>
        <span class="seq-name">${c.symbol}</span>
      </div>`;
    }).join('')}</div>`;

    seqDisplay.querySelectorAll('.seq-chord').forEach(el => {
      el.addEventListener('click', () => {
        state.progressionIndex = parseInt(el.dataset.index);
        const c = sequence[state.progressionIndex];
        if (c) { updateChordDisplay(); updateFretboard(); playChord(c.notes, { waveform: state.waveform, volume: state.volume }); }
      });
    });
  } else {
    seqDisplay.innerHTML = '';
  }
}

function renderProgressions() {
  const container = document.getElementById('progression-list');
  container.innerHTML = '';
  if (state.customEdit) { renderCustomBuilder(container); return; }

  const available = getAvailableProgressions(state.root, state.scale);
  const byGenre = {};
  available.forEach(p => { (byGenre[p.genre] = byGenre[p.genre] || []).push(p); });

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
      item.innerHTML = `<span class="prog-name">${p.name}</span><span class="prog-label">${p.label}</span>`;
      item.addEventListener('click', () => selectPreset(p.name));
      group.appendChild(item);
    });
    container.appendChild(group);
  }

  if (available.length === 0) {
    container.innerHTML = '<div class="empty-state">No standard progressions for this scale.</div>';
  }
}

function renderCustomBuilder(container) {
  const diatonic = getDiatonicChords(state.root, state.scale);
  if (diatonic.length === 0) { container.innerHTML = '<div class="empty-state">Cannot build chords for this scale.</div>'; return; }

  const builder = document.createElement('div');
  builder.className = 'custom-builder';
  builder.innerHTML = '<h4 class="prog-group-title">Tap chords to build a progression</h4>';

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

  const chipsContainer = document.createElement('div');
  chipsContainer.id = 'sidebar-custom-chips';
  builder.appendChild(chipsContainer);

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
    chip.innerHTML = `<span class="chip-num">${i + 1}</span><span class="chip-chord">${chord.symbol}</span><button class="chip-remove" aria-label="Remove chord">&times;</button>`;
    chip.querySelector('.chip-remove').addEventListener('click', (e) => { e.stopPropagation(); removeFromCustom(i); });
    wrapper.appendChild(chip);
  });

  container.innerHTML = '';
  container.appendChild(wrapper);
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
      resumeAudio();
      playChord(JSON.parse(el.dataset.chord).notes, { waveform: state.waveform, volume: state.volume });
    });
  });
}

function updateScaleInfo() {
  const scale = SCALES[state.scale];
  if (!scale) return;
  const scaleNotes = getScaleNotes(state.root, state.scale);
  const noteNames = scaleNotes.map(n => getNoteName(n, state.flatPreference)).join(' – ');
  document.getElementById('scale-info').innerHTML = `
    <div class="info-row"><span class="info-label">Notes:</span> <span class="info-value">${scale.intervals.length}</span></div>
    <div class="info-row"><span class="info-label">Pitch:</span> <span class="info-value mono">${noteNames}</span></div>
    <div class="info-row"><span class="info-label">Steps:</span> <span class="info-value mono">${scale.intervals.join(', ')}</span></div>
    <div class="info-row"><span class="info-label">Formula:</span> <span class="info-value">${scale.degrees.join(' – ')}</span></div>
  `;
}

// ─── Playback ───
function playCurrentChord() {
  const chord = getCurrentChord();
  if (!chord) return;
  switch (state.playMode) {
    case 'chord': playChord(chord.notes, { waveform: state.waveform, volume: state.volume }); break;
    case 'arpeggio': playArpeggio(chord.notes, { waveform: state.waveform, volume: state.volume }); break;
    case 'scale': playScale(getScaleNotes(state.root, state.scale), { waveform: state.waveform }); break;
    case 'single': playNote(chord.notes[0], { waveform: state.waveform, octave: 3 }); break;
  }
  if (fretboard) fretboard.pulseNote(chord.notes[0]);
  announce(`Playing ${chord.symbol} chord`);
}

function playFullProgression() {
  const sequence = getChordSequence();
  if (sequence.length === 0) return;
  stopAutoAdvance();
  state.progressionIndex = 0;

  function playNext() {
    const chord = sequence[state.progressionIndex % sequence.length];
    if (chord) {
      updateChordDisplay(); updateFretboard();
      if (state.playMode === 'arpeggio') playArpeggio(chord.notes, { waveform: state.waveform, volume: state.volume });
      else playChord(chord.notes, { waveform: state.waveform, volume: state.volume });
    }
    state.progressionIndex++;
    if (state.progressionIndex >= sequence.length) { state.progressionIndex = 0; return; }
    progressionTimer = setTimeout(playNext, (60 / state.tempo) * 1000);
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
      updateChordDisplay(); updateFretboard();
      if (state.playMode === 'arpeggio') playArpeggio(chord.notes, { waveform: state.waveform, volume: state.volume });
      else playChord(chord.notes, { waveform: state.waveform, volume: state.volume });
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
    updateChordDisplay(); updateFretboard();
    playChord(chord.notes, { waveform: state.waveform, volume: state.volume });
  }
}

function selectChordByIndex(idx) {
  const sequence = getChordSequence();
  if (idx < sequence.length) {
    state.progressionIndex = idx;
    updateChordDisplay(); updateFretboard();
    playChord(sequence[idx].notes, { waveform: state.waveform, volume: state.volume });
  }
}

// ─── Persistence ───
function saveCurrentProgression() {
  let progression;
  if (state.isCustom && state.customProgression.length > 0) {
    progression = { type: 'custom', indices: [...state.customProgression] };
  } else if (state.selectedProgression) {
    progression = { type: 'preset', name: state.selectedProgression };
  } else return;

  state.savedProgressions.push({
    id: Date.now(), root: state.root, scale: state.scale,
    progression, label: `${state.root} ${state.scale}`,
    date: new Date().toISOString(),
  });
  saveProgressionsToStorage();
  loadSavedProgressions();
}

function loadSavedProgressions() {
  const container = document.getElementById('saved-list');
  const emptyState = document.getElementById('saved-empty');
  const actionsRow = document.getElementById('saved-actions-row');

  if (state.savedProgressions.length === 0) {
    container.innerHTML = '';
    emptyState.style.display = '';
    if (actionsRow) actionsRow.style.display = 'none';
    return;
  }

  emptyState.style.display = 'none';
  if (actionsRow) actionsRow.style.display = 'flex';
  container.innerHTML = state.savedProgressions.map(entry => {
    const dateStr = formatDate(entry.date);
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
      saveProgressionsToStorage();
      loadSavedProgressions();
      showToast('Progression deleted');
    });
  });
}

function loadSavedProgression(id) {
  const entry = state.savedProgressions.find(p => p.id === id);
  if (!entry) return;

  state.root = entry.root;
  state.scale = entry.scale;
  setSelectValue('scale-select', entry.scale);

  if (entry.progression.type === 'preset') {
    state.selectedProgression = entry.progression.name;
    state.isCustom = false;
    state.customProgression = [];
  } else {
    state.selectedProgression = null;
    state.isCustom = true;
    state.customProgression = entry.progression.indices;
  }
  state.customEdit = false;
  document.getElementById('btn-custom-mode').classList.remove('active');
  state.progressionIndex = 0;
  updateAll();
}

// ─── Toast Notifications ───
let toastTimer = null;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2500);
  // Also announce to screen readers
  announce(message);
}

function announce(message) {
  const el = document.getElementById('sr-announcer');
  if (el) { el.textContent = ''; requestAnimationFrame(() => { el.textContent = message; }); }
}

// ─── Export / Import ───
document.addEventListener('DOMContentLoaded', () => {
  const exportBtn = document.getElementById('btn-export');
  const importBtn = document.getElementById('btn-import');
  const importFile = document.getElementById('import-file');

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      if (state.savedProgressions.length === 0) {
        showToast('Nothing to export');
        return;
      }
      const data = JSON.stringify(state.savedProgressions, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chordforge-progressions-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(`Exported ${state.savedProgressions.length} progressions`);
    });
  }

  if (importBtn) {
    importBtn.addEventListener('click', () => importFile.click());
  }

  if (importFile) {
    importFile.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target.result);
          if (!Array.isArray(imported)) throw new Error('Invalid format');
          let count = 0;
          imported.forEach(entry => {
            if (entry.root && entry.scale && entry.progression && entry.date) {
              entry.id = Date.now() + count;
              state.savedProgressions.push(entry);
              count++;
            }
          });
          saveProgressionsToStorage();
          loadSavedProgressions();
          showToast(`Imported ${count} progressions`);
        } catch (err) {
          showToast('Invalid file format');
        }
      };
      reader.readAsText(file);
      importFile.value = '';
    });
  }
});

// ─── Save success toast ───
document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('btn-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      setTimeout(() => {
        if (state.savedProgressions.length > 0) {
          showToast('Progression saved');
        }
      }, 50);
    });
  }
});
