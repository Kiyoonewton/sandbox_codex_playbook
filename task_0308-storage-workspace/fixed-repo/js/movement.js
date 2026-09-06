// ---------------- movement & collision ----------------
const blockers = [
  { x: -2.7, z: -4.9, w: 10.0, d: 1.8 }, // back counter row (chop → plate)
  { x: 4.0, z: -4.9, w: 3.4, d: 1.7 }, // plate station (right side of back counter)
  { x: 0.5, z: 4.9, w: 9.8, d: 1.8 }, // front row (serve → trash)
  { x: -7.9, z: -1.65, w: 2.1, d: 5.6 }, // left bins column
  { x: 7.9, z: 0.1, w: 2.1, d: 9.2 }, // right bins column
];
const BOUNDS = { x1: -8.7, x2: 8.7, z1: -5.3, z2: 5.4 };
function collide(px, pz, r) {
  px = clamp(px, BOUNDS.x1, BOUNDS.x2);
  pz = clamp(pz, BOUNDS.z1, BOUNDS.z2);
  blockers.forEach((b) => {
    const hw = b.w / 2 + r,
      hd = b.d / 2 + r;
    const dx = px - b.x,
      dz = pz - b.z;
    if (Math.abs(dx) < hw && Math.abs(dz) < hd) {
      const ox = hw - Math.abs(dx),
        oz = hd - Math.abs(dz);
      if (ox < oz) px = b.x + Math.sign(dx) * hw;
      else pz = b.z + Math.sign(dz) * hd;
    }
  });
  return [px, pz];
}
