/**
 * Audio Engine - Web Audio API for note and chord playback
 */

let audioCtx = null;
let masterGain = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.3;
    masterGain.connect(audioCtx.destination);
  }
  return audioCtx;
}

/**
 * Convert MIDI-like note number to frequency
 * A4 = 440Hz, MIDI 69
 */
function noteToFrequency(noteNumber) {
  return 440 * Math.pow(2, (noteNumber - 69) / 12);
}

/**
 * Convert semitone (0-11) + octave to MIDI note number
 * Using scientific pitch notation: C4 = MIDI 60
 */
function semitoneToMidi(semitone, octave = 4) {
  // C=0 in our system, C4 = MIDI 60
  return 60 + (semitone) + (octave - 4) * 12;
}

/**
 * Play a single note with a warm tone
 */
export function playNote(semitone, options = {}) {
  const ctx = getAudioContext();
  const {
    octave = 4,
    duration = 0.8,
    waveform = 'triangle',
    attack = 0.02,
    decay = 0.1,
    sustain = 0.4,
    release = 0.3,
    volume = 0.5,
  } = options;

  const now = ctx.currentTime;
  const freq = noteToFrequency(semitoneToMidi(semitone, octave));

  // Oscillator
  const osc = ctx.createOscillator();
  osc.type = waveform;
  osc.frequency.value = freq;

  // Slight detune for warmth
  const osc2 = ctx.createOscillator();
  osc2.type = waveform;
  osc2.frequency.value = freq * 1.002;

  // Envelope
  const envelope = ctx.createGain();
  envelope.gain.setValueAtTime(0, now);
  envelope.gain.linearRampToValueAtTime(volume, now + attack);
  envelope.gain.linearRampToValueAtTime(volume * sustain, now + attack + decay);
  envelope.gain.setValueAtTime(volume * sustain, now + duration - release);
  envelope.gain.linearRampToValueAtTime(0, now + duration);

  // Low-pass filter for warmth
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = freq * 4;
  filter.Q.value = 0.5;

  // Connect
  osc.connect(filter);
  osc2.connect(filter);
  filter.connect(envelope);
  envelope.connect(masterGain);

  osc.start(now);
  osc2.start(now);
  osc.stop(now + duration + 0.05);
  osc2.stop(now + duration + 0.05);
}

/**
 * Play a chord (multiple notes at once)
 */
export function playChord(semitones, options = {}) {
  const {
    octave = 3,
    stagger = 0.04,
    duration = 1.5,
    waveform = 'triangle',
    volume = 0.35,
  } = options;

  semitones.forEach((semitone, i) => {
    // Spread chords across octaves for fullness
    const oct = octave + Math.floor(i / 3);
    playNote(semitone, {
      octave: oct,
      duration,
      waveform,
      volume,
      attack: 0.03,
      sustain: 0.5,
      release: 0.4,
    });
  });
}

/**
 * Play an arpeggio (notes in sequence)
 */
export function playArpeggio(semitones, options = {}) {
  const {
    octave = 3,
    noteLength = 0.3,
    waveform = 'triangle',
    volume = 0.4,
  } = options;

  semitones.forEach((semitone, i) => {
    setTimeout(() => {
      const oct = octave + Math.floor(i / 3);
      playNote(semitone, {
        octave: oct,
        duration: noteLength * 1.5,
        waveform,
        volume,
        attack: 0.01,
        sustain: 0.3,
        release: 0.2,
      });
    }, i * noteLength * 1000);
  });
}

/**
 * Play a scale ascending
 */
export function playScale(semitones, options = {}) {
  const {
    octave = 3,
    noteLength = 0.25,
    waveform = 'triangle',
    volume = 0.4,
  } = options;

  semitones.forEach((semitone, i) => {
    const oct = octave + Math.floor(i / 7);
    setTimeout(() => {
      playNote(semitone, {
        octave: oct,
        duration: noteLength * 1.5,
        waveform,
        volume,
        attack: 0.01,
        sustain: 0.3,
        release: 0.15,
      });
    }, i * noteLength * 1000);
  });
}

/**
 * Set master volume
 */
export function setVolume(value) {
  if (masterGain) {
    masterGain.gain.value = Math.max(0, Math.min(1, value));
  }
}

/**
 * Resume audio context (needed after user gesture)
 */
export function resumeAudio() {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
}
