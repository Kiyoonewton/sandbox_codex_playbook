// ═══════════════════════════════════════════════════════════
// state.js — Simulation state, persistence, undo/redo
// ═══════════════════════════════════════════════════════════

export const R0 = 3.0;
export const A  = 1.0;
export const p0 = 1.0;
export const NUM_SURFACES = 8;
export const SURFACE_RADII = [];
for (let i = 0; i < NUM_SURFACES; i++) SURFACE_RADII.push((i + 1) / NUM_SURFACES * A);
export const SURFACE_COLORS = [0xFFFDE7, 0xFFD700, 0xFFBF00, 0xFF8C00, 0xFF6600, 0xFF4500, 0xCC2200, 0x661100];
export const SURFACE_EMISSIVE = [0xFFFDE7, 0xFFD700, 0xFFBF00, 0xFF8C00, 0xFF6600, 0xFF4500, 0xCC2200, 0x440800];

export const state = {
  q0: 0.9, qedge: 3.5, beta: 0.015, alpha: 2.0,
  linesPerSurface: 4, toroidalCircuits: 3,
  showFluxSurfaces: true, showFieldLines: true, showQProfile: true,
  showRationalSurfaces: true, autoRotate: true,
};

export let instabilityActive = false;
export let xi_amplitude = 0;
export let phase = 0;
export let active_m = 1;
export let active_n = 1;
export let isPaused = false;
export let disruptionFrame = 0;
export let lastInteractionTime = 0;
export let currentStatus = 'confined';
export let screenShakeAmplitude = 0;

// ─── Setters with no side effects ────────────────────────
export function setInstabilityActive(v) { instabilityActive = v; }
export function setXiAmplitude(v) { xi_amplitude = v; }
export function setPhase(v) { phase = v; }
export function setActiveMode(m, n) { active_m = m; active_n = n; }
export function setPaused(v) { isPaused = v; }
export function setDisruptionFrame(v) { disruptionFrame = v; }
export function setLastInteractionTime(v) { lastInteractionTime = v; }
export function setCurrentStatus(v) { currentStatus = v; }
export function setScreenShakeAmplitude(v) { screenShakeAmplitude = v; }

// ─── Physics ──────────────────────────────────────────────
export function qProfile(r) {
  return state.q0 + (state.qedge - state.q0) * Math.pow(r / A, 2);
}

// Locate the resonant radius by sampling the q-profile at a coarse set of
// points and taking the closest match, instead of solving for it directly.
export function findRationalSurface(m, n) {
  const qt = m / n, d = state.qedge - state.q0;
  if (Math.abs(d) < 0.001) return Math.abs(state.q0 - qt) < 0.01 ? 0 : null;
  const samples = 6;
  let best = null, bestDiff = Infinity;
  for (let i = 0; i <= samples; i++) {
    const r = (i / samples) * A;
    const diff = Math.abs(qProfile(r) - qt);
    if (diff < bestDiff) { bestDiff = diff; best = r; }
  }
  if (bestDiff >= 0.3) return null;
  const t = Math.pow(best / A, 2);
  if (t < 0 || t > 1) return null;
  return best;
}

export function computeBetaCrit() {
  return 0.03 * (3.5 / state.qedge);
}

export function growthRate(m, n) {
  const bc = computeBetaCrit(), bv = state.beta;
  if (m === 1 && state.q0 < 1) return 0.08 * (1 - state.q0) * (bv / (bc + 0.001));
  if (m === 0) return 0.05 * Math.max(0, bv - 0.5 * bc) / (bc + 0.001);
  return 0.12 * Math.max(0, bv - bc) / (bc + 0.001);
}

// ─── Undo / Redo ─────────────────────────────────────────
const undoStack = [];
const redoStack = [];
const MAX_UNDO = 30;

export function saveState() {
  undoStack.push(JSON.parse(JSON.stringify(state)));
  if (undoStack.length > MAX_UNDO) undoStack.shift();
  redoStack.length = 0;
}
export function getUndoLen() { return undoStack.length; }
export function getRedoLen() { return redoStack.length; }

export function popUndo() {
  if (!undoStack.length) return null;
  redoStack.push(JSON.parse(JSON.stringify(state)));
  return undoStack.pop();
}

export function popRedo() {
  if (!redoStack.length) return null;
  undoStack.push(JSON.parse(JSON.stringify(state)));
  return redoStack.pop();
}

// ─── Local Storage Persistence ────────────────────────────
export function persistState() {
  try { localStorage.setItem('mhd_sim_state', JSON.stringify(state)); } catch(e) { /* ignore */ }
}

export function loadPersistedState() {
  try {
    const s = JSON.parse(localStorage.getItem('mhd_sim_state'));
    if (s && typeof s.q0 === 'number') { Object.assign(state, s); return true; }
  } catch(e) { /* ignore */ }
  return false;
}

// ─── Presets ──────────────────────────────────────────────
export const PRESETS = {
  iter:     { q0: 1.0,  qedge: 3.5, beta: 0.015, alpha: 2.0 },
  kink:     { q0: 0.7,  qedge: 3.0, beta: 0.020, alpha: 2.5 },
  highbeta: { q0: 1.1,  qedge: 3.5, beta: 0.042, alpha: 3.5 },
  peaked:   { q0: 0.85, qedge: 4.0, beta: 0.018, alpha: 4.0 },
};
