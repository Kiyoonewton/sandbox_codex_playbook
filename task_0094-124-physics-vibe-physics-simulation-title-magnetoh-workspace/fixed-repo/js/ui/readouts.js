// ═══════════════════════════════════════════════════════════
// ui/readouts.js — Right panel: data readouts, status, explanation
// ═══════════════════════════════════════════════════════════

import { state, NUM_SURFACES, qProfile, findRationalSurface, computeBetaCrit, growthRate } from '../state.js';

export function updateReadouts(params) {
  const { scene, status, xiAmp, isActive, modeM, modeN } = params;
  document.getElementById('d-q0').textContent = state.q0.toFixed(2);
  document.getElementById('d-qedge').textContent = state.qedge.toFixed(2);

  const q1 = findRationalSurface(1, 1);
  const q2 = findRationalSurface(2, 1);
  const q3 = findRationalSurface(3, 1);

  function setRSurface(valEl, sufEl, rVal) {
    if (rVal !== null && rVal >= 0 && rVal <= 1.0) {
      valEl.textContent = (rVal / 1.0).toFixed(2);
      sufEl.textContent = 'a';
    } else {
      valEl.textContent = 'N/A';
      sufEl.textContent = '';
    }
  }
  setRSurface(document.getElementById('d-q1'), document.getElementById('d-q1-suf'), q1);
  setRSurface(document.getElementById('d-q2'), document.getElementById('d-q2-suf'), q2);
  setRSurface(document.getElementById('d-q3'), document.getElementById('d-q3-suf'), q3);

  document.getElementById('d-beta').textContent = (state.beta * 100).toFixed(2);
  const bc = computeBetaCrit();
  document.getElementById('d-troyon').textContent = (bc * 100).toFixed(2);
  const ratio = state.beta / (bc + 0.001);

  const dR = document.getElementById('d-ratio');
  dR.textContent = ratio.toFixed(2) + '×';
  dR.style.color = ratio > 1 ? '#FF2020' : ratio > 0.8 ? '#FFD700' : 'var(--accent)';

  const bf = document.getElementById('beta-fill');
  const bm = document.getElementById('beta-meter');
  if (bf) {
    bf.style.width = Math.min(ratio * 100, 100) + '%';
    bf.style.background = ratio > 1 ? 'linear-gradient(90deg,#FF8C00,#FF2020)' : ratio > 0.8 ? 'linear-gradient(90deg,#39FF14,#FFD700)' : 'linear-gradient(90deg,#39FF14,#FF8C00)';
    if (bm) bm.classList.toggle('danger', ratio > 1);
  }

  const kE = document.getElementById('d-kink');
  kE.textContent = state.q0 >= 1 ? '◉ STABLE' : '⚠ UNSTABLE';
  kE.style.color = state.q0 >= 1 ? '#39FF14' : '#FF0066';
  const bE = document.getElementById('d-balloon');
  bE.textContent = state.beta < bc ? '◉ STABLE' : '⚠ UNSTABLE';
  bE.style.color = state.beta < bc ? '#39FF14' : '#FFAA00';

  const mn = { '1,1': 'KINK (m=1,n=1)', '0,0': 'SAUSAGE (m=0)', '2,1': 'BALLOONING (m=2,n=1)' };
  document.getElementById('d-mode').textContent = isActive ? (mn[modeM + ',' + modeN] || 'UNKNOWN') : 'NONE';
  const gamma = isActive ? growthRate(modeM, modeN) : 0;
  document.getElementById('d-gamma').textContent = gamma.toFixed(3);
  document.getElementById('d-xi').textContent = xiAmp.toFixed(3);

  const ds = document.getElementById('d-status');
  if (status === 'confined') { ds.textContent = '◉ CONFINED'; ds.style.color = '#39FF14'; }
  else if (status === 'warning') { ds.textContent = '⚠ WARNING'; ds.style.color = '#FFD700'; }
  else if (status === 'degrading') { ds.textContent = '⚠ DEGRADING'; ds.style.color = '#FF8C00'; }
  else { ds.textContent = '🔴 DISRUPTED'; ds.style.color = '#FF2020'; }

  document.getElementById('d-surfaces').textContent = NUM_SURFACES;
  document.getElementById('d-fieldlines').textContent = NUM_SURFACES * state.linesPerSurface;

  let tc = 0;
  scene.traverse(o => {
    if (o.isMesh && o.geometry) {
      const ix = o.geometry.index;
      tc += ix ? ix.count / 3 : o.geometry.attributes.position.count / 3;
    }
  });
  document.getElementById('d-triangles').textContent = Math.round(tc).toLocaleString();
}

export function setStatusBadge(s) {
  const badge = document.getElementById('status-badge');
  badge.className = s;
  if (s === 'confined') badge.innerHTML = '◉ CONFINED';
  else if (s === 'warning') badge.innerHTML = '⚠ WARNING';
  else if (s === 'degrading') badge.innerHTML = '⚠ DEGRADING';
  else badge.innerHTML = '🔴 DISRUPTED';
}

export function updateExplanation(params) {
  const { status, modeM, isActive } = params;
  const el = document.getElementById('explanation-text');
  const bar = document.getElementById('bottom-bar');
  bar.className = '';
  if (status === 'disrupted') {
    el.innerHTML = '<em>Disruption!</em> Instability past threshold. Plasma energy lost to walls in milliseconds.';
    bar.classList.add('danger-flash');
  } else if (isActive && modeM === 1) {
    el.innerHTML = '<em>q₀ &lt; 1 detected.</em> Kink mode (m=1,n=1) unstable — plasma column tilts like a bent hose.';
    bar.classList.add('warning-flash');
  } else if (isActive && modeM === 2) {
    el.innerHTML = '<em>β exceeds critical.</em> Ballooning modes grow on outboard side where curvature drives instability.';
    bar.classList.add('warning-flash');
  } else if (isActive && modeM === 0) {
    el.innerHTML = '<em>Sausage mode active.</em> Radial constrictions compress flux surfaces uniformly.';
    bar.classList.add('warning-flash');
  } else if (state.q0 >= 1 && state.beta < computeBetaCrit()) {
    el.innerHTML = 'Plasma confined on nested toroidal flux surfaces. <em>q(r)</em> measures turns per circuit. q &gt; 1 everywhere, β below Troyon limit.';
  } else if (state.q0 < 1) {
    el.innerHTML = '<em>Warning: q₀ &lt; 1.</em> Kink threshold exceeded. Reduce q₀ or increase edge q.';
    bar.classList.add('warning-flash');
  } else if (state.beta >= computeBetaCrit()) {
    el.innerHTML = '<em>Warning: β &gt; β_crit.</em> Troyon limit exceeded. Reduce β.';
    bar.classList.add('warning-flash');
  } else {
    el.innerHTML = 'Plasma confined. Adjust parameters to explore stability boundaries.';
  }
}
