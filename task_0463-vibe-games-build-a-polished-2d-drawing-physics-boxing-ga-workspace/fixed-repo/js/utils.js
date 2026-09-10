/* ============================================
   DOODLE PUNCH — Utilities
   Shared helpers: draw, particles, bg doodles
   ============================================ */
const K = {
  paper: '#FFFEF5', grid: '#E8E4D8', ink: '#1E293B',
  blue: '#2563EB', blueLt: '#60A5FA', bluePl: '#BFDBFE',
  red: '#DC2626', redLt: '#FCA5A5', redPl: '#FEE2E2',
  gray: '#94A3B8', grayLt: '#CBD5E1',
  wood: '#92400E', woodLt: '#D97706', woodFill: '#B45309',
  yellow: '#FBBF24', green: '#16A34A', orange: '#F97316',
  skin: '#FBBF24', white: '#FFFFFF',
};

const DrawUtils = {
  star(cx_, cy, oR, iR, pts) {
    cx.beginPath();
    for (let i = 0; i < pts * 2; i++) {
      const r = i % 2 === 0 ? oR : iR, a = i * Math.PI / pts - Math.PI / 2;
      const x = cx_ + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      i ? cx.lineTo(x, y) : cx.moveTo(x, y);
    }
    cx.closePath(); cx.stroke();
  },

  roundRect(x, y, w, h, r) {
    cx.moveTo(x + r, y); cx.lineTo(x + w - r, y);
    cx.arcTo(x + w, y, x + w, y + r, r); cx.lineTo(x + w, y + h - r);
    cx.arcTo(x + w, y + h, x + w - r, y + h, r); cx.lineTo(x + r, y + h);
    cx.arcTo(x, y + h, x, y + h - r, r); cx.lineTo(x, y + r);
    cx.arcTo(x, y, x + r, y, r);
  },

  wobble(v, a) { return v + (Math.random() - 0.5) * a; }
};

const Particles = {
  list: [],

  spawn(x, y, col, n, spd) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28, s = (0.5 + Math.random()) * spd;
      this.list.push({
        x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s,
        life: 1, dec: 0.018 + Math.random() * 0.02,
        sz: 2 + Math.random() * 5, col, star: Math.random() > 0.4
      });
    }
  },

  tick() {
    this.list = this.list.filter(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.life -= p.dec;
      return p.life > 0;
    });
  },

  draw() {
    this.list.forEach(p => {
      cx.save(); cx.globalAlpha = p.life; cx.fillStyle = p.col; cx.strokeStyle = K.ink; cx.lineWidth = 1;
      if (p.star) { cx.translate(p.x, p.y); DrawUtils.star(0, 0, p.sz, p.sz * 0.35, 4); }
      else { cx.beginPath(); cx.arc(p.x, p.y, p.sz, 0, 6.28); cx.fill(); cx.stroke(); }
      cx.restore();
    });
  },

  clear() { this.list = []; }
};

const BgDoodles = {
  list: [],

  gen() {
    this.list = [];
    const tp = ['star', 'circle', 'squiggle', 'dots', 'cross'];
    for (let i = 0; i < 18; i++)
      this.list.push({
        x: Math.random() * W, y: Math.random() * H,
        tp: tp[Math.random() * tp.length | 0],
        sz: 3 + Math.random() * 7, rot: Math.random() * 6.28,
        a: 0.04 + Math.random() * 0.05
      });
  },

  draw() {
    this.list.forEach(d => {
      cx.save(); cx.translate(d.x, d.y); cx.rotate(d.rot);
      cx.globalAlpha = d.a; cx.strokeStyle = K.gray; cx.lineWidth = 1;
      switch (d.tp) {
        case 'star': DrawUtils.star(0, 0, d.sz, d.sz * 0.4, 5); break;
        case 'circle': cx.beginPath(); cx.arc(0, 0, d.sz, 0, 6.28); cx.stroke(); break;
        case 'squiggle':
          cx.beginPath();
          for (let i = 0; i < 6; i++) { const sx = (i - 3) * d.sz * 0.6, sy = Math.sin(i * 1.2) * d.sz * 0.5; i ? cx.lineTo(sx, sy) : cx.moveTo(sx, sy); }
          cx.stroke(); break;
        case 'dots':
          for (let i = 0; i < 3; i++) { cx.beginPath(); cx.arc((i - 1) * d.sz, 0, 1.5, 0, 6.28); cx.stroke(); } break;
        case 'cross':
          cx.beginPath(); cx.moveTo(-d.sz, 0); cx.lineTo(d.sz, 0); cx.moveTo(0, -d.sz); cx.lineTo(0, d.sz); cx.stroke(); break;
      }
      cx.restore();
    });
  }
};
