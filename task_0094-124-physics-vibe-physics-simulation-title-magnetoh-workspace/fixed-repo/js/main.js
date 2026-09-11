// ═══════════════════════════════════════════════════════════
// main.js — Entry point: wires state, Three.js, UI together
// ═══════════════════════════════════════════════════════════

import { state, saveState, popUndo, popRedo, persistState, loadPersistedState,
         computeBetaCrit, qProfile, findRationalSurface, growthRate, PRESETS,
         NUM_SURFACES, R0, A,
         setInstabilityActive, setXiAmplitude, setPhase, setActiveMode,
         setPaused, setScreenShakeAmplitude, setCurrentStatus } from './state.js';
import { syncSlidersFromState, isMobile, smoothTween } from './utils.js';
import { setupKeyboard, setupHelpButton } from './keyboard.js';
import { updateReadouts, setStatusBadge, updateExplanation } from './ui/readouts.js';
import { drawQChart } from './ui/chart.js';

// ─── Three.js Scene (global, not a module — uses CDN Three) ──
let THREE_scene, THREE_camera, THREE_renderer, THREE_composer, THREE_controls;
let fluxMeshes = [], fluxOriginals = [], fieldLineMeshes = [], rationalRings = [];
let particleGeo, particleMat, particlePositions, particleVelocities, particleAge;
let disruptionFrame = 0, coreGlow;
let xi_amplitude = 0, phase = 0, active_m = 1, active_n = 1;
let isPaused = false, currentStatus = 'confined', screenShakeAmplitude = 0;
let instabilityActive = false, lastInteractionTime = 0;
let frameCount = 0, lastFpsTime = performance.now();
const fixedDt = 0.016;

// ─── Three.js Init ────────────────────────────────────────
function initThree() {
  const container = document.getElementById('canvas-container');
  const w = container.clientWidth, h = container.clientHeight;
  THREE_scene = new THREE.Scene();
  THREE_scene.background = new THREE.Color(0x040201);
  THREE_scene.fog = new THREE.FogExp2(0x040201, 0.04);
  THREE_camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
  THREE_camera.position.set(6, 4, 6);
  THREE_camera.lookAt(0, 0, 0);
  THREE_renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  THREE_renderer.setSize(w, h);
  THREE_renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  THREE_renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(THREE_renderer.domElement);

  try {
    THREE_composer = new THREE.EffectComposer(THREE_renderer);
    THREE_composer.addPass(new THREE.RenderPass(THREE_scene, THREE_camera));
    THREE_composer.addPass(new THREE.UnrealBloomPass(new THREE.Vector2(w, h), 0.8, 0.5, 0.2));
  } catch(e) { THREE_composer = null; }

  THREE_controls = new THREE.OrbitControls(THREE_camera, THREE_renderer.domElement);
  THREE_controls.enableDamping = true; THREE_controls.dampingFactor = 0.08;
  THREE_controls.autoRotate = true; THREE_controls.autoRotateSpeed = 0.6;
  THREE_controls.minDistance = 2; THREE_controls.maxDistance = 20;
  THREE_controls.target.set(0, 0, 0);
  THREE_controls.addEventListener('start', () => { lastInteractionTime = performance.now(); THREE_controls.autoRotate = false; });

  // Lighting
  THREE_scene.add(new THREE.AmbientLight(0x1A0800, 0.4));
  const kl = new THREE.DirectionalLight(0xFFB347, 0.8); kl.position.set(5, 5, 3); THREE_scene.add(kl);
  coreGlow = new THREE.PointLight(0xFFD700, 2, 8, 2); coreGlow.position.set(0, 0, 0); THREE_scene.add(coreGlow);
  const ol = new THREE.PointLight(0xFF8C00, 1, 6, 2); ol.position.set(R0, 0, 0); THREE_scene.add(ol);
  const rl = new THREE.PointLight(0xFF4500, 0.5, 10, 2); rl.position.set(-R0, 2, -2); THREE_scene.add(rl);

  // Grid
  const gH = new THREE.GridHelper(12, 24, 0x1A0800, 0x0C0600);
  gH.position.y = -0.01; gH.material.transparent = true; gH.material.opacity = 0.3;
  THREE_scene.add(gH);

  // Magnetic axis
  THREE_scene.add(new THREE.Mesh(new THREE.TorusGeometry(R0, 0.03, 8, 128),
    new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xFFAA00, emissiveIntensity: 0.8, transparent: true, opacity: 0.8 })));

  // Vacuum vessel
  THREE_scene.add(new THREE.Mesh(new THREE.TorusGeometry(R0, A * 1.35, 32, 128),
    new THREE.MeshStandardMaterial({ color: 0x1A0800, transparent: true, opacity: 0.06, side: THREE.BackSide, depthWrite: false })));

  initParticles();
  rebuildSurfaces();
  rebuildFieldLines();
  rebuildRational();

  window.addEventListener('resize', onResize);
  THREE_renderer.domElement.addEventListener('dblclick', () => {
    smoothTween(THREE_camera.position, { x: 6, y: 4, z: 6, duration: 1 });
    THREE_controls.target.set(0, 0, 0);
  });
}

function onResize() {
  const c = document.getElementById('canvas-container');
  const w = c.clientWidth, h = c.clientHeight;
  if (!w || !h) return;
  THREE_camera.aspect = w / h; THREE_camera.updateProjectionMatrix();
  THREE_renderer.setSize(w, h);
  if (THREE_composer) THREE_composer.setSize(w, h);
}

// ─── Geometry Rebuilders ──────────────────────────────────
const SC = [0xFFFDE7, 0xFFD700, 0xFFBF00, 0xFF8C00, 0xFF6600, 0xFF4500, 0xCC2200, 0x661100];
const SE = [0xFFFDE7, 0xFFD700, 0xFFBF00, 0xFF8C00, 0xFF6600, 0xFF4500, 0xCC2200, 0x440800];
const SURFACE_RADII = [];
for (let i = 0; i < NUM_SURFACES; i++) SURFACE_RADII.push((i + 1) / NUM_SURFACES * A);
window.__debugSurfaceRadii = SURFACE_RADII;

// Radial segment count for a flux-surface torus, scaled by how visually
// significant the surface is: the small inner surfaces need far fewer
// segments to look smooth than the large outer ones.
function surfaceRadialSegments(i) {
  return Math.round(8 + (48 - 8) * (i / (NUM_SURFACES - 1)));
}

function rebuildSurfaces() {
  fluxMeshes.forEach(m => { THREE_scene.remove(m); m.geometry.dispose(); m.material.dispose(); });
  fluxMeshes = []; fluxOriginals = [];
  for (let i = 0; i < NUM_SURFACES; i++) {
    const geo = new THREE.TorusGeometry(R0, SURFACE_RADII[i], surfaceRadialSegments(i), 128);
    const mat = new THREE.MeshStandardMaterial({
      color: SC[i], emissive: SE[i], emissiveIntensity: 0.3 - i * 0.03,
      transparent: true, opacity: 0.15 - i * 0.012, side: THREE.DoubleSide, depthWrite: false,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.visible = state.showFluxSurfaces;
    THREE_scene.add(mesh);
    fluxMeshes.push(mesh);
    // FIX 2 STEP A: Store original positions in geometry userData
    const orig = new Float32Array(geo.attributes.position.array.length);
    orig.set(geo.attributes.position.array);
    geo.userData.origPos = new Float32Array(orig); // immutable reference copy
    fluxOriginals.push(orig);
  }
}

function rebuildFieldLines() {
  fieldLineMeshes.forEach(m => { THREE_scene.remove(m); m.geometry.dispose(); m.material.dispose(); });
  fieldLineMeshes = [];
  const lps = isMobile() ? Math.min(state.linesPerSurface, 2) : state.linesPerSurface;
  for (let i = 0; i < NUM_SURFACES; i++) {
    const rf = SURFACE_RADII[i], qv = qProfile(rf);
    if (qv <= 0 || !isFinite(qv)) continue;
    for (let j = 0; j < lps; j++) {
      const pts = flPoints(rf, qv, state.toroidalCircuits, (j / lps) * 2 * Math.PI);
      const crv = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0);
      // Keep tube smoothness per helical turn constant instead of a flat
      // segment count, so lines with more toroidal circuits don't get
      // visibly coarser per turn.
      const tubeSegments = Math.round(133 * state.toroidalCircuits);
      const geo = new THREE.TubeGeometry(crv, tubeSegments, 0.015, 6, false);
      const mat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, emissive: 0xFFCC88, emissiveIntensity: 0.5, transparent: true, opacity: 0.7, depthWrite: false });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = state.showFieldLines;
      THREE_scene.add(mesh);
      fieldLineMeshes.push(mesh);
    }
  }
}

function flPoints(rf, qv, nc, ps) {
  const pts = [], N = 400 * nc;
  for (let i = 0; i <= N; i++) {
    const phi = ps + (i / N) * 2 * Math.PI * nc;
    const theta = (i / N) * 2 * Math.PI * nc / qv;
    pts.push(new THREE.Vector3(
      (R0 + rf * Math.cos(theta)) * Math.cos(phi),
      rf * Math.sin(theta),
      (R0 + rf * Math.cos(theta)) * Math.sin(phi)
    ));
  }
  return pts;
}

// FIX 1: Rational surface markers are SEPARATE objects (thin rings).
// Never modify flux surface materials when toggling rational surfaces.
function rebuildRational() {
  rationalRings.forEach(m => { THREE_scene.remove(m); m.geometry.dispose(); m.material.dispose(); });
  rationalRings = [];
  const targets = [
    { q_target: 1, color: 0xFF0066, label: 'q=1' },
    { q_target: 2, color: 0xFFAA00, label: 'q=2' },
    { q_target: 3, color: 0xFFD700, label: 'q=3' }
  ];
  for (const { q_target, color } of targets) {
    if (q_target < state.q0 || q_target > state.qedge) continue;
    const r = findRationalSurface(q_target, 1);
    if (r === null || r <= 0 || r > A) continue;
    const geo = new THREE.TorusGeometry(R0, r, 4, 128);
    const mat = new THREE.MeshBasicMaterial({
      color: color, transparent: true, opacity: 0.6,
      wireframe: true, depthWrite: false
    });
    const marker = new THREE.Mesh(geo, mat);
    marker.visible = state.showRationalSurfaces;
    THREE_scene.add(marker);
    rationalRings.push(marker);
  }
}

// ─── Particles ────────────────────────────────────────────
function initParticles() {
  const n = 300;
  particlePositions = new Float32Array(n * 3);
  particleVelocities = new Float32Array(n * 3);
  particleAge = new Float32Array(n);
  particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  const cv = document.createElement('canvas'); cv.width = cv.height = 32;
  const cx = cv.getContext('2d');
  const gr = cx.createRadialGradient(16, 16, 0, 16, 16, 16);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.3, 'rgba(255,215,0,0.8)'); gr.addColorStop(1, 'rgba(255,140,0,0)');
  cx.fillStyle = gr; cx.fillRect(0, 0, 32, 32);
  particleMat = new THREE.PointsMaterial({ color: 0xFFD700, size: 0.08, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, map: new THREE.CanvasTexture(cv), sizeAttenuation: true });
  THREE_scene.add(new THREE.Points(particleGeo, particleMat));
}

function spawnParticles() {
  for (let i = 0; i < 300; i++) {
    const th = Math.random() * Math.PI * 2, ph = Math.random() * Math.PI * 2;
    const r = A * (0.8 + 0.2 * Math.random());
    const x = (R0 + r * Math.cos(th)) * Math.cos(ph), y = r * Math.sin(th), z = (R0 + r * Math.cos(th)) * Math.sin(ph);
    particlePositions[i*3] = x; particlePositions[i*3+1] = y; particlePositions[i*3+2] = z;
    const rc = R0 + r * Math.cos(th), sp = 2 + Math.random() * 4;
    particleVelocities[i*3] = x/(rc+0.001)*sp + (Math.random()-0.5)*1.5;
    particleVelocities[i*3+1] = y/(r+0.001)*sp + (Math.random()-0.5)*1.5;
    particleVelocities[i*3+2] = z/(rc+0.001)*sp + (Math.random()-0.5)*1.5;
    particleAge[i] = 0;
  }
  disruptionFrame = 0;
  particleMat.opacity = 1;
  particleGeo.attributes.position.needsUpdate = true;
}

function updateParticles(dt) {
  if (disruptionFrame <= 0 && particleMat.opacity <= 0) return;
  disruptionFrame++;
  let any = false;
  for (let i = 0; i < 300; i++) {
    particleAge[i] += dt;
    if (particleAge[i] < 4) {
      any = true;
      particlePositions[i*3] += particleVelocities[i*3] * dt;
      particlePositions[i*3+1] += particleVelocities[i*3+1] * dt;
      particlePositions[i*3+2] += particleVelocities[i*3+2] * dt;
      particleVelocities[i*3] *= 0.98; particleVelocities[i*3+1] *= 0.98; particleVelocities[i*3+2] *= 0.98;
    }
  }
  particleGeo.attributes.position.needsUpdate = true;
  particleMat.opacity = any ? Math.max(0, 1 - disruptionFrame / 120) : 0;
}

// ─── Instability Mode ─────────────────────────────────────
// FIX 2: Always read from userData.origPos (never from displaced positions)
// FIX 4: Removed computeVertexNormals() — not needed for emissive materials
function applyMode(geo, m, n, xi0, ph) {
  const pos = geo.attributes.position;
  const orig = geo.userData.origPos;
  if (!orig) return; // safety guard
  for (let i = 0; i < pos.count; i++) {
    const x = orig[i * 3];
    const y = orig[i * 3 + 1];
    const z = orig[i * 3 + 2];
    const R_cyl = Math.sqrt(x * x + z * z);
    const phi = Math.atan2(z, x);
    const theta = Math.atan2(y, R_cyl - R0 + 0.001);
    const r_curr = Math.sqrt((R_cyl - R0) ** 2 + y ** 2);
    let xi;
    if (m === 0 && n === 0) {
      xi = xi0 * Math.cos(ph) + xi0 * 0.5 * Math.cos(2 * phi - ph * 1.3);
    } else {
      xi = xi0 * Math.cos(m * theta - n * phi + ph);
    }
    if (r_curr < 0.001) {
      pos.setXYZ(i, x, y, z);
      continue;
    }
    // Clamp xi to prevent extreme displacement
    const xi_clamped = Math.max(-r_curr * 0.5, Math.min(r_curr * 0.5, xi));
    // Poloidal radial unit vector components
    const dr_x = (R_cyl - R0) / r_curr;
    const dr_y = y / r_curr;
    // Displace radially from magnetic axis
    pos.setXYZ(i,
      x + xi_clamped * dr_x * Math.cos(phi),
      y + xi_clamped * dr_y,
      z + xi_clamped * dr_x * Math.sin(phi)
    );
  }
  pos.needsUpdate = true;
}

// FIX 2 STEP C: Cap xi_amplitude at 0.28 (disruption fires before extreme deformation)
// FIX 4: Throttle to every 2 frames, only deform inner 5 surfaces
let deformFrame = 0;

function restoreAllGeometries() {
  // FIX 3: Explicitly restore all flux surface geometries to original positions
  fluxMeshes.forEach(mesh => {
    const pos = mesh.geometry.attributes.position;
    const orig = mesh.geometry.userData.origPos;
    if (!orig) return;
    for (let i = 0; i < pos.count; i++) {
      pos.setXYZ(i, orig[i * 3], orig[i * 3 + 1], orig[i * 3 + 2]);
    }
    pos.needsUpdate = true;
  });
  xi_amplitude = 0;
  instabilityActive = false;
}

function updateInstability(dt) {
  if (!instabilityActive) {
    xi_amplitude *= 0.97;
    if (xi_amplitude < 0.001) xi_amplitude = 0;
  } else {
    const g = growthRate(active_m, active_n);
    // FIX 2 STEP C: Growth rate formula, cap at 0.28
    xi_amplitude = Math.min(xi_amplitude + g * 0.025, 0.28);
    phase += g * 1.5 * dt * 60;
    if (!isFinite(xi_amplitude)) { xi_amplitude = 0; instabilityActive = false; }
  }
  if (xi_amplitude > 0.001) {
    // FIX 4B: Only deform inner 5 surfaces (i=0..4), outer 3 stay at original
    deformFrame++;
    if (deformFrame % 2 === 0) { // FIX 4C: Throttle to every 2 frames
      for (let i = 0; i < NUM_SURFACES; i++) {
        const mesh = fluxMeshes[i];
        if (i >= 5) {
          // Outer surfaces: restore to original each frame
          const pos = mesh.geometry.attributes.position;
          const orig = mesh.geometry.userData.origPos;
          if (orig) {
            for (let j = 0; j < pos.count; j++) {
              pos.setXYZ(j, orig[j * 3], orig[j * 3 + 1], orig[j * 3 + 2]);
            }
            pos.needsUpdate = true;
          }
        } else {
          // Inner 5 surfaces: apply deformation with exponential decay
          const local_xi = xi_amplitude * 0.15 * Math.exp(-2.0 * i / 5);
          applyMode(mesh.geometry, active_m, active_n, local_xi, phase);
          mesh.geometry.attributes.position.needsUpdate = true;
        }
      }
    }
  }
  // FIX 2 STEP C: disruption threshold = 0.28 (matches cap)
  if (xi_amplitude > 0.28 && instabilityActive) triggerDisruption();
}

function triggerMode(m, n) {
  if (isPaused) return;
  active_m = m; active_n = n; instabilityActive = true;
  // status is computed by updateStatus() — no manual override needed
}

// FIX 3: Restore geometries BEFORE disruption effects
function triggerDisruption() {
  saveState();
  restoreAllGeometries(); // FIX 3: explicitly restore all flux surface geometry
  instabilityActive = false; xi_amplitude = 0; phase = 0;
  screenShakeAmplitude = 0.3;
  spawnParticles();
  fluxMeshes.forEach(m => { m.material.emissiveIntensity = 1.5; });
  setTimeout(() => fluxMeshes.forEach((m, i) => { m.material.emissiveIntensity = 0.3-i*0.03; }), 300);
  if (coreGlow) coreGlow.intensity = 8;
  setTimeout(() => { if (coreGlow) coreGlow.intensity = 2; }, 400);
  state.q0 = Math.min(state.q0 + 0.3, 1.2);
  syncSlidersFromState(state); persistState();
  rebuildFieldLines(); rebuildRational();
  currentStatus = 'disrupted';
  setTimeout(() => {
    if (currentStatus === 'disrupted') {
      const paramsUnstable = (state.q0 < 1.0) || (state.beta > computeBetaCrit());
      currentStatus = paramsUnstable ? 'warning' : 'confined';
    }
  }, 2500);
}

// ─── Status Update ────────────────────────────────────────
function updateStatus() {
  if (currentStatus === 'disrupted') return; // stay disrupted until timeout clears it
  const hasActiveMode = instabilityActive && xi_amplitude > 0.01;
  const paramsUnstable = (state.q0 < 1.0) || (state.beta > computeBetaCrit());

  if (hasActiveMode) currentStatus = 'degrading';
  else if (paramsUnstable) currentStatus = 'warning';
  else currentStatus = 'confined';
}

// ─── App Interface (for modules) ──────────────────────────
const app = {
  rebuildFieldLines,
  rebuildRational,
  updateReadouts: () => updateReadouts({ scene: THREE_scene, status: currentStatus, xiAmp: xi_amplitude, isActive: instabilityActive, modeM: active_m, modeN: active_n }),
  updateExplanation: () => updateExplanation({ status: currentStatus, modeM: active_m, isActive: instabilityActive }),
  drawQChart,
  loadPreset(name) {
    const p = PRESETS[name]; if (!p) return;
    Object.assign(state, p);
    instabilityActive = false; xi_amplitude = 0; phase = 0;
    restoreAllGeometries(); // FIX 3: restore before rebuild
    syncSlidersFromState(state);
    rebuildSurfaces(); rebuildFieldLines(); rebuildRational();
    const paramsUnstable = (state.q0 < 1.0) || (state.beta > computeBetaCrit());
    currentStatus = paramsUnstable ? 'warning' : 'confined';
  },
  triggerMode,
  togglePause() {
    isPaused = !isPaused;
    const btn = document.getElementById('btn-pause');
    btn.innerHTML = isPaused ? '▶ RESUME' : '▶ PAUSE <span class="kbd">Space</span>';
    btn.classList.toggle('active-toggle', isPaused);
  },
  reset() {
    state.q0 = 0.9; state.qedge = 3.5; state.beta = 0.015; state.alpha = 2;
    state.linesPerSurface = 4; state.toroidalCircuits = 3;
    instabilityActive = false; xi_amplitude = 0; phase = 0;
    restoreAllGeometries(); // FIX 3: restore clean geometry on reset
    syncSlidersFromState(state);
    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('[data-preset="iter"]').classList.add('active');
    rebuildSurfaces(); rebuildFieldLines(); rebuildRational();
    currentStatus = 'confined';
  },
  screenshot() {
    if (THREE_composer) THREE_composer.render(); else THREE_renderer.render(THREE_scene, THREE_camera);
    const link = document.createElement('a');
    link.download = 'mhd_plasma_' + Date.now() + '.png';
    link.href = THREE_renderer.domElement.toDataURL('image/png');
    link.click();
  },
  undo() { const s = popUndo(); if (s) Object.assign(state, s); syncSlidersFromState(state); rebuildFieldLines(); rebuildRational(); },
  redo() { const s = popRedo(); if (s) Object.assign(state, s); syncSlidersFromState(state); rebuildFieldLines(); rebuildRational(); },
  toggleAutoRotate() { state.autoRotate = !state.autoRotate; THREE_controls.autoRotate = state.autoRotate; },
  toggleFieldLines() { state.showFieldLines = !state.showFieldLines; fieldLineMeshes.forEach(m => m.visible = state.showFieldLines); },
  getFluxMeshes: () => fluxMeshes,
  getFieldLineMeshes: () => fieldLineMeshes,
  getRationalRings: () => rationalRings,
  getControls: () => THREE_controls,
};

// ─── Animation Loop ───────────────────────────────────────
function animate() {
  requestAnimationFrame(animate);
  if (!isPaused) {
    updateInstability(fixedDt);
    updateParticles(fixedDt);
    if (state.autoRotate && !THREE_controls.autoRotate && performance.now() - lastInteractionTime > 4000) THREE_controls.autoRotate = true;
  }
  THREE_controls.update();
  if (screenShakeAmplitude > 0.001) {
    THREE_camera.position.x += (Math.random()-0.5)*screenShakeAmplitude;
    THREE_camera.position.y += (Math.random()-0.5)*screenShakeAmplitude;
    THREE_camera.position.z += (Math.random()-0.5)*screenShakeAmplitude;
    screenShakeAmplitude *= 0.92;
    THREE_controls.update();
  }
  if (THREE_composer) THREE_composer.render(); else THREE_renderer.render(THREE_scene, THREE_camera);
  frameCount++;
  const now = performance.now();
  if (now - lastFpsTime > 500) {
    document.getElementById('fps-counter').textContent = Math.round(frameCount/((now-lastFpsTime)/1000)) + ' FPS';
    lastFpsTime = now; frameCount = 0;
  }
  if (frameCount % 5 === 0) {
    updateStatus();
    setStatusBadge(currentStatus);
    app.updateReadouts();
    if (frameCount % 15 === 0) { app.drawQChart(); app.updateExplanation(); }
  }
}

// ─── Init ─────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  try {
    const gl = document.createElement('canvas').getContext('webgl');
    if (!gl) { document.getElementById('loading').innerHTML = '<p style="color:#FF2020">WebGL required.</p>'; return; }
  } catch(e) { return; }
  try { initThree(); } catch(e) { document.getElementById('loading').innerHTML = '<p style="color:#FF2020">'+e.message+'</p>'; return; }

  // Wire up UI
  import('./ui/controls.js').then(({ setupSliders, setupPresets, setupToggles, setupActionButtons }) => {
    setupSliders(app);
    setupPresets(app);
    setupToggles(app);
    setupActionButtons(app);
  });
  setupKeyboard(app);
  setupHelpButton();

  // Load persisted state
  if (loadPersistedState()) {
    syncSlidersFromState(state);
    rebuildSurfaces(); rebuildFieldLines(); rebuildRational();
  }

  // Tutorial
  if (!localStorage.getItem('mhd_visited')) {
    const tut = document.getElementById('tutorial-overlay');
    tut.style.display = 'flex';
    document.getElementById('tutorial-dismiss').addEventListener('click', () => {
      tut.style.display = 'none';
      localStorage.setItem('mhd_visited', '1');
    });
  }

  updateStatus();
  setStatusBadge(currentStatus);
  app.updateReadouts();
  app.drawQChart();
  app.updateExplanation();

  setTimeout(() => {
    document.getElementById('loading').classList.add('hidden');
    setTimeout(() => document.getElementById('loading').style.display = 'none', 600);
  }, 500);
  animate();
});
