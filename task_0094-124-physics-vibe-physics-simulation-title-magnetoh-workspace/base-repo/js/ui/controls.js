// ═══════════════════════════════════════════════════════════
// ui/controls.js — Left panel: sliders, buttons, presets, toggles
// ═══════════════════════════════════════════════════════════

import { state, saveState, persistState, PRESETS } from '../state.js';

const SLIDER_DEFS = {
  'sl-q0': { key: 'q0', display: 'val-q0', fmt: v => v.toFixed(2), rebuild: true },
  'sl-qedge': { key: 'qedge', display: 'val-qedge', fmt: v => v.toFixed(2), rebuild: true },
  'sl-beta': { key: 'beta', display: 'val-beta', fmt: v => v.toFixed(3), rebuild: false },
  'sl-alpha': { key: 'alpha', display: 'val-alpha', fmt: v => v.toFixed(2), rebuild: false },
  'sl-lines': { key: 'linesPerSurface', display: 'val-lines', fmt: v => String(Math.round(v)), rebuild: true },
  'sl-circuits': { key: 'toroidalCircuits', display: 'val-circuits', fmt: v => String(Math.round(v)), rebuild: true },
};

export function setupSliders(app) {
  for (const [id, cfg] of Object.entries(SLIDER_DEFS)) {
    document.getElementById(id).addEventListener('input', function() {
      saveState();
      state[cfg.key] = parseFloat(this.value);
      document.getElementById(cfg.display).textContent = cfg.fmt(state[cfg.key]);
      if (cfg.rebuild) app.rebuildFieldLines();
      persistState();
      app.updateReadouts();
      app.updateExplanation();
      app.drawQChart();
    });
  }
}

export function setupPresets(app) {
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      app.loadPreset(btn.dataset.preset);
    });
  });
}

export function setupToggles(app) {
  document.querySelectorAll('.toggle-row').forEach(tog => {
    tog.addEventListener('click', () => {
      tog.classList.toggle('on');
      const key = tog.dataset.key;
      state[key] = tog.classList.contains('on');
      if (key === 'showFluxSurfaces') app.getFluxMeshes().forEach(m => m.visible = state.showFluxSurfaces);
      else if (key === 'showFieldLines') app.getFieldLineMeshes().forEach(m => m.visible = state.showFieldLines);
      else if (key === 'showRationalSurfaces') app.getRationalRings().forEach(m => m.visible = state.showRationalSurfaces);
      else if (key === 'autoRotate') app.getControls().autoRotate = state.autoRotate;
      if (key === 'showQProfile') app.drawQChart();
    });
  });
}

export function setupActionButtons(app) {
  document.getElementById('btn-kink').addEventListener('click', () => app.triggerMode(1, 1));
  document.getElementById('btn-sausage').addEventListener('click', () => app.triggerMode(0, 0));
  document.getElementById('btn-balloon').addEventListener('click', () => app.triggerMode(2, 1));
  document.getElementById('btn-pause').addEventListener('click', app.togglePause.bind(app));
  document.getElementById('btn-reset').addEventListener('click', app.reset.bind(app));
  document.getElementById('btn-screenshot').addEventListener('click', app.screenshot.bind(app));
  document.getElementById('btn-undo').addEventListener('click', app.undo.bind(app));
  document.getElementById('btn-redo').addEventListener('click', app.redo.bind(app));
}
