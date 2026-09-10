'use strict';
// Randomized fixtures for the MHD plasma torus spec.
// All randomness comes from crypto.randomBytes (never Math.random).

const crypto = require('crypto');

function rnd() {
  // uniform in [0,1) from 6 random bytes
  const b = crypto.randomBytes(6);
  let v = 0;
  for (const x of b) v = v * 256 + x;
  return v / 281474976710656;
}

function randInt(min, max) {
  return min + Math.floor(rnd() * (max - min + 1));
}

function randFloat(min, max, step) {
  const n = Math.round((max - min) / step);
  const v = min + randInt(0, n) * step;
  return Math.round(v * 100) / 100;
}

function pick(arr) {
  return arr[randInt(0, arr.length - 1)];
}

// How many of the q = 1, 2, 3 rational surfaces exist inside the plasma
// for a monotonic q profile q(r) = q0 + (qedge - q0) * (r/a)^2 .
// A surface exists iff q0 < q_target <= qedge (r in (0, a]).
function ringCount(q0, qedge) {
  let c = 0;
  for (const q of [1, 2, 3]) {
    if (q > q0 + 1e-9 && q <= qedge + 1e-9) c++;
  }
  return c;
}

// Random (q0, qedge) inside the slider ranges (q0: 0.5..2.0, qedge: 2.0..6.0)
// producing exactly `target` rational surfaces.
function randPlasma(target) {
  let cfg;
  if (target === 0) {
    cfg = { q0: 2, qedge: 2 };            // degenerate flat profile -> no markers
  } else if (target === 1) {
    cfg = { q0: randFloat(1.05, 1.95, 0.01), qedge: randFloat(2.0, 2.9, 0.01) };
  } else if (target === 2) {
    cfg = pick([0, 1]) === 0
      ? { q0: randFloat(0.5, 0.95, 0.01), qedge: randFloat(2.0, 2.9, 0.01) }
      : { q0: randFloat(1.05, 1.95, 0.01), qedge: randFloat(3.05, 6.0, 0.01) };
  } else {
    cfg = { q0: randFloat(0.5, 0.95, 0.01), qedge: randFloat(3.05, 6.0, 0.01) };
  }
  if (ringCount(cfg.q0, cfg.qedge) !== target) {
    throw new Error('fixture generated inconsistent plasma: ' + JSON.stringify(cfg));
  }
  return cfg;
}

// A flat profile with no rational surfaces at all (baseline measurement).
function zeroRingPlasma() {
  return randPlasma(0);
}

// Two distinct "lines per flux surface" values inside the slider range 1..8.
function randLinePair() {
  const low = randInt(1, 4);
  const high = low + randInt(1, 4);
  return { low, high };
}

// Generic alias kept for convenience.
function randLevel() {
  return {
    lines: randLinePair(),
    plasma: randPlasma(randInt(1, 3)),
  };
}

module.exports = {
  rnd,
  randInt,
  randFloat,
  pick,
  ringCount,
  randPlasma,
  zeroRingPlasma,
  randLinePair,
  randLevel,
};