// ============================================
// STAFF RENDERING (SVG)
// ============================================

import { midiToName } from './data.js';
import { getChordPairs } from './data.js';

const VW = 100, VH = 160;
const STAFF_LINES = 5, LINE_GAP = 12, STAFF_TOP = 30;
const STAFF_BOT = STAFF_TOP + (STAFF_LINES - 1) * LINE_GAP;
const SEMI_TO_STEP = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6];
const SEMI_TO_STEP_FLAT = [0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6];

export function midiToStaffY(midi, useFlats) {
  const octave = Math.floor(midi / 12) - 5;
  const nc = ((midi % 12) + 12) % 12;
  const absStep = octave * 7 + (useFlats ? SEMI_TO_STEP_FLAT : SEMI_TO_STEP)[nc];
  const bottomLineStep = 2;
  return STAFF_BOT - (absStep - bottomLineStep) * (LINE_GAP / 2);
}

export function createStaffSVG(chord, onNoteHover, onNoteLeave, onArcEnter, onArcLeave) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${VW} ${VH}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  // Staff lines
  for (let l = 0; l < STAFF_LINES; l++) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    const y = STAFF_TOP + l * LINE_GAP;
    line.setAttribute('x1', 10); line.setAttribute('y1', y);
    line.setAttribute('x2', VW - 10); line.setAttribute('y2', y);
    line.setAttribute('stroke', '#252525'); line.setAttribute('stroke-width', 0.8);
    svg.appendChild(line);
  }

  // Treble clef
  const clef = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  clef.setAttribute('x', 2); clef.setAttribute('y', STAFF_TOP + 3 * LINE_GAP + 2);
  clef.setAttribute('font-size', '30'); clef.setAttribute('fill', '#2a2a2a');
  clef.setAttribute('font-family', 'serif');
  clef.textContent = '\u{1D11E}';
  svg.appendChild(clef);

  // Note positions
  const noteMidis = chord.offsets.map(o => chord.root + o);
  const noteX = 58;
  const notePositions = noteMidis.map(m => ({
    midi: m, x: noteX, y: midiToStaffY(m, chord.flats), name: midiToName(m, chord.flats)
  }));

  // Ledger lines
  notePositions.forEach(np => {
    if (np.y > STAFF_BOT + 1) {
      for (let ly = STAFF_BOT + LINE_GAP; ly <= np.y + 1; ly += LINE_GAP) {
        const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l.setAttribute('x1', np.x - 10); l.setAttribute('y1', ly);
        l.setAttribute('x2', np.x + 10); l.setAttribute('y2', ly);
        l.setAttribute('stroke', '#252525'); l.setAttribute('stroke-width', 0.8);
        svg.appendChild(l);
      }
    }
    if (np.y < STAFF_TOP - 1) {
      for (let ly = STAFF_TOP - LINE_GAP; ly >= np.y - 1; ly -= LINE_GAP) {
        const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        l.setAttribute('x1', np.x - 10); l.setAttribute('y1', ly);
        l.setAttribute('x2', np.x + 10); l.setAttribute('y2', ly);
        l.setAttribute('stroke', '#252525'); l.setAttribute('stroke-width', 0.8);
        svg.appendChild(l);
      }
    }
  });

  // Interval arcs
  const pairs = getChordPairs(chord.offsets);
  pairs.forEach((pair, pi) => {
    const np1 = notePositions[pair.i];
    const np2 = notePositions[pair.j];
    const name1 = midiToName(noteMidis[pair.i], chord.flats);
    const name2 = midiToName(noteMidis[pair.j], chord.flats);

    let arcColor, arcWidth;
    if (pair.isHighTension) { arcColor = '#e74c3c'; arcWidth = 2.8; }
    else if (pair.isTritone) { arcColor = '#f5a623'; arcWidth = 2.3; }
    else if (pair.type === 'dissonant') { arcColor = '#f5a623'; arcWidth = 1.2 + pair.t * 0.4; }
    else { arcColor = '#2ecc71'; arcWidth = 0.6 + pair.t * 0.5; }

    const arcX = np1.x - 12 - pi * 5;
    const bulge = Math.min(Math.abs(np2.y - np1.y) * 0.5 + 4, 26);
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M ${np1.x} ${np1.y} C ${arcX - bulge} ${np1.y}, ${arcX - bulge} ${np2.y}, ${np2.x} ${np2.y}`);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', arcColor);
    path.setAttribute('stroke-width', arcWidth);
    path.setAttribute('stroke-linecap', 'round');
    path.setAttribute('opacity', '0.6');
    path.dataset.baseWidth = arcWidth;

    path.addEventListener('mouseenter', e => {
      path.setAttribute('opacity', '1');
      path.setAttribute('stroke-width', parseFloat(arcWidth) + 1.5);
      onArcEnter(e, name1, name2, pair.name, pair.t);
    });
    path.addEventListener('mouseleave', () => {
      path.setAttribute('opacity', '0.6');
      path.setAttribute('stroke-width', arcWidth);
      onArcLeave();
    });
    svg.appendChild(path);
  });

  // Note heads
  notePositions.forEach(np => {
    const ripple = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    ripple.setAttribute('cx', np.x); ripple.setAttribute('cy', np.y);
    ripple.setAttribute('r', 6); ripple.setAttribute('fill', 'none');
    ripple.setAttribute('stroke', chord.color); ripple.setAttribute('stroke-width', 1.2);
    ripple.setAttribute('opacity', '0'); ripple.classList.add('ripple-bg');
    svg.appendChild(ripple);

    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', np.x); circle.setAttribute('cy', np.y);
    circle.setAttribute('r', 5.5); circle.setAttribute('fill', chord.color);
    circle.setAttribute('stroke', '#f2f2f2'); circle.setAttribute('stroke-width', 0.8);
    circle.classList.add('note-dot');

    circle.addEventListener('mouseenter', e => {
      circle.setAttribute('r', 7.5);
      onNoteHover(e, np.name, np.midi);
    });
    circle.addEventListener('mouseleave', () => {
      circle.setAttribute('r', 5.5);
      onNoteLeave();
    });
    svg.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('x', np.x + 9); text.setAttribute('y', np.y + 3.2);
    text.setAttribute('font-size', '5'); text.setAttribute('fill', '#555');
    text.setAttribute('font-family', "'Space Mono',monospace");
    text.textContent = np.name;
    svg.appendChild(text);
  });

  return svg;
}

export function triggerRipples(svg) {
  svg.querySelectorAll('.ripple-bg').forEach(r => {
    const anim = r.animate([
      { r: '6', opacity: '0.5', strokeWidth: '1.5' },
      { r: '24', opacity: '0', strokeWidth: '0.2' }
    ], { duration: 450, easing: 'ease-out' });
    anim.onfinish = () => r.setAttribute('opacity', '0');
  });
}
