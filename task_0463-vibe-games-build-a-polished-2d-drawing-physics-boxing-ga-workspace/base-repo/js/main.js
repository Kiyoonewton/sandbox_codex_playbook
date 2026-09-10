/* ============================================
   DOODLE PUNCH — Main Game Loop
   Infinite procedural levels, rendering, input
   ============================================ */
const cv = document.getElementById('c');
const cx = cv.getContext('2d');
let W, H, SC;

function resize() {
  const d = devicePixelRatio || 1;
  W = innerWidth; H = innerHeight;
  cv.width = W * d; cv.height = H * d;
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  cx.setTransform(d, 0, 0, d, 0, 0);
  SC = Math.min(W / 1200, H / 700);
  BgDoodles.gen();
}
addEventListener('resize', resize);
resize();

// Keyboard
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    if (GameState.state === ST.PAUSE) GameState.pause();
    else if (GameState.state === ST.DRAW || GameState.state === ST.PUNCH) GameState.pause();
  }
  if ((e.key === 'r' || e.key === 'R') && (GameState.state === ST.DRAW || GameState.state === ST.PUNCH || GameState.state === ST.LOSE))
    GameState.retry();
});

// Pointer input
function pPos(e) { const r = cv.getBoundingClientRect(); const ev = e.touches ? e.touches[0] : e; return { x: ev.clientX - r.left, y: ev.clientY - r.top }; }
function onD(e) { e.preventDefault(); Audio.init(); if (GameState.state !== ST.DRAW) return; GameState.isDrawing = true; GameState.rawPath = [pPos(e)]; }
function onM(e) { e.preventDefault(); if (!GameState.isDrawing || GameState.state !== ST.DRAW) return; const p = pPos(e), l = GameState.rawPath[GameState.rawPath.length - 1]; if (Math.hypot(p.x - l.x, p.y - l.y) > 5) { GameState.rawPath.push(p); Audio.play('draw'); } }
function onU(e) { e.preventDefault(); if (!GameState.isDrawing || GameState.state !== ST.DRAW) return; GameState.isDrawing = false; if (GameState.rawPath.length >= 3) GameState.launch(); else GameState.rawPath = []; }
cv.addEventListener('mousedown', onD); cv.addEventListener('mousemove', onM); cv.addEventListener('mouseup', onU); cv.addEventListener('mouseleave', onU);
cv.addEventListener('touchstart', onD, { passive: false }); cv.addEventListener('touchmove', onM, { passive: false }); cv.addEventListener('touchend', onU, { passive: false });

// Draw plank
function drawPlank(p) {
  const a = Collide.plankAABB(p, GameState.t, W, H);
  cx.fillStyle = K.woodFill;
  cx.beginPath(); DrawUtils.roundRect(a.x, a.y, a.w, a.h, 4); cx.fill();
  cx.strokeStyle = K.wood; cx.lineWidth = 2.5;
  cx.beginPath(); DrawUtils.roundRect(a.x, a.y, a.w, a.h, 4); cx.stroke();
  cx.strokeStyle = K.wood + '30'; cx.lineWidth = 1;
  const gc = Math.max(2, a.h / 18 | 0);
  for (let i = 1; i < gc; i++) {
    const gy = a.y + a.h * i / gc;
    cx.beginPath();
    cx.moveTo(a.x + 4, DrawUtils.wobble(gy, 3));
    cx.bezierCurveTo(a.x + a.w * 0.3, DrawUtils.wobble(gy, 4), a.x + a.w * 0.7, DrawUtils.wobble(gy, 4), a.x + a.w - 4, DrawUtils.wobble(gy, 3));
    cx.stroke();
  }
  cx.fillStyle = K.ink + '40';
  [[a.x + 6, a.y + 6], [a.x + a.w - 6, a.y + 6], [a.x + 6, a.y + a.h - 6], [a.x + a.w - 6, a.y + a.h - 6]].forEach(([nx, ny]) => {
    cx.beginPath(); cx.arc(nx, ny, 2, 0, 6.28); cx.fill();
  });
  // Moving indicator
  if (p.move) {
    cx.save();
    cx.globalAlpha = 0.25 + Math.sin(GameState.t * 3) * 0.15;
    cx.fillStyle = K.ink; cx.font = `${12 * SC}px Patrick Hand`; cx.textAlign = 'center';
    cx.fillText(p.move === 'y' ? '↕' : '↔', a.x + a.w / 2, a.y - 6);
    cx.restore();
  }
}

// Draw raw path
function drawRawPath() {
  if (GameState.rawPath.length < 2) return;
  cx.save();
  cx.strokeStyle = K.blue; cx.lineWidth = 4 * SC; cx.lineCap = 'round'; cx.lineJoin = 'round';
  cx.beginPath(); cx.moveTo(GameState.rawPath[0].x, GameState.rawPath[0].y);
  for (let i = 1; i < GameState.rawPath.length; i++) cx.lineTo(GameState.rawPath[i].x, GameState.rawPath[i].y);
  cx.stroke();
  cx.strokeStyle = K.blueLt; cx.lineWidth = 1.5 * SC; cx.globalAlpha = 0.35;
  cx.beginPath(); cx.moveTo(GameState.rawPath[0].x + 2, GameState.rawPath[0].y - 2);
  for (let i = 1; i < GameState.rawPath.length; i++) cx.lineTo(GameState.rawPath[i].x + 2, GameState.rawPath[i].y - 2);
  cx.stroke(); cx.restore();
}

// Draw travelling glove
function drawGlove() {
  if (GameState.smoothPath.length < 2) return;
  const pos = PathSys.point(GameState.smoothPath, GameState.punchT);
  const gr = 20 * SC;
  const back = PathSys.point(GameState.smoothPath, Math.max(0, GameState.punchT - 0.06));
  // Arm
  cx.strokeStyle = '#DEB887'; cx.lineWidth = 7 * SC; cx.lineCap = 'round';
  cx.beginPath(); cx.moveTo(back.x, back.y); cx.lineTo(pos.x, pos.y); cx.stroke();
  // Glove
  cx.fillStyle = K.blue; cx.strokeStyle = K.ink; cx.lineWidth = 2.5;
  cx.beginPath(); cx.arc(pos.x, pos.y, gr, 0, 6.28); cx.fill(); cx.stroke();
  cx.fillStyle = K.blueLt;
  cx.beginPath(); cx.arc(pos.x - 3, pos.y - 4, gr * 0.33, 0, 6.28); cx.fill();
  // Speed lines
  cx.save(); cx.strokeStyle = K.gray; cx.lineWidth = 1.5; cx.globalAlpha = 0.35;
  for (let i = 0; i < 4; i++) {
    const off = 0.008 + i * 0.012;
    const bp = PathSys.point(GameState.smoothPath, Math.max(0, GameState.punchT - off));
    const side = (i - 1.5) * 9;
    cx.beginPath(); cx.moveTo(bp.x + side, bp.y + side * 0.5);
    cx.lineTo(bp.x + side * 3.5, bp.y + side * 1.8); cx.stroke();
  }
  cx.restore();
  // Trail
  cx.save(); cx.strokeStyle = K.bluePl; cx.lineWidth = 3 * SC; cx.lineCap = 'round'; cx.setLineDash([6, 4]);
  const end = Math.min(Math.floor(GameState.punchT * GameState.smoothPath.length) + 2, GameState.smoothPath.length);
  cx.beginPath(); cx.moveTo(GameState.smoothPath[0].x, GameState.smoothPath[0].y);
  for (let i = 1; i < end; i++) cx.lineTo(GameState.smoothPath[i].x, GameState.smoothPath[i].y);
  cx.stroke(); cx.setLineDash([]); cx.restore();
}

// Draw pulse on glove when idle
function drawPulse(x, y) {
  const p = Math.sin(GameState.t * 4) * 0.3 + 0.7;
  cx.save(); cx.globalAlpha = p; cx.strokeStyle = K.blue; cx.lineWidth = 2;
  cx.beginPath(); cx.arc(x, y, 28 * SC, 0, 6.28); cx.stroke();
  cx.beginPath(); cx.arc(x, y, 34 * SC, 0, 6.28); cx.stroke();
  cx.fillStyle = K.blue;
  cx.font = `${17 * SC}px 'Patrick Hand',cursive`;
  cx.textAlign = 'center'; cx.textBaseline = 'bottom';
  cx.fillText('← draw from here!', x, y - 40 * SC);
  cx.restore();
}

// Draw HUD
function drawHUD() {
  if (GameState.state === ST.TITLE) return;
  cx.save();
  // Level badge
  cx.font = `${22 * SC}px 'Permanent Marker',cursive`;
  const txt = 'LEVEL ' + GameState.lvl;
  const tw = cx.measureText(txt).width;
  const bw = tw + 24, bh = 32 * SC, bx = 12, by = 12;
  cx.fillStyle = K.blue; cx.strokeStyle = K.ink; cx.lineWidth = 2.5;
  cx.beginPath(); DrawUtils.roundRect(bx, by, bw, bh, 8); cx.fill(); cx.stroke();
  cx.fillStyle = K.white; cx.textAlign = 'center'; cx.textBaseline = 'middle';
  cx.fillText(txt, bx + bw / 2, by + bh / 2);

  // Best level badge
  if (GameState.maxLvl > 1) {
    cx.font = `${16 * SC}px 'Patrick Hand',cursive`;
    const bestTxt = '🏆 Best: ' + GameState.maxLvl;
    const btw = cx.measureText(bestTxt).width;
    cx.fillStyle = K.yellow; cx.strokeStyle = K.ink; cx.lineWidth = 1.5;
    cx.beginPath(); DrawUtils.roundRect(bx, by + bh + 6, btw + 16, 22 * SC, 6); cx.fill(); cx.stroke();
    cx.fillStyle = K.ink; cx.textAlign = 'left'; cx.textBaseline = 'middle';
    cx.fillText(bestTxt, bx + 8, by + bh + 6 + 11 * SC);
  }

  // Hint
  if (GameState.state === ST.DRAW && !GameState.isDrawing && GameState.rawPath.length === 0) {
    cx.font = `${18 * SC}px 'Patrick Hand',cursive`;
    cx.fillStyle = K.gray; cx.textAlign = 'center'; cx.textBaseline = 'bottom';
    cx.fillText('✏️ ' + GameState.currentHint, W / 2, H - 18);
  }
  cx.restore();
}

// Title screen doodle boxers
function drawTitleDoodles() {
  const bob = Math.sin(GameState.t * 2) * 6;
  cx.save(); cx.translate(W * 0.2, H * 0.58 + bob); cx.globalAlpha = 0.12;
  BoxerDraw.draw(0, 0, K.blue, K.blueLt, K.bluePl, true, false, GameState.t, cx, K, SC, GameState.t, W, H);
  cx.restore();
  cx.save(); cx.translate(W * 0.8, H * 0.58 - bob); cx.globalAlpha = 0.12; cx.scale(-1, 1);
  BoxerDraw.draw(0, 0, K.red, K.redLt, K.redPl, true, false, GameState.t, cx, K, SC, GameState.t, W, H);
  cx.restore();
}

// Main game loop
function loop(ts) {
  const dt = Math.min((ts - GameState.lastTS) / 1000, 0.05);
  GameState.lastTS = ts; GameState.t += dt;

  let sx = 0, sy = 0;
  if (GameState.shakeT > 0) {
    GameState.shakeT -= dt;
    const f = GameState.shakeT / 0.4;
    sx = (Math.random() - 0.5) * GameState.shakeI * f;
    sy = (Math.random() - 0.5) * GameState.shakeI * f;
  }

  cx.save(); cx.translate(sx, sy);

  // Background
  cx.fillStyle = K.paper; cx.fillRect(0, 0, W, H);
  cx.strokeStyle = K.grid; cx.lineWidth = 0.5;
  for (let x = 0; x < W; x += 28) { cx.beginPath(); cx.moveTo(x, 0); cx.lineTo(x, H); cx.stroke(); }
  for (let y = 0; y < H; y += 28) { cx.beginPath(); cx.moveTo(0, y); cx.lineTo(W, y); cx.stroke(); }
  BgDoodles.draw();

  if (GameState.state === ST.TITLE) {
    drawTitleDoodles(); cx.restore(); requestAnimationFrame(loop); return;
  }

  // Planks
  GameState.planks.forEach(drawPlank);

  // Boxers
  let gStart = null;
  if (GameState.blueB)
    gStart = BoxerDraw.draw(
      GameState.blueB.x * W, GameState.blueB.y * H,
      K.blue, K.blueLt, K.bluePl, true, false, GameState.t,
      cx, K, SC, GameState.t, W, H
    );
  if (GameState.redB)
    BoxerDraw.draw(
      GameState.redB.x * W, GameState.redB.y * H,
      K.red, K.redLt, K.redPl, false,
      GameState.state === ST.WIN || GameState.state === ST.VICTORY,
      GameState.t, cx, K, SC, GameState.t, W, H
    );

  // Drawing
  if (GameState.state === ST.DRAW) {
    drawRawPath();
    if (!GameState.isDrawing && GameState.rawPath.length === 0 && gStart)
      drawPulse(gStart.x, gStart.y);
  }

  // Punching
  if (GameState.state === ST.PUNCH) {
    GameState.punchT += 0.022;
    // Check moving plank collision during flight
    const cur = PathSys.point(GameState.smoothPath, GameState.punchT);
    const pk = Collide.gloveHitsAnyPlank(cur.x, cur.y, 14 * SC, GameState.planks, GameState.t, W, H);
    if (pk.hit) {
      GameState.blocked(cur.x, cur.y, 'plank');
    }
    if (GameState.punchT >= 0.92) {
      const end = PathSys.point(GameState.smoothPath, 1);
      if (Collide.gloveHitsRed(end.x, end.y, GameState.redB, SC)) {
        GameState.punchDone();
      } else if (GameState.punchT >= 1) {
        GameState.blocked(end.x, end.y, 'miss');
      }
    }
    if (GameState.state === ST.PUNCH) drawGlove();
  }

  Particles.tick(); Particles.draw(); drawHUD();
  cx.restore();
  requestAnimationFrame(loop);
}

// Init
GameState.lastTS = performance.now();
requestAnimationFrame(loop);
