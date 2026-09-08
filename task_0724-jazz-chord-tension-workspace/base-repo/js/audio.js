// ============================================
// WEB AUDIO SYNTHESIS
// ============================================

import { midiToFreq } from './data.js';

let audioCtx = null;

function getAudioCtx() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playNotes(midiNumbers) {
  const ctx = getAudioCtx();
  const now = ctx.currentTime;
  midiNumbers.forEach((midi, i) => {
    const freq = midiToFreq(midi);
    const osc = ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);
    osc.detune.setValueAtTime(Math.random() * 6 - 3, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.1, now + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.05, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now + i * 0.008);
    osc.stop(now + 1.6);
  });
}

export function playChordAudio(chord) {
  const midiNumbers = chord.offsets.map(o => chord.root + o);
  playNotes(midiNumbers);
}

export function playBuilderAudio(builderState) {
  const midiNumbers = builderState.map(n => 60 + n.semitone);
  playNotes(midiNumbers);
}
