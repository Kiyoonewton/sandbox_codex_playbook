// ============================================
// CHORD & INTERVAL DATA
// ============================================

export const NOTE_NAMES = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
export const NOTE_NAMES_FLAT = ['C','D\u266D','D','E\u266D','E','F','G\u266D','G','A\u266D','A','B\u266D','B'];

export function midiToName(m, useFlats) {
  return (useFlats ? NOTE_NAMES_FLAT : NOTE_NAMES)[((m % 12) + 12) % 12];
}

export function midiToFreq(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

export const CHORDS = [
  { name:'Major 7',      symbol:'Cmaj7',    root:60, offsets:[0,4,7,11],     color:'#1a6fff', desc:'Lush, dreamy stability' },
  { name:'Dominant 7',   symbol:'C7',        root:60, offsets:[0,4,7,10],    color:'#1a6fff', desc:'Bluesy tension, demands resolution' },
  { name:'Minor 7',      symbol:'Cm7',       root:60, offsets:[0,3,7,10],    color:'#1a6fff', flats:true, desc:'Warm, introspective cool' },
  { name:'Half-Dim',     symbol:'C\u00f87',       root:60, offsets:[0,3,6,10],    color:'#f5a623', desc:'Unstable yearning for resolution' },
  { name:'Diminished 7', symbol:'C\u00b07',       root:60, offsets:[0,3,6,9],     color:'#f5a623', desc:'Maximum symmetrical tension' },
  { name:'Altered Dom',  symbol:'C7alt',     root:60, offsets:[0,4,6,10,13], color:'#e74c3c', desc:'Chaotic \u2014 the jazz blowtorch' },
  { name:'Maj7#11',      symbol:'Cmaj7#11',  root:60, offsets:[0,4,11,18],   color:'#2ecc71', desc:'Lydian shimmer, floating brightness' },
];

// Interval classification database
const INT_DB = {
  0:{name:'Unison',    type:'consonant', t:0},
  1:{name:'Minor 2nd', type:'dissonant', t:3.0},
  2:{name:'Major 2nd', type:'neutral',   t:1.0},
  3:{name:'Minor 3rd', type:'consonant', t:0.5},
  4:{name:'Major 3rd', type:'consonant', t:0.5},
  5:{name:'P4',        type:'consonant', t:0.3},
  6:{name:'Tritone',   type:'dissonant', t:2.5},
  7:{name:'P5',        type:'consonant', t:0.2},
  8:{name:'Minor 6th', type:'consonant', t:0.6},
  9:{name:'Major 6th', type:'consonant', t:0.4},
  10:{name:'Minor 7th',type:'neutral',   t:1.0},
  11:{name:'Major 7th',type:'dissonant', t:2.0},
};

const COMPOUND_NAMES = {
  0:'Octave',     1:'Minor 9th',  2:'Major 9th',  3:'Minor 10th',
  4:'Major 10th', 5:'11th',       6:'Aug 11th',   7:'12th',
  8:'Minor 13th', 9:'Major 13th', 10:'Minor 14th',11:'Major 14th',
};

export function getIntervalInfo(absSemi) {
  const a = Math.abs(absSemi);
  const s = ((a % 12) + 12) % 12;
  const base = INT_DB[s] || {name:'?', type:'neutral', t:1.0};
  const octaves = Math.floor(a / 12);
  if (octaves === 0) return base;
  // Compound intervals: same quality, but octave separation softens the clash
  return {
    name: COMPOUND_NAMES[s] || base.name,
    type: base.type,
    t: base.t / Math.pow(2, octaves),
  };
}

export function getChordPairs(offsets) {
  const pairs = [];
  for (let i = 0; i < offsets.length; i++) {
    for (let j = i + 1; j < offsets.length; j++) {
      const diff = Math.abs(offsets[j] - offsets[i]);
      const s = ((diff % 12) + 12) % 12;
      const info = getIntervalInfo(diff);
      pairs.push({
        i, j,
        semitones: diff,
        ...info,
        isHighTension: s === 1,
        isTritone: s === 6,
      });
    }
  }
  return pairs;
}

export function calcTension(offsets) {
  let t = 0;
  for (let i = 0; i < offsets.length; i++) {
    for (let j = i + 1; j < offsets.length; j++) {
      t += getIntervalInfo(Math.abs(offsets[j] - offsets[i])).t;
    }
  }
  return t;
}

export function tensionColor(pct) {
  if (pct < 30) return '#2ecc71';
  if (pct < 55) return '#f5a623';
  return '#e74c3c';
}
