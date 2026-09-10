/* ============================================
   DOODLE PUNCH — Collision Detection
   Segment vs AABB, path vs planks
   ============================================ */
const Collide = {
  segSeg(ax, ay, bx, by, cx_, cy, dx, dy) {
    const d = (bx - ax) * (dy - cy) - (by - ay) * (dx - cx_);
    if (Math.abs(d) < 1e-6) return false;
    const t = ((cx_ - ax) * (dy - cy) - (cy - ay) * (dx - cx_)) / d;
    const u = ((cx_ - ax) * (by - ay) - (cy - ay) * (bx - ax)) / d;
    return t >= 0 && t <= 1 && u >= 0 && u <= 1;
  },

  segRect(x1, y1, x2, y2, rx, ry, rw, rh) {
    const pad = 4;
    if (Math.min(x1, x2) > rx + rw + pad || Math.max(x1, x2) < rx - pad ||
        Math.min(y1, y2) > ry + rh + pad || Math.max(y1, y2) < ry - pad) return false;
    if (x1 >= rx - pad && x1 <= rx + rw + pad && y1 >= ry - pad && y1 <= ry + rh + pad) return true;
    if (x2 >= rx - pad && x2 <= rx + rw + pad && y2 >= ry - pad && y2 <= ry + rh + pad) return true;
    const e = [
      [rx - pad, ry - pad, rx + rw + pad, ry - pad],
      [rx + rw + pad, ry - pad, rx + rw + pad, ry + rh + pad],
      [rx + rw + pad, ry + rh + pad, rx - pad, ry + rh + pad],
      [rx - pad, ry + rh + pad, rx - pad, ry - pad]
    ];
    for (const [a, b, c, d] of e) if (this.segSeg(x1, y1, x2, y2, a, b, c, d)) return true;
    return false;
  },

  pathHitsAnyPlank(path, planks, time, W, H) {
    for (const p of planks) {
      const a = this.plankAABB(p, time, W, H);
      for (let i = 1; i < path.length; i++) {
        if (this.segRect(path[i - 1].x, path[i - 1].y, path[i].x, path[i].y, a.x, a.y, a.w, a.h))
          return { hit: true, plank: p };
      }
    }
    return { hit: false };
  },

  gloveHitsAnyPlank(gx, gy, r, planks, time, W, H) {
    for (const p of planks) {
      const a = this.plankAABB(p, time, W, H);
      const cx_ = Math.max(a.x, Math.min(gx, a.x + a.w));
      const cy = Math.max(a.y, Math.min(gy, a.y + a.h));
      if (Math.hypot(gx - cx_, gy - cy) < r) return { hit: true, plank: p };
    }
    return { hit: false };
  },

  plankAABB(p, time, W, H) {
    let px = p.baseX, py = p.baseY;
    const phase = p.phase || 0;
    if (p.move === 'x') px = p.baseX + Math.sin(time * p.speed + phase) * p.range;
    else if (p.move === 'y') py = p.baseY + Math.sin(time * p.speed + phase) * p.range;
    return { x: px * W - p.w * W / 2, y: py * H - p.h * H / 2, w: p.w * W, h: p.h * H };
  },

  gloveHitsRed(gx, gy, redB, SC) {
    if (!redB) return false;
    return Math.hypot(gx - redB.x * W, gy - redB.y * H) < 42 * SC;
  }
};
