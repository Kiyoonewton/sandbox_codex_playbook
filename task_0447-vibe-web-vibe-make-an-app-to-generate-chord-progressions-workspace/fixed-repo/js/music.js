/**
 * Music Theory Engine
 * Scales, chords, progressions, and fretboard calculations
 */

// Note names in chromatic order
export const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const FLAT_NAMES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Standard guitar tuning (open string notes as semitone indices)
export const STANDARD_TUNING = [4, 9, 2, 7, 11, 4]; // E, A, D, G, B, e
export const STRING_NAMES = ['E', 'A', 'D', 'G', 'B', 'e'];
export const NUM_FRETS = 24;

// Scale definitions: intervals from root in semitones
export const SCALES = {
  'Major':              { intervals: [0, 2, 4, 5, 7, 9, 11], degrees: ['1','2','3','4','5','6','7'] },
  'Natural Minor':      { intervals: [0, 2, 3, 5, 7, 8, 10], degrees: ['1','2','♭3','4','5','♭6','♭7'] },
  'Harmonic Minor':     { intervals: [0, 2, 3, 5, 7, 8, 11], degrees: ['1','2','♭3','4','5','♭6','7'] },
  'Melodic Minor':      { intervals: [0, 2, 3, 5, 7, 9, 11], degrees: ['1','2','♭3','4','5','6','7'] },
  'Dorian':             { intervals: [0, 2, 3, 5, 7, 9, 10], degrees: ['1','2','♭3','4','5','6','♭7'] },
  'Phrygian':           { intervals: [0, 1, 3, 5, 7, 8, 10], degrees: ['1','♭2','♭3','4','5','♭6','♭7'] },
  'Lydian':             { intervals: [0, 2, 4, 6, 7, 9, 11], degrees: ['1','2','3','♯4','5','6','7'] },
  'Mixolydian':         { intervals: [0, 2, 4, 5, 7, 9, 10], degrees: ['1','2','3','4','5','6','♭7'] },
  'Locrian':            { intervals: [0, 1, 3, 5, 6, 8, 10], degrees: ['1','♭2','♭3','4','♭5','♭6','♭7'] },
  'Pentatonic Major':   { intervals: [0, 2, 4, 7, 9],        degrees: ['1','2','3','5','6'] },
  'Pentatonic Minor':   { intervals: [0, 3, 5, 7, 10],       degrees: ['1','♭3','4','5','♭7'] },
  'Blues':              { intervals: [0, 3, 5, 6, 7, 10],     degrees: ['1','♭3','4','♭5','5','♭7'] },
  'Whole Tone':         { intervals: [0, 2, 4, 6, 8, 10],     degrees: ['1','2','3','♯4','♯5','♭7'] },
  'Diminished (HW)':    { intervals: [0, 1, 3, 4, 6, 7, 9, 10], degrees: ['1','♭2','♭3','3','♯4','5','6','♭7'] },
  'Chromatic':          { intervals: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], degrees: ['1','♭2','2','♭3','3','4','♭5','5','♭6','6','♭7','7'] },
};

// Chord formulas: intervals from root
export const CHORD_TYPES = {
  'Major':            { intervals: [0, 4, 7],            symbol: '' },
  'Minor':            { intervals: [0, 3, 7],            symbol: 'm' },
  'Diminished':       { intervals: [0, 3, 6],            symbol: 'dim' },
  'Augmented':        { intervals: [0, 4, 8],            symbol: 'aug' },
  'Sus2':             { intervals: [0, 2, 7],            symbol: 'sus2' },
  'Sus4':             { intervals: [0, 5, 7],            symbol: 'sus4' },
  'Major 7th':        { intervals: [0, 4, 7, 11],        symbol: 'maj7' },
  'Minor 7th':        { intervals: [0, 3, 7, 10],        symbol: 'm7' },
  'Dominant 7th':     { intervals: [0, 4, 7, 10],        symbol: '7' },
  'Diminished 7th':   { intervals: [0, 3, 6, 9],         symbol: 'dim7' },
  'Half-Dim 7th':     { intervals: [0, 3, 6, 10],        symbol: 'ø7' },
  'Minor-Major 7th':  { intervals: [0, 3, 7, 11],        symbol: 'mMaj7' },
  'Add9':             { intervals: [0, 4, 7, 14],         symbol: 'add9' },
  'Power (5th)':      { intervals: [0, 7],                symbol: '5' },
};

// Diatonic chord qualities for common modes (scale degree -> chord type)
export const DIATONIC_CHORDS = {
  'Major':            ['Major', 'Minor', 'Minor', 'Major', 'Major', 'Minor', 'Diminished'],
  'Natural Minor':    ['Minor', 'Diminished', 'Major', 'Minor', 'Minor', 'Major', 'Major'],
  'Harmonic Minor':   ['Minor', 'Diminished', 'Augmented', 'Minor', 'Major', 'Major', 'Diminished'],
  'Melodic Minor':    ['Minor', 'Minor', 'Augmented', 'Major', 'Major', 'Diminished', 'Diminished'],
  'Dorian':           ['Minor', 'Minor', 'Major', 'Major', 'Minor', 'Diminished', 'Major'],
  'Phrygian':         ['Minor', 'Major', 'Major', 'Minor', 'Diminished', 'Major', 'Minor'],
  'Lydian':           ['Major', 'Major', 'Minor', 'Diminished', 'Major', 'Minor', 'Minor'],
  'Mixolydian':       ['Major', 'Minor', 'Diminished', 'Major', 'Minor', 'Minor', 'Major'],
  'Locrian':          ['Diminished', 'Major', 'Minor', 'Minor', 'Major', 'Major', 'Minor'],
};

// Common chord progressions (roman numeral patterns)
export const PROGRESSIONS = {
  'Pop Standard':         { pattern: [0, 5, 3, 4], label: 'I – vi – IV – V', genre: 'Pop' },
  'Pop Classic':          { pattern: [0, 4, 5, 3], label: 'I – V – vi – IV', genre: 'Pop' },
  '50s Doo-Wop':          { pattern: [0, 5, 3, 4], label: 'I – vi – IV – V', genre: 'Classic' },
  'Axis of Awesome':      { pattern: [0, 4, 5, 3], label: 'I – V – vi – IV', genre: 'Pop' },
  'Blues 12-Bar':         { pattern: [0, 0, 0, 0, 3, 3, 0, 0, 4, 3, 0, 4], label: 'I I I I IV IV I I V IV I V', genre: 'Blues' },
  'Jazz ii-V-I':          { pattern: [1, 4, 0], label: 'ii – V – I', genre: 'Jazz' },
  'Jazz Turnaround':      { pattern: [1, 4, 0, 4], label: 'ii – V – I – V', genre: 'Jazz' },
  'Canon in D':           { pattern: [0, 4, 5, 2, 3, 0, 3, 4], label: 'I – V – vi – iii – IV – I – IV – V', genre: 'Classical' },
  'Emotional Ballad':     { pattern: [5, 3, 0, 4], label: 'vi – IV – I – V', genre: 'Pop' },
  'Minor Plagal':         { pattern: [0, 3, 4, 3], label: 'I – IV – V – IV', genre: 'Rock' },
  'Andalusian Cadence':   { pattern: [5, 4, 3, 2], label: 'vi – V – IV – iii', genre: 'Latin' },
  'Rock Power':           { pattern: [0, 3, 4, 3], label: 'I – IV – V – IV', genre: 'Rock' },
  'Folk Simple':          { pattern: [0, 3, 4, 0], label: 'I – IV – V – I', genre: 'Folk' },
  'Soul Movement':        { pattern: [0, 1, 3, 4], label: 'I – ii – IV – V', genre: 'Soul' },
  'Ambient Drift':        { pattern: [0, 2, 5, 3], label: 'I – iii – vi – IV', genre: 'Ambient' },
  'Country Two-Step':     { pattern: [0, 4, 3, 0], label: 'I – V – IV – I', genre: 'Country' },
  'Reggae One-Drop':      { pattern: [0, 3, 4, 3], label: 'I – IV – V – IV', genre: 'Reggae' },
  'Minor Pentatonic Jam': { pattern: [5, 0, 3, 4], label: 'vi – I – IV – V', genre: 'Jam' },
};

/**
 * Get the note name for a semitone value (0-11), using sharps by default
 */
export function getNoteName(semitone, preferFlats = false) {
  const idx = ((semitone % 12) + 12) % 12;
  return preferFlats ? FLAT_NAMES[idx] : NOTE_NAMES[idx];
}

/**
 * Get semitone index from note name
 */
export function getNoteSemitone(name) {
  // Try sharps first
  let idx = NOTE_NAMES.indexOf(name);
  if (idx >= 0) return idx;
  // Try flats
  idx = FLAT_NAMES.indexOf(name);
  return idx;
}

/**
 * Get all notes in a scale
 */
export function getScaleNotes(root, scaleName) {
  const rootSemitone = getNoteSemitone(root);
  const scale = SCALES[scaleName];
  if (!scale) return [];
  return scale.intervals.map(i => (rootSemitone + i) % 12);
}

/**
 * Get notes in a chord
 */
export function getChordNotes(root, chordType) {
  const rootSemitone = getNoteSemitone(root);
  const chord = CHORD_TYPES[chordType];
  if (!chord) return [];
  return chord.intervals.map(i => (rootSemitone + i) % 12);
}

/**
 * Build diatonic chords for a key
 */
export function getDiatonicChords(root, scaleName) {
  const scale = SCALES[scaleName];
  const qualities = DIATONIC_CHORDS[scaleName];
  if (!scale || !qualities) return [];

  const rootSemitone = getNoteSemitone(root);
  const chords = [];

  scale.intervals.forEach((interval, i) => {
    const chordRoot = (rootSemitone + interval) % 12;
    const chordType = qualities[i];
    const chordNotes = getChordNotes(getNoteName(chordRoot), chordType);
    const roman = getRomanNumeral(i, chordType, scale.intervals.length);

    chords.push({
      degree: i,
      root: getNoteName(chordRoot),
      type: chordType,
      symbol: getNoteName(chordRoot) + CHORD_TYPES[chordType].symbol,
      notes: chordNotes,
      roman,
      interval,
    });
  });

  return chords;
}

/**
 * Convert scale degree to Roman numeral
 */
function getRomanNumeral(degree, chordType, numDegrees) {
  const numerals = numDegrees === 7
    ? ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII']
    : ['I', 'II', 'III', 'IV', 'V'];

  let numeral = numerals[degree] || degree.toString();
  const isMinorish = chordType === 'Minor' || chordType === 'Diminished' || chordType === 'Half-Dim 7th';

  if (isMinorish) numeral = numeral.toLowerCase();
  if (chordType === 'Diminished' || chordType === 'Half-Dim 7th') numeral += '°';
  if (chordType === 'Augmented') numeral += '+';

  return numeral;
}

/**
 * Get notes at each fret position on the fretboard
 */
export function getFretboardNotes(tuning = STANDARD_TUNING, numFrets = NUM_FRETS) {
  const board = [];
  for (let string = 0; string < tuning.length; string++) {
    const row = [];
    for (let fret = 0; fret <= numFrets; fret++) {
      row.push((tuning[string] + fret) % 12);
    }
    board.push(row);
  }
  return board;
}

/**
 * Determine the chord type a set of notes best represents
 */
export function identifyChord(noteSemitones) {
  if (noteSemitones.length < 2) return null;
  const sorted = [...new Set(noteSemitones)].sort((a, b) => a - b);

  // Try each note as potential root
  let bestMatch = null;
  let bestScore = -1;

  for (const root of sorted) {
    const intervals = sorted.map(n => (n - root + 12) % 12).sort((a, b) => a - b);
    for (const [typeName, typeData] of Object.entries(CHORD_TYPES)) {
      const typeIntervals = typeData.intervals.map(i => i % 12);
      // Count matching intervals (excluding octave duplicates)
      const matches = typeIntervals.filter(i => intervals.includes(i)).length;
      const score = matches / typeIntervals.length;
      if (score > bestScore && matches >= 2) {
        bestScore = score;
        bestMatch = { root: getNoteName(root), type: typeName, symbol: getNoteName(root) + typeData.symbol };
      }
    }
  }
  return bestMatch;
}

/**
 * Get scale degrees for a fretboard position
 */
export function getScaleDegrees(root, scaleName) {
  const rootSemitone = getNoteSemitone(root);
  const scale = SCALES[scaleName];
  if (!scale) return {};

  const degreeMap = {};
  scale.intervals.forEach((interval, i) => {
    const note = (rootSemitone + interval) % 12;
    degreeMap[note] = scale.degrees[i];
  });
  return degreeMap;
}

/**
 * Format a progression for display
 */
export function formatProgression(name, root, scaleName) {
  const prog = PROGRESSIONS[name];
  if (!prog) return null;

  const diatonic = getDiatonicChords(root, scaleName);
  if (diatonic.length === 0) return null;

  // For progressions that use 7th-degree chords in 7-note scales,
  // we need to handle patterns that reference index 4+ for 5-note scales
  const maxIndex = Math.max(...prog.pattern);
  if (maxIndex >= diatonic.length) return null;

  const chords = prog.pattern.map(idx => diatonic[idx]);
  return {
    name,
    genre: prog.genre,
    label: prog.label,
    chords,
  };
}

/**
 * Get all available progressions for current key/scale
 */
export function getAvailableProgressions(root, scaleName) {
  const results = [];
  for (const [name, prog] of Object.entries(PROGRESSIONS)) {
    const maxIndex = Math.max(...prog.pattern);
    const numChords = DIATONIC_CHORDS[scaleName]?.length || 0;
    if (maxIndex < numChords) {
      results.push({ name, ...prog });
    }
  }
  return results;
}

/**
 * Get the fret positions for specific notes on the fretboard
 */
export function getFretPositions(notes, tuning = STANDARD_TUNING, numFrets = NUM_FRETS) {
  const positions = [];
  const noteSet = new Set(notes.map(n => n % 12));

  for (let string = 0; string < tuning.length; string++) {
    for (let fret = 0; fret <= numFrets; fret++) {
      const note = (tuning[string] + fret) % 12;
      if (noteSet.has(note)) {
        positions.push({ string, fret, note });
      }
    }
  }
  return positions;
}
