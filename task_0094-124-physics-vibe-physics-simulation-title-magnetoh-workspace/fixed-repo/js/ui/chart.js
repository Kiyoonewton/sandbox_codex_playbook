// ═══════════════════════════════════════════════════════════
// ui/chart.js — q-profile mini chart drawing
// ═══════════════════════════════════════════════════════════

import { state, qProfile } from '../state.js';

export function drawQChart() {
  if (!state.showQProfile) return;
  const cv = document.getElementById('q-chart');
  const cx = cv.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = cv.clientWidth || 240, h = cv.clientHeight || 140;
  cv.width = w * dpr; cv.height = h * dpr;
  cx.scale(dpr, dpr);
  const pad = { l: 28, r: 8, t: 8, b: 16 };
  const pw = w - pad.l - pad.r, ph = h - pad.t - pad.b;
  const qMax = 7;
  const A = 1.0;

  function yQ(q) { return pad.t + ph * (1 - q / qMax); }
  function xR(r) { return pad.l + (r / A) * pw; }

  // Background
  cx.fillStyle = '#080402'; cx.fillRect(0, 0, w, h);

  // Grid
  cx.strokeStyle = '#1A0800'; cx.lineWidth = 0.5;
  for (let q = 1; q <= 6; q++) {
    cx.beginPath(); cx.moveTo(pad.l, yQ(q)); cx.lineTo(w - pad.r, yQ(q)); cx.stroke();
  }

  // Rational surface lines
  cx.setLineDash([3, 3]); cx.lineWidth = 1;
  [{ q: 1, c: '#FF0066' }, { q: 2, c: '#FFAA00' }, { q: 3, c: '#FFD700' }].forEach(t => {
    cx.strokeStyle = t.c;
    cx.beginPath(); cx.moveTo(pad.l, yQ(t.q)); cx.lineTo(w - pad.r, yQ(t.q)); cx.stroke();
    cx.fillStyle = t.c; cx.font = '9px Share Tech Mono';
    cx.fillText('q=' + t.q, w - pad.r - 28, yQ(t.q) - 2);
  });

  // q-profile curve
  cx.setLineDash([]); cx.strokeStyle = '#FF8C00'; cx.lineWidth = 2;
  cx.beginPath();
  for (let i = 0; i <= 60; i++) {
    const r = (i / 60) * A, q = qProfile(r);
    i === 0 ? cx.moveTo(xR(r), yQ(q)) : cx.lineTo(xR(r), yQ(q));
  }
  cx.stroke(); cx.lineWidth = 1;

  // Axis dot
  cx.fillStyle = state.q0 < 1 ? '#FF0066' : '#FF8C00';
  cx.beginPath(); cx.arc(xR(0), yQ(state.q0), 3, 0, Math.PI * 2); cx.fill();

  // Labels
  cx.fillStyle = '#8A6A40'; cx.font = '9px Share Tech Mono';
  cx.fillText('r/a', pad.l + pw / 2 - 8, h - 2);
  [0, 0.5, 1.0].forEach(v => cx.fillText(v.toFixed(1), xR(v) - 6, h - 4));
  cx.save(); cx.translate(8, pad.t + ph / 2 + 10); cx.rotate(-Math.PI / 2);
  cx.fillText('q(r)', 0, 0); cx.restore();
}
