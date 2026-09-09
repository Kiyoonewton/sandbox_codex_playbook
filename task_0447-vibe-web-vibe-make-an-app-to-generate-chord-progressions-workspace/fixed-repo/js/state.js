/**
 * State Management — Chord Forge
 * Central state store with persistence
 */

export const state = {
  root: 'C',
  scale: 'Major',
  selectedProgression: null,
  customProgression: [],
  isCustom: false,
  customEdit: false,
  progressionIndex: 0,
  playMode: 'chord',
  waveform: 'triangle',
  volume: 0.3,
  fretboardStart: 0,
  visibleFrets: 15,
  flatPreference: false,
  savedProgressions: loadFromStorage(),
  autoAdvance: false,
  tempo: 120,
};

function loadFromStorage() {
  try {
    return JSON.parse(localStorage.getItem('chordforge_saved') || '[]');
  } catch {
    return [];
  }
}

export function saveProgressionsToStorage() {
  try {
    localStorage.setItem('chordforge_saved', JSON.stringify(state.savedProgressions));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}
