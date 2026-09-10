const { test, expect } = require('@playwright/test');
const fixture = require('./seed_fixtures.js');
const APP_URL = process.env.APP_URL;
async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(600);
}

// ── helpers ────────────────────────────────────────────────────────────────
async function waitReady(page) {
  await page.locator('#d-triangles').first().waitFor({ timeout: 15000 });
  await page.locator('#d-surfaces').first().waitFor({ timeout: 15000 });
  await page.waitForFunction(() => {
    const el = document.getElementById('d-triangles');
    return !!el && /[0-9]/.test(el.textContent || '');
  }, null, { timeout: 20000 });
  await page.evaluate(() => {
    try { localStorage.setItem('mhd_visited', '1'); } catch (e) {}
    const t = document.getElementById('tutorial-overlay');
    if (t) t.style.display = 'none';
    const l = document.getElementById('loading');
    if (l) l.style.display = 'none';
    const k = document.getElementById('keyboard-help');
    if (k) k.style.display = 'none';
  });
}

async function readNum(page, sel) {
  const txt = (await page.locator(sel).first().innerText({ timeout: 10000 })).trim();
  const digits = txt.replace(/[^0-9.]/g, '');
  return digits === '' ? NaN : parseFloat(digits);
}

// Drives the app to a given plasma configuration. Slider input alone does not
// rebuild the rational-surface markers, so we push an extra undo checkpoint and
// undo it: undo() restores the checkpointed (q0, qedge, lines) state and
// rebuilds both the field lines and the rational-surface markers.
async function applyConfig(page, cfg) {
  await page.evaluate((c) => {
    const set = (id, v) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.value = String(v);
      el.dispatchEvent(new Event('input', { bubbles: true }));
    };
    set('sl-lines', c.lps);
    set('sl-q0', c.q0);
    set('sl-qedge', c.qedge);
    // checkpoint (alpha does not affect any geometry)
    const a = document.getElementById('sl-alpha');
    if (a) set('sl-alpha', a.value);
    const u = document.getElementById('btn-undo');
    if (u) u.click();
  }, cfg);
  await page.waitForTimeout(800);
}

async function measure(page, cfg) {
  await applyConfig(page, cfg);
  const tris = await readNum(page, '#d-triangles');
  const surfaces = await readNum(page, '#d-surfaces');
  const fieldlines = await readNum(page, '#d-fieldlines');
  const q0 = await readNum(page, '#d-q0');
  const qedge = await readNum(page, '#d-qedge');
  return { cfg, tris, surfaces, fieldlines, q0, qedge };
}

function configApplied(m) {
  return Number.isFinite(m.tris) && m.tris > 0 &&
    Number.isFinite(m.surfaces) && m.surfaces > 0 &&
    Math.abs(m.q0 - m.cfg.q0) < 0.006 &&
    Math.abs(m.qedge - m.cfg.qedge) < 0.006;
}

// ── P2P (unchanged) ────────────────────────────────────────────────────────
test('[P2P] app boots and renders content', async ({ page }) => {
  await boot(page);
  const has = await page.evaluate(() => !!document.body && document.body.children.length > 0);
  expect(has).toBe(true);
});
test('[P2P] no layout overflow (UI fits the viewport)', async ({ page }) => {
  await boot(page);
  const o = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(o).toBeLessThanOrEqual(2);
});

// ── F2P (randomized invariants) ────────────────────────────────────────────
test("[F2P] The RENDER / TRIANGLES readout in the right panel shows a hugely inflated triangle count because the q=1/2/3 '", async ({ page }) => {
  await boot(page);
  await waitReady(page);

  // Random inputs.
  const lines = fixture.randLinePair();                 // two distinct lines/surface values
  const kLow = fixture.randInt(1, 2);
  const cfgLow = fixture.randPlasma(kLow);              // plasma with kLow marker rings
  const cfgHigh = fixture.randPlasma(kLow + 1);         // plasma with kLow+1 marker rings

  // Expected marker counts DERIVED from the random plasma parameters.
  const ringsLow = fixture.ringCount(cfgLow.q0, cfgLow.qedge);
  const ringsHigh = fixture.ringCount(cfgHigh.q0, cfgHigh.qedge);

  // Same plasma, two different field-line densities -> cost of ONE field-line tube.
  const mA = await measure(page, { q0: cfgLow.q0, qedge: cfgLow.qedge, lps: lines.low });
  const mB = await measure(page, { q0: cfgLow.q0, qedge: cfgLow.qedge, lps: lines.high });
  // Same field-line density, different number of marker rings -> cost of ONE marker.
  const mC = await measure(page, { q0: cfgHigh.q0, qedge: cfgHigh.qedge, lps: lines.low });

  const surfaces = mA.surfaces;
  const addedLines = (lines.high - lines.low) * surfaces;
  const perLine = (mB.tris - mA.tris) / addedLines;
  const perRing = (mC.tris - mA.tris) / (ringsHigh - ringsLow);

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ cfgLow, cfgHigh, lines, ringsLow, ringsHigh, surfaces,
    trisA: mA.tris, trisB: mB.tris, trisC: mC.tris, perLine, perRing }));

  const ok = configApplied(mA) && configApplied(mB) && configApplied(mC) &&
    mA.surfaces === mB.surfaces && mA.surfaces === mC.surfaces &&
    ringsHigh > ringsLow &&
    Number.isFinite(perLine) && perLine > 0 && Number.isInteger(perLine) &&
    Number.isFinite(perRing) && perRing > 0 && Number.isInteger(perRing) &&
    // a q=1/2/3 marker must be a thin low-poly ring: cheaper than one field-line tube
    perRing < perLine;

  expect(ok).toBe(true);
});

test("[F2P] The q=1/2/3 markers are drawn as thick full shells wrapped over the flux surfaces, and the RENDER panel report", async ({ page }) => {
  await boot(page);
  await waitReady(page);

  // Random inputs.
  const lines = fixture.randLinePair();
  const cfg = fixture.randPlasma(fixture.randInt(2, 3));
  const flat = fixture.zeroRingPlasma();                // profile with no rational surfaces
  const rings = fixture.ringCount(cfg.q0, cfg.qedge);   // expected marker count, derived
  const flatRings = fixture.ringCount(flat.q0, flat.qedge);

  const mFlat = await measure(page, { q0: flat.q0, qedge: flat.qedge, lps: lines.low });
  const mRings = await measure(page, { q0: cfg.q0, qedge: cfg.qedge, lps: lines.low });
  const mRings2 = await measure(page, { q0: cfg.q0, qedge: cfg.qedge, lps: lines.high });

  const surfaces = mRings.surfaces;
  const perLine = (mRings2.tris - mRings.tris) / ((lines.high - lines.low) * surfaces);
  const markerTotal = mRings.tris - mFlat.tris;         // triangles spent on `rings` markers

  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ cfg, flat, lines, rings, flatRings, surfaces,
    trisFlat: mFlat.tris, trisRings: mRings.tris, trisRings2: mRings2.tris,
    perLine, markerTotal }));

  const ok = configApplied(mFlat) && configApplied(mRings) && configApplied(mRings2) &&
    flatRings === 0 && rings >= 2 &&
    mFlat.surfaces === mRings.surfaces && mRings.surfaces === mRings2.surfaces &&
    Number.isFinite(perLine) && perLine > 0 && Number.isInteger(perLine) &&
    Number.isFinite(markerTotal) &&
    markerTotal > 0 &&                       // the markers are actually drawn
    markerTotal % rings === 0 &&             // identical cost per marker ring
    // ALL markers together must cost less than a single field-line tube
    markerTotal < perLine;

  expect(ok).toBe(true);
});