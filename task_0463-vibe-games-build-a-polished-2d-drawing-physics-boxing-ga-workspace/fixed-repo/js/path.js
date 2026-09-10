/* ============================================
   DOODLE PUNCH — Path System
   Catmull-Rom smoothing, path interpolation
   ============================================ */
const PathSys = {
  smooth(pts) {
    if (pts.length < 2) return pts.slice();
    const r = [pts[0]];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i];
      const p2 = pts[Math.min(pts.length - 1, i + 1)], p3 = pts[Math.min(pts.length - 1, i + 2)];
      for (let s = 1; s <= 8; s++) {
        const u = s / 8, u2 = u * u, u3 = u2 * u;
        r.push({
          x: .5 * ((2 * p1.x) + (-p0.x + p2.x) * u + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * u2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * u3),
          y: .5 * ((2 * p1.y) + (-p0.y + p2.y) * u + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * u2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * u3)
        });
      }
    }
    return r;
  },

  length(p) {
    let l = 0;
    for (let i = 1; i < p.length; i++) l += Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
    return l;
  },

  point(p, t) {
    if (p.length < 2) return p[0] || { x: 0, y: 0 };
    const tl = this.length(p), td = t * tl;
    let a = 0;
    for (let i = 1; i < p.length; i++) {
      const sl = Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y);
      if (a + sl >= td) {
        const s = (td - a) / sl;
        return { x: p[i - 1].x + (p[i].x - p[i - 1].x) * s, y: p[i - 1].y + (p[i].y - p[i - 1].y) * s };
      }
      a += sl;
    }
    return p[p.length - 1];
  }
};
