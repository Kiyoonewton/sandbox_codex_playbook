/* ============================================
   DOODLE PUNCH — Procedural Level Generator
   Infinite levels with guaranteed solvability.
   Algorithm: build a clear path FIRST, then
   place planks in the remaining space.
   ============================================ */
const LevelGen = {
  // Seeded random for reproducibility
  _seed: 1,
  _rand() { this._seed = (this._seed * 16807 + 0) % 2147483647; return (this._seed - 1) / 2147483646; },
  _randRange(a, b) { return a + this._rand() * (b - a); },

  generate(levelNum) {
    this._seed = levelNum * 7919 + 1301; // unique seed per level

    // ── Boxer positions (fixed left/right) ──
    const blue = { x: 0.12, y: 0.50 + this._randRange(-0.08, 0.08) };
    const red  = { x: 0.88, y: 0.50 + this._randRange(-0.08, 0.08) };

    // ── Generate a guaranteed-clear path ──
    // The path is a gentle curve from blue to red
    const pathY = (blue.y + red.y) / 2;
    const waypoints = this._makeClearPath(blue, red, pathY, levelNum);

    // ── Difficulty parameters ──
    const difficulty = Math.min(levelNum, 30); // caps at 30
    const numPlanks = Math.min(2 + Math.floor(difficulty * 0.6), 12);
    const isMoving = levelNum >= 2;
    // Bob speed increases with level — noticeably faster by mid-game
    const moveSpeed = isMoving ? 1.0 + difficulty * 0.18 : 0;

    // ── Place planks avoiding the clear path ──
    const planks = this._placePlanks(numPlanks, waypoints, isMoving, moveSpeed, difficulty, levelNum);

    // ── Post-validate: remove any plank that intersects the smoothed clear path ──
    const validPlanks = this._validatePlanks(planks, waypoints);

    // ── Hint text ──
    const hint = isMoving
      ? `Level ${levelNum} — Time your draw! Planks are bobbing up & down.`
      : `Level ${levelNum} — Draw a clear path!`;

    return { blue, red, planks: validPlanks, hint };
  },

  // Build a clear path from blue to red (series of waypoints)
  _makeClearPath(blue, red, pathY, levelNum) {
    const pts = [];
    const steps = 5;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = blue.x + (red.x - blue.x) * t;
      let y = blue.y + (red.y - blue.y) * t;
      // Add gentle wave to make it interesting
      const wave = Math.sin(t * Math.PI * 2) * 0.04 * Math.min(levelNum * 0.1, 1);
      y += wave;
      pts.push({ x, y });
    }
    return pts;
  },

  // Place planks that don't intersect the clear path
  _placePlanks(count, path, isMoving, baseSpeed, difficulty, levelNum) {
    const planks = [];
    const pathWidth = 0.15; // clearance around path (in normalized coords) — accounts for Catmull-Rom overshoot

    // Divide play area into columns
    const colStart = 0.25;
    const colEnd = 0.75;
    const colWidth = (colEnd - colStart) / Math.max(count, 1);

    for (let i = 0; i < count && planks.length < count; i++) {
      // Target column
      const colCenter = colStart + colWidth * (i + 0.5);

      // Find clear Y positions (not on the path)
      const clearZones = this._findClearZones(colCenter, path, pathWidth);

      if (clearZones.length === 0) continue;

      // Pick a random clear zone
      const zone = clearZones[Math.floor(this._rand() * clearZones.length)];

      // Plank dimensions — slightly taller planks at higher levels
      // But never taller than what the zone can fit (zone height minus clearance)
      const maxPh = Math.max(0.10, (zone.max - zone.min) - 0.08);
      const pw = this._randRange(0.035, 0.055);
      const ph = Math.min(this._randRange(0.12, 0.25 + difficulty * 0.01), maxPh);

      // Plank Y position (center of clear zone, clamped)
      let py = this._randRange(zone.min + ph / 2 + 0.02, zone.max - ph / 2 - 0.02);
      py = Math.max(ph / 2 + 0.02, Math.min(1 - ph / 2 - 0.02, py));

      // ── ALL planks move vertically (bob up/down) from level 2 onward ──
      let move = null, range = 0, speed = 0, phase = 0;
      if (isMoving) {
        move = 'y';
        // Range scales with difficulty: 0.04 at level 2, up to ~0.16 at level 30
        range = this._randRange(0.04, 0.06 + difficulty * 0.004);
        // Speed scales with difficulty: faster as levels rise
        speed = baseSpeed + this._randRange(-0.2, 0.2);
        // Random phase offset (0–2π) so planks DON'T bob in sync
        phase = this._randRange(0, 6.2832);
        // Ensure moving plank stays within clear zone at all extremes
        const minY = py - range, maxY = py + range;
        if (minY < zone.min + ph / 2 || maxY > zone.max - ph / 2) {
          range = Math.min(range, Math.min(py - zone.min - ph / 2 - 0.01, zone.max - py - ph / 2 - 0.01));
          if (range < 0.015) range = 0.015; // always have at least some motion
        }
      }

      planks.push({ x: colCenter, y: py, w: pw, h: ph, move, range, speed, phase });
    }

    return planks;
  },

  // Find vertical zones where the path doesn't pass through
  _findClearZones(colX, path, pathWidth) {
    // Sample the path Y at this column X
    const pathYAtCol = this._samplePathY(colX, path);

    // The "danger zone" is pathY ± pathWidth
    const dangerTop = pathYAtCol - pathWidth;
    const dangerBot = pathYAtCol + pathWidth;

    const zones = [];

    // Zone above danger
    if (dangerTop > 0.05) {
      zones.push({ min: 0.05, max: dangerTop });
    }
    // Zone below danger
    if (dangerBot < 0.95) {
      zones.push({ min: dangerBot, max: 0.95 });
    }

    return zones.filter(z => z.max - z.min > 0.1); // only zones big enough for planks
  },

  // Sample path Y at a given X position (linear interpolation)
  _samplePathY(targetX, path) {
    for (let i = 0; i < path.length - 1; i++) {
      if (targetX >= path[i].x && targetX <= path[i + 1].x) {
        const t = (targetX - path[i].x) / (path[i + 1].x - path[i].x || 0.001);
        return path[i].y + (path[i + 1].y - path[i].y) * t;
      }
    }
    return (path[0].y + path[path.length - 1].y) / 2;
  },

  // Validate planks against the Catmull-Rom smoothed clear path
  // Remove any plank whose AABB intersects the smoothed path
  _validatePlanks(planks, waypoints) {
    // Convert waypoints to screen coords for smoothing (use 1280x720 as reference)
    const refW = 1280, refH = 720;
    const screenPts = waypoints.map(p => ({ x: p.x * refW, y: p.y * refH }));

    // Smooth using Catmull-Rom (same as PathSys.smooth but inline)
    const smooth = this._smoothPath(screenPts);

    return planks.filter(p => {
      const px = p.x * refW, py = p.y * refH;
      const hw = p.w * refW / 2, hh = p.h * refH / 2;
      // Check each smoothed segment against this plank's AABB (with extra margin)
      const pad = 8;
      for (let i = 1; i < smooth.length; i++) {
        const x1 = smooth[i - 1].x, y1 = smooth[i - 1].y;
        const x2 = smooth[i].x, y2 = smooth[i].y;
        // Quick AABB rejection
        if (Math.max(x1, x2) < px - hw - pad || Math.min(x1, x2) > px + hw + pad) continue;
        if (Math.max(y1, y2) < py - hh - pad || Math.min(y1, y2) > py + hh + pad) continue;
        // Segment-rect intersection
        if (this._segRect(x1, y1, x2, y2, px - hw - pad, py - hh - pad, hw * 2 + pad * 2, hh * 2 + pad * 2))
          return false; // remove this plank
      }
      return true; // keep this plank
    });
  },

  // Inline Catmull-Rom smooth (mirrors PathSys.smooth)
  _smoothPath(pts) {
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

  // Segment-rect intersection
  _segRect(x1, y1, x2, y2, rx, ry, rw, rh) {
    if (x1 >= rx && x1 <= rx + rw && y1 >= ry && y1 <= ry + rh) return true;
    if (x2 >= rx && x2 <= rx + rw && y2 >= ry && y2 <= ry + rh) return true;
    const edges = [
      [rx, ry, rx + rw, ry], [rx + rw, ry, rx + rw, ry + rh],
      [rx + rw, ry + rh, rx, ry + rh], [rx, ry + rh, rx, ry]
    ];
    for (const [ax, ay, bx, by] of edges) {
      const d = (bx - ax) * (y2 - y1) - (by - ay) * (x2 - x1);
      if (Math.abs(d) < 1e-6) continue;
      const t = ((x1 - ax) * (y2 - y1) - (y1 - ay) * (x2 - x1)) / d;
      const u = ((x1 - ax) * (by - ay) - (y1 - ay) * (bx - ax)) / d;
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1) return true;
    }
    return false;
  }
};
