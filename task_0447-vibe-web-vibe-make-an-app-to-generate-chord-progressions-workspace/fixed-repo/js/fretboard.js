/**
 * Fretboard Renderer - SVG-based guitar fretboard visualization
 */

import { STANDARD_TUNING, STRING_NAMES, NUM_FRETS, NOTE_NAMES, getNoteName } from './music.js';

const NUM_STRINGS = 6;
const FRET_WIDTH = 58;
const STRING_GAP = 42;
const LEFT_MARGIN = 50;
const TOP_MARGIN = 60;
const DOT_Frets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
const DOUBLE_DOT_FRETS = [12, 24];

export class Fretboard {
  constructor(container, options = {}) {
    this.container = container;
    this.tuning = options.tuning || STANDARD_TUNING;
    this.numFrets = options.numFrets || 24;
    this.visibleFrets = options.visibleFrets || 15;
    this.startFret = options.startFret || 0;
    this.scaleNotes = new Set();
    this.chordNotes = new Set();
    this.highlightedNotes = new Map(); // note -> { type, degree }
    this.onNoteClick = options.onNoteClick || null;
    this.onNoteHover = options.onNoteHover || null;
    this.noteLabels = new Map(); // note -> degree label string
    this.svg = null;
    this.noteElements = [];
    this.scrollOffset = 0;

    this.render();
  }

  render() {
    const totalWidth = LEFT_MARGIN + (this.visibleFrets) * FRET_WIDTH + 30;
    const totalHeight = TOP_MARGIN + (NUM_STRINGS - 1) * STRING_GAP + 50;

    this.container.innerHTML = '';
    this.container.style.overflowX = 'auto';
    this.container.style.overflowY = 'hidden';

    const svgNS = 'http://www.w3.org/2000/svg';
    this.svg = document.createElementNS(svgNS, 'svg');
    this.svg.setAttribute('width', totalWidth);
    this.svg.setAttribute('height', totalHeight);
    this.svg.setAttribute('viewBox', `0 0 ${totalWidth} ${totalHeight}`);
    this.svg.classList.add('fretboard-svg');

    // Background
    const bg = document.createElementNS(svgNS, 'rect');
    bg.setAttribute('width', totalWidth);
    bg.setAttribute('height', totalHeight);
    bg.setAttribute('rx', '10');
    bg.classList.add('fretboard-bg');
    this.svg.appendChild(bg);

    // Start fret label (only when not showing from fret 0)
    if (this.startFret > 0) {
      const startLabel = document.createElementNS(svgNS, 'text');
      startLabel.setAttribute('x', LEFT_MARGIN - 10);
      startLabel.setAttribute('y', TOP_MARGIN + (NUM_STRINGS - 1) * STRING_GAP / 2 + 5);
      startLabel.setAttribute('text-anchor', 'end');
      startLabel.setAttribute('fill', 'var(--ink-muted)');
      startLabel.setAttribute('font-size', '13');
      startLabel.setAttribute('font-family', 'var(--font-mono)');
      startLabel.textContent = `${this.startFret}fr`;
      this.svg.appendChild(startLabel);
    }

    // Fret wires and markers
    for (let i = 0; i <= this.visibleFrets; i++) {
      const x = LEFT_MARGIN + i * FRET_WIDTH;
      const fretNum = this.startFret + i;

      // Fret wire
      if (i > 0) {
        const wire = document.createElementNS(svgNS, 'line');
        wire.setAttribute('x1', x);
        wire.setAttribute('y1', TOP_MARGIN - 10);
        wire.setAttribute('x2', x);
        wire.setAttribute('y2', TOP_MARGIN + (NUM_STRINGS - 1) * STRING_GAP + 10);
        wire.setAttribute('stroke', 'var(--fret-wire)');
        wire.setAttribute('stroke-width', i <= 3 ? '3' : i <= 7 ? '2.5' : '2');
        this.svg.appendChild(wire);
      }

      // Fret number labels
      if (i > 0 && i < this.visibleFrets) {
        const fretLabel = document.createElementNS(svgNS, 'text');
        fretLabel.setAttribute('x', x - FRET_WIDTH / 2);
        fretLabel.setAttribute('y', TOP_MARGIN + (NUM_STRINGS - 1) * STRING_GAP + 35);
        fretLabel.setAttribute('text-anchor', 'middle');
        fretLabel.setAttribute('fill', 'var(--ink-muted)');
        fretLabel.setAttribute('font-size', '10');
        fretLabel.setAttribute('font-family', 'var(--font-mono)');
        fretLabel.textContent = fretNum;
        this.svg.appendChild(fretLabel);
      }

      // Position dots
      if (DOT_Frets.includes(fretNum) && i > 0) {
        const centerX = x - FRET_WIDTH / 2;
        const centerY = TOP_MARGIN + (NUM_STRINGS - 1) * STRING_GAP / 2;

        if (DOUBLE_DOT_FRETS.includes(fretNum)) {
          // Double dots
          [-1, 1].forEach(offset => {
            const dot = document.createElementNS(svgNS, 'circle');
            dot.setAttribute('cx', centerX);
            dot.setAttribute('cy', centerY + offset * STRING_GAP * 0.45);
            dot.setAttribute('r', 4);
            dot.setAttribute('fill', 'var(--dot-color)');
            this.svg.appendChild(dot);
          });
        } else {
          const dot = document.createElementNS(svgNS, 'circle');
          dot.setAttribute('cx', centerX);
          dot.setAttribute('cy', centerY);
          dot.setAttribute('r', 4.5);
          dot.setAttribute('fill', 'var(--dot-color)');
          this.svg.appendChild(dot);
        }
      }
    }

    // Strings
    for (let s = 0; s < NUM_STRINGS; s++) {
      const y = TOP_MARGIN + s * STRING_GAP;
      const stringLine = document.createElementNS(svgNS, 'line');
      stringLine.setAttribute('x1', LEFT_MARGIN - 4);
      stringLine.setAttribute('y1', y);
      stringLine.setAttribute('x2', LEFT_MARGIN + this.visibleFrets * FRET_WIDTH);
      stringLine.setAttribute('y2', y);

      // Thicker strings for lower pitch
      const thickness = 4 - s * 0.5;
      stringLine.setAttribute('stroke', `var(--string-color-${s + 1})`);
      stringLine.setAttribute('stroke-width', thickness);
      stringLine.setAttribute('stroke-linecap', 'round');
      this.svg.appendChild(stringLine);

      // String name labels (left side)
      const label = document.createElementNS(svgNS, 'text');
      label.setAttribute('x', 16);
      label.setAttribute('y', y + 5);
      label.setAttribute('text-anchor', 'middle');
      label.setAttribute('fill', 'var(--ink)');
      label.setAttribute('font-size', '13');
      label.setAttribute('font-weight', '600');
      label.setAttribute('font-family', 'var(--font-mono)');
      label.textContent = this.tuning.length === 6 ? STRING_NAMES[s] : getNoteName(this.tuning[s]);
      this.svg.appendChild(label);
    }

    // Note positions (empty initially)
    this.noteElements = [];
    for (let s = 0; s < NUM_STRINGS; s++) {
      for (let f = 0; f <= this.visibleFrets; f++) {
        // Skip fret-0 (open string) notes when showing from fret 0:
        // they'd overlap the string-label area and look like a visual artifact.
        if (this.startFret === 0 && f === 0) continue;

        const x = LEFT_MARGIN + f * FRET_WIDTH;
        const y = TOP_MARGIN + s * STRING_GAP;
        const fretNum = this.startFret + f;
        const note = (this.tuning[s] + fretNum) % 12;

        const group = document.createElementNS(svgNS, 'g');
        group.setAttribute('class', 'fret-note');
        group.style.display = 'none';
        group.style.cursor = 'pointer';

        // Note circle
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', f === 0 ? LEFT_MARGIN - 2 : x - FRET_WIDTH / 2);
        circle.setAttribute('cy', y);
        circle.setAttribute('r', 14);
        group.appendChild(circle);

        // Note text
        const text = document.createElementNS(svgNS, 'text');
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('font-size', '10');
        text.setAttribute('font-weight', '700');
        text.setAttribute('font-family', 'var(--font-mono)');
        text.style.pointerEvents = 'none';
        group.appendChild(text);

        // Degree label (small, below)
        const degreeLabel = document.createElementNS(svgNS, 'text');
        degreeLabel.setAttribute('text-anchor', 'middle');
        degreeLabel.setAttribute('dy', '20');
        degreeLabel.setAttribute('font-size', '8');
        degreeLabel.setAttribute('font-weight', '600');
        degreeLabel.setAttribute('font-family', 'var(--font-body)');
        degreeLabel.style.pointerEvents = 'none';
        group.appendChild(degreeLabel);

        // Hover area (invisible, larger)
        const hoverArea = document.createElementNS(svgNS, 'circle');
        hoverArea.setAttribute('cx', f === 0 ? LEFT_MARGIN - 2 : x - FRET_WIDTH / 2);
        hoverArea.setAttribute('cy', y);
        hoverArea.setAttribute('r', 18);
        hoverArea.setAttribute('fill', 'transparent');
        hoverArea.setAttribute('class', 'fret-hover-area');
        group.appendChild(hoverArea);

        this.svg.appendChild(group);

        this.noteElements.push({
          group,
          circle,
          text,
          degreeLabel,
          string: s,
          fret: fretNum,
          note,
        });
      }
    }

    this.container.appendChild(this.svg);
  }

  /**
   * Update which notes are visible and how they're styled
   */
  updateNotes(highlightedNotes, noteLabels = {}) {
    this.highlightedNotes = highlightedNotes;
    this.noteLabels = noteLabels;

    this.noteElements.forEach(({ group, circle, text, degreeLabel, string, fret, note }) => {
      const info = highlightedNotes.get(note);

      if (info) {
        group.style.display = '';
        text.textContent = getNoteName(note);

        if (info.isRoot) {
          circle.setAttribute('fill', 'var(--chord-root)');
          circle.setAttribute('stroke', 'var(--chord-root-stroke)');
          circle.setAttribute('stroke-width', '2.5');
          text.setAttribute('fill', 'var(--chord-root-text)');
          group.style.filter = 'drop-shadow(0 1px 3px rgba(212, 118, 60, 0.4))';
        } else if (info.isChordTone) {
          circle.setAttribute('fill', 'var(--chord-tone)');
          circle.setAttribute('stroke', 'var(--chord-tone-stroke)');
          circle.setAttribute('stroke-width', '2');
          text.setAttribute('fill', 'var(--chord-tone-text)');
          group.style.filter = 'drop-shadow(0 1px 2px rgba(139, 58, 74, 0.3))';
        } else {
          circle.setAttribute('fill', 'var(--scale-tone)');
          circle.setAttribute('stroke', 'var(--scale-tone-stroke)');
          circle.setAttribute('stroke-width', '1.5');
          text.setAttribute('fill', 'var(--scale-tone-text)');
          group.style.filter = 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))';
        }

        // Degree label
        const label = this.noteLabels.get(note);
        if (label && info.isChordTone) {
          degreeLabel.textContent = label;
          degreeLabel.setAttribute('fill', info.isRoot ? 'var(--chord-root)' : 'var(--chord-tone)');
        } else {
          degreeLabel.textContent = '';
        }
      } else {
        group.style.display = 'none';
      }

      // Click handler
      group.onclick = () => {
        if (this.onNoteClick && info) {
          this.onNoteClick(note, string, fret);
        }
      };

      // Hover
      group.onmouseenter = () => {
        if (this.onNoteHover) {
          this.onNoteHover(note, string, fret, 'enter');
        }
      };
      group.onmouseleave = () => {
        if (this.onNoteHover) {
          this.onNoteHover(note, string, fret, 'leave');
        }
      };
    });
  }

  /**
   * Change visible fret range
   */
  setFretRange(startFret, visibleFrets) {
    this.startFret = startFret;
    this.visibleFrets = visibleFrets;
    const currentNotes = this.highlightedNotes;
    const currentLabels = this.noteLabels;
    this.render();
    this.updateNotes(currentNotes, currentLabels);
  }

  /**
   * Highlight a specific note with a pulse animation
   */
  pulseNote(note) {
    this.noteElements.forEach(({ group, circle, string, fret, note: n }) => {
      if (n === note) {
        circle.classList.add('pulse');
        setTimeout(() => circle.classList.remove('pulse'), 600);
      }
    });
  }
}
