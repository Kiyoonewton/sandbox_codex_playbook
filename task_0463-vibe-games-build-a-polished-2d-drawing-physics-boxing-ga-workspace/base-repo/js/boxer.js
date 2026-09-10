/* ============================================
   DOODLE PUNCH — Boxer Drawing
   Reference-style doodle boxer with animation
   ============================================ */
const BoxerDraw = {
  draw(bx, by, main, lt, pl, faceR, isKO, idleT, cx, K, SC, t, W, H) {
    const s = 48 * SC, dir = faceR ? 1 : -1;
    const lw = 2.5 * SC;

    cx.save(); cx.translate(bx, by);

    if (isKO) {
      cx.rotate(dir * 0.4); cx.translate(0, 18);
    } else if (idleT !== undefined) {
      const bob = Math.sin(idleT * 3.2) * 4 * SC;
      const sway = Math.sin(idleT * 1.9) * 3 * SC;
      cx.translate(sway, bob);
    }

    // Shadow
    cx.fillStyle = 'rgba(0,0,0,.06)';
    cx.beginPath(); cx.ellipse(0, s * 0.88, s * 0.45, s * 0.06, 0, 0, 6.28); cx.fill();

    // Legs
    const legSwing = isKO ? 0 : Math.sin(idleT * 3.2) * 2.5 * SC;
    cx.strokeStyle = K.ink; cx.lineWidth = 3 * SC; cx.lineCap = 'round'; cx.lineJoin = 'round';
    cx.beginPath(); cx.moveTo(-s * 0.08, s * 0.35); cx.lineTo(-s * 0.16, s * 0.72 + legSwing * 0.3); cx.stroke();
    cx.beginPath(); cx.moveTo(s * 0.08, s * 0.35); cx.lineTo(s * 0.16, s * 0.72 - legSwing * 0.3); cx.stroke();
    cx.fillStyle = K.ink;
    cx.beginPath(); cx.ellipse(-s * 0.18, s * 0.75, s * 0.08, s * 0.035, -0.15, 0, 6.28); cx.fill();
    cx.beginPath(); cx.ellipse(s * 0.18, s * 0.75, s * 0.08, s * 0.035, 0.15, 0, 6.28); cx.fill();

    // Body (black tank top)
    cx.fillStyle = K.ink;
    cx.beginPath();
    cx.moveTo(-s * 0.14, s * 0.35);
    cx.lineTo(-s * 0.16, s * 0.15);
    cx.quadraticCurveTo(-s * 0.18, -s * 0.02, -s * 0.14, -s * 0.08);
    cx.lineTo(s * 0.14, -s * 0.08);
    cx.quadraticCurveTo(s * 0.18, -s * 0.02, s * 0.16, s * 0.15);
    cx.lineTo(s * 0.14, s * 0.35);
    cx.closePath(); cx.fill();
    cx.strokeStyle = K.ink; cx.lineWidth = lw; cx.stroke();

    // Shorts
    cx.fillStyle = main;
    cx.beginPath();
    cx.moveTo(-s * 0.16, s * 0.30); cx.lineTo(-s * 0.18, s * 0.42);
    cx.lineTo(-s * 0.04, s * 0.40); cx.lineTo(0, s * 0.44);
    cx.lineTo(s * 0.04, s * 0.40); cx.lineTo(s * 0.18, s * 0.42);
    cx.lineTo(s * 0.16, s * 0.30); cx.closePath();
    cx.fill(); cx.strokeStyle = K.ink; cx.lineWidth = lw; cx.stroke();
    cx.strokeStyle = K.ink + '60'; cx.lineWidth = 1.2 * SC;
    cx.beginPath(); cx.moveTo(-s * 0.12, s * 0.36); cx.lineTo(s * 0.12, s * 0.36); cx.stroke();

    // Back arm + glove
    const armBob = isKO ? 0 : Math.sin(idleT * 3.2 + 1) * 5 * SC;
    const bax = -dir * s * 0.18, bex = -dir * s * 0.52, bey = -s * 0.08 + armBob;
    cx.strokeStyle = K.ink; cx.lineWidth = 3 * SC; cx.lineCap = 'round';
    cx.beginPath(); cx.moveTo(bax, -s * 0.04);
    cx.quadraticCurveTo(bax - dir * s * 0.2, -s * 0.18 + armBob * 0.4, bex, bey);
    cx.stroke();
    cx.fillStyle = main; cx.strokeStyle = K.ink; cx.lineWidth = lw;
    cx.beginPath(); cx.arc(bex, bey, s * 0.13, 0, 6.28); cx.fill(); cx.stroke();
    cx.fillStyle = lt;
    cx.beginPath(); cx.arc(bex - dir * s * 0.02, bey - s * 0.03, s * 0.045, 0, 6.28); cx.fill();

    // Head (white round)
    const headY = -s * 0.32, headR = s * 0.22;
    cx.fillStyle = '#FFFFFF'; cx.strokeStyle = K.ink; cx.lineWidth = lw + 1;
    cx.beginPath(); cx.arc(0, headY, headR, 0, 6.28); cx.fill(); cx.stroke();

    if (isKO) {
      cx.strokeStyle = K.ink; cx.lineWidth = 2.2 * SC;
      [-1, 1].forEach(ox => {
        const ex = ox * s * 0.07, ey = headY - s * 0.01, es = 4 * SC;
        cx.beginPath(); cx.moveTo(ex - es, ey - es); cx.lineTo(ex + es, ey + es); cx.stroke();
        cx.beginPath(); cx.moveTo(ex + es, ey - es); cx.lineTo(ex - es, ey + es); cx.stroke();
      });
      cx.strokeStyle = K.yellow; cx.lineWidth = 1.5 * SC;
      for (let i = 0; i < 3; i++) {
        const a = t * 3 + i * 2.09, r2 = s * 0.38;
        DrawUtils.star(cx, Math.cos(a) * r2, headY - s * 0.28 + Math.sin(a) * 6, 4, 1.5, 4);
      }
    } else {
      // Angry eyebrows
      cx.strokeStyle = K.ink; cx.lineWidth = 2.2 * SC; cx.lineCap = 'round';
      cx.beginPath(); cx.moveTo(-s * 0.11, headY - s * 0.08); cx.lineTo(-s * 0.04, headY - s * 0.04); cx.stroke();
      cx.beginPath(); cx.moveTo(s * 0.11, headY - s * 0.08); cx.lineTo(s * 0.04, headY - s * 0.04); cx.stroke();
      // Eyes
      cx.fillStyle = K.ink;
      const blink = Math.sin(idleT * 0.7) > 0.97;
      if (blink) {
        cx.lineWidth = 2 * SC;
        [-1, 1].forEach(ox => {
          cx.beginPath(); cx.moveTo(ox * s * 0.08 - 3, headY); cx.lineTo(ox * s * 0.08 + 3, headY); cx.stroke();
        });
      } else {
        [-1, 1].forEach(ox => {
          cx.beginPath(); cx.arc(ox * s * 0.07, headY + s * 0.01, 2.5 * SC, 0, 6.28); cx.fill();
        });
      }
      // Frowning mouth
      cx.strokeStyle = K.ink; cx.lineWidth = 2 * SC; cx.lineCap = 'round';
      cx.beginPath(); cx.arc(0, headY + s * 0.09, s * 0.035, Math.PI + 0.3, -0.3); cx.stroke();
    }

    // Headband
    const bandY = headY + s * 0.08;
    cx.fillStyle = main; cx.strokeStyle = K.ink; cx.lineWidth = lw;
    cx.beginPath(); cx.ellipse(0, bandY - headY + s * 0.02, s * 0.19, s * 0.035, 0, 0, 6.28); cx.fill(); cx.stroke();
    cx.beginPath(); cx.ellipse(0, bandY + s * 0.03, s * 0.18, s * 0.028, 0, 0, 6.28); cx.stroke();
    const tailWave = isKO ? 0 : Math.sin(idleT * 2) * 3 * SC;
    cx.strokeStyle = main; cx.lineWidth = 3 * SC; cx.lineCap = 'round';
    cx.beginPath(); cx.moveTo(-dir * s * 0.17, bandY);
    cx.quadraticCurveTo(-dir * s * 0.28, bandY + tailWave, -dir * s * 0.38, bandY + s * 0.06 + tailWave); cx.stroke();
    cx.strokeStyle = K.ink; cx.lineWidth = lw;
    cx.beginPath(); cx.moveTo(-dir * s * 0.17, bandY);
    cx.quadraticCurveTo(-dir * s * 0.28, bandY + tailWave, -dir * s * 0.38, bandY + s * 0.06 + tailWave); cx.stroke();
    cx.strokeStyle = main; cx.lineWidth = 2.5 * SC;
    cx.beginPath(); cx.moveTo(-dir * s * 0.16, bandY + s * 0.02);
    cx.quadraticCurveTo(-dir * s * 0.24, bandY + s * 0.06 + tailWave * 0.7, -dir * s * 0.32, bandY + s * 0.12 + tailWave * 0.7); cx.stroke();
    cx.strokeStyle = K.ink; cx.lineWidth = lw * 0.8;
    cx.beginPath(); cx.moveTo(-dir * s * 0.16, bandY + s * 0.02);
    cx.quadraticCurveTo(-dir * s * 0.24, bandY + s * 0.06 + tailWave * 0.7, -dir * s * 0.32, bandY + s * 0.12 + tailWave * 0.7); cx.stroke();

    // Front arm + glove
    const gloveBob = isKO ? 0 : Math.sin(idleT * 3.2 + 2) * 3.5 * SC;
    const fax = dir * s * 0.14, fex = dir * s * 0.48, fey = -s * 0.14 + gloveBob;
    cx.strokeStyle = K.ink; cx.lineWidth = 3 * SC; cx.lineCap = 'round';
    cx.beginPath(); cx.moveTo(fax, -s * 0.04);
    cx.quadraticCurveTo(fax + dir * s * 0.18, -s * 0.18 + gloveBob * 0.5, fex, fey); cx.stroke();
    cx.fillStyle = main; cx.strokeStyle = K.ink; cx.lineWidth = lw;
    cx.beginPath(); cx.arc(fex, fey, s * 0.14, 0, 6.28); cx.fill(); cx.stroke();
    cx.fillStyle = lt;
    cx.beginPath(); cx.arc(fex - dir * s * 0.02, fey - s * 0.03, s * 0.05, 0, 6.28); cx.fill();

    cx.restore();
    const gOff = isKO ? 0 : Math.sin(idleT * 3.2 + 2) * 3.5 * SC;
    return { x: bx + dir * s * 0.48, y: by - s * 0.14 + gOff };
  }
};
