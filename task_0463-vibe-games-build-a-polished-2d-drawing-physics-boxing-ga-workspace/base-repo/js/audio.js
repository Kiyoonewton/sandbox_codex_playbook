/* ============================================
   DOODLE PUNCH — Audio System
   Web Audio API procedural sounds
   ============================================ */
const Audio = {
  ctx: null,
  lastDrawT: 0,

  init() {
    if (!this.ctx) {
      try { this.ctx = new (window.AudioContext || window.webkitAudioContext); } catch(e) { return; }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      if (!this.ctx._unlocked) {
        const b = this.ctx.createBuffer(1, 1, this.ctx.sampleRate);
        const s = this.ctx.createBufferSource();
        s.buffer = b; s.connect(this.ctx.destination); s.start(0);
        this.ctx._unlocked = 1;
      }
    }
  },

  play(type) {
    this.init();
    if (!this.ctx) return;
    const n = this.ctx.currentTime;
    switch(type) {
      case 'draw': this._draw(n); break;
      case 'whoosh': this._whoosh(n); break;
      case 'hit': this._hit(n); break;
      case 'block': this._block(n); break;
      case 'ding': this._ding(n); break;
      case 'victory': this._victory(n); break;
    }
  },

  _draw(n) {
    if (n - this.lastDrawT < 0.06) return;
    this.lastDrawT = n;
    const d = 0.05, ln = this.ctx.sampleRate * d | 0;
    const b = this.ctx.createBuffer(1, ln, this.ctx.sampleRate);
    const a = b.getChannelData(0);
    for (let i = 0; i < ln; i++) a[i] = (Math.random() * 2 - 1) * 0.1 * (1 - i / ln);
    const s = this.ctx.createBufferSource(); s.buffer = b;
    const f = this.ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = 3200; f.Q.value = 0.6;
    s.connect(f); f.connect(this.ctx.destination); s.start(n);
  },

  _whoosh(n) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(180, n);
    o.frequency.exponentialRampToValueAtTime(700, n + 0.12);
    o.frequency.exponentialRampToValueAtTime(80, n + 0.32);
    g.gain.setValueAtTime(0, n);
    g.gain.linearRampToValueAtTime(0.25, n + 0.04);
    g.gain.exponentialRampToValueAtTime(0.001, n + 0.32);
    o.connect(g); g.connect(this.ctx.destination); o.start(n); o.stop(n + 0.35);
    const d = 0.35, ln = this.ctx.sampleRate * d | 0;
    const b = this.ctx.createBuffer(1, ln, this.ctx.sampleRate);
    const a = b.getChannelData(0);
    for (let i = 0; i < ln; i++) { const e = Math.sin(Math.PI * i / ln); a[i] = (Math.random() * 2 - 1) * 0.18 * e; }
    const s = this.ctx.createBufferSource(); s.buffer = b;
    const lp = this.ctx.createBiquadFilter(); lp.type = 'lowpass';
    lp.frequency.setValueAtTime(800, n); lp.frequency.linearRampToValueAtTime(2800, n + 0.1);
    lp.frequency.linearRampToValueAtTime(400, n + 0.35);
    s.connect(lp); lp.connect(this.ctx.destination); s.start(n);
  },

  _hit(n) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'square'; o.frequency.setValueAtTime(300, n);
    o.frequency.exponentialRampToValueAtTime(50, n + 0.3);
    g.gain.setValueAtTime(0.35, n); g.gain.exponentialRampToValueAtTime(0.001, n + 0.35);
    o.connect(g); g.connect(this.ctx.destination); o.start(n); o.stop(n + 0.4);
    const o2 = this.ctx.createOscillator(), g2 = this.ctx.createGain();
    o2.type = 'sine'; o2.frequency.setValueAtTime(150, n);
    o2.frequency.exponentialRampToValueAtTime(25, n + 0.15);
    g2.gain.setValueAtTime(0.45, n); g2.gain.exponentialRampToValueAtTime(0.001, n + 0.2);
    o2.connect(g2); g2.connect(this.ctx.destination); o2.start(n); o2.stop(n + 0.25);
  },

  _block(n) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(110, n);
    o.frequency.exponentialRampToValueAtTime(35, n + 0.18);
    g.gain.setValueAtTime(0.45, n); g.gain.exponentialRampToValueAtTime(0.001, n + 0.22);
    o.connect(g); g.connect(this.ctx.destination); o.start(n); o.stop(n + 0.25);
    const d = 0.12, ln = this.ctx.sampleRate * d | 0;
    const b = this.ctx.createBuffer(1, ln, this.ctx.sampleRate);
    const a = b.getChannelData(0);
    for (let i = 0; i < ln; i++) a[i] = (Math.random() * 2 - 1) * 0.25 * (1 - i / ln);
    const s = this.ctx.createBufferSource(); s.buffer = b;
    const bf = this.ctx.createBiquadFilter(); bf.type = 'bandpass'; bf.frequency.value = 700;
    s.connect(bf); bf.connect(this.ctx.destination); s.start(n + 0.02);
  },

  _ding(n) {
    const o = this.ctx.createOscillator(), g = this.ctx.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(880, n);
    o.frequency.setValueAtTime(1100, n + 0.1);
    g.gain.setValueAtTime(0, n); g.gain.linearRampToValueAtTime(0.28, n + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, n + 0.5);
    o.connect(g); g.connect(this.ctx.destination); o.start(n); o.stop(n + 0.55);
  },

  _victory(n) {
    [0, 0.14, 0.28, 0.42].forEach((off, i) => {
      const f = [523, 659, 784, 1047][i];
      const o = this.ctx.createOscillator(), g = this.ctx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0, n + off); g.gain.linearRampToValueAtTime(0.22, n + off + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, n + off + 0.4);
      o.connect(g); g.connect(this.ctx.destination); o.start(n + off); o.stop(n + off + 0.45);
    });
  }
};
