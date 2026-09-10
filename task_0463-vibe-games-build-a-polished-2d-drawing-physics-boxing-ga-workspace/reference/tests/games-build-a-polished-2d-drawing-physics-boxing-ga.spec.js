const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;
const PREAMBLE = "(() => {\n  // --- deterministic Math.random (mulberry32, fixed seed) ---\n  let _s = (1337) >>> 0;\n  Math.random = function () {\n    _s |= 0; _s = (_s + 0x6D2B79F5) | 0;\n    let t = Math.imul(_s ^ (_s >>> 15), 1 | _s);\n    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;\n    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;\n  };\n  // --- settle animations/transitions so a captured frame is stable & identical across builds ---\n  const css = '*,*::before,*::after{animation-duration:0s!important;animation-delay:0s!important;'\n            + 'transition-duration:0s!important;transition-delay:0s!important;'\n            + 'caret-color:transparent!important;scroll-behavior:auto!important}';\n  const inject = () => {\n    const root = document.head || document.documentElement;\n    if (!root) return;\n    const st = document.createElement('style');\n    st.setAttribute('data-sand-determinism', '1');\n    st.textContent = css;\n    root.appendChild(st);\n  };\n  if (document.readyState === 'loading') {\n    document.addEventListener('DOMContentLoaded', inject);\n  } else {\n    inject();\n  }\n})();";
const READY_HOOKS = [];
async function boot(page) {
  await page.addInitScript(PREAMBLE);
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  try { await page.waitForFunction((hs) => document.readyState === 'complete' && hs.every(h => typeof window[h] !== 'undefined'), READY_HOOKS, { timeout: 15000 }); } catch (e) {}
  await page.waitForTimeout(800);
}
test('[P2P] game boots and renders content', async ({ page }) => {
  await boot(page);
  const has = await page.evaluate(() => !!document.body && document.body.children.length > 0);
  expect(has).toBe(true);
});
test('[P2P] canvas or root element renders', async ({ page }) => {
  await boot(page);
  const ok = await page.evaluate(() => !!(document.querySelector('canvas') || document.querySelector('#app') || document.body.firstElementChild));
  expect(ok).toBe(true);
});
test('[P2P] no layout overflow (UI fits the viewport)', async ({ page }) => {
  await boot(page);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(2);
});
test('[F2P] After clearing levels and moving on, the trophy \'Best\' readout on screen shows a smaller number than the level you are', async ({ page }) => {
  await boot(page);
  const v = await page.evaluate(async () => { localStorage.removeItem('dpMax'); GameState.maxLvl = 1; GameState.start(); const n = 1 + (crypto.getRandomValues(new Uint32Array(1))[0] % 5); const hit = () => { const ex = GameState.redB.x * innerWidth, ey = GameState.redB.y * innerHeight; GameState.smoothPath = [{x: ex - 80, y: ey}, {x: ex, y: ey}]; GameState.punchDone(); }; for (let i = 0; i < n; i++) { hit(); GameState.next(); } return GameState.lvl === 1 + n && GameState.maxLvl === GameState.lvl && +(localStorage.getItem('dpMax') || '1') === GameState.lvl; });
  expect(v).toEqual(true);
});
test('[F2P] After being sent back to the start and landing a clean punch, pressing continue drops you into a far later level instead', async ({ page }) => {
  await boot(page);
  const v = await page.evaluate(async () => { localStorage.removeItem('dpMax'); GameState.maxLvl = 1; GameState.start(); const k = 2 + (crypto.getRandomValues(new Uint32Array(1))[0] % 4); const hit = () => { const ex = GameState.redB.x * innerWidth, ey = GameState.redB.y * innerHeight; GameState.smoothPath = [{x: ex - 80, y: ey}, {x: ex, y: ey}]; GameState.punchDone(); }; for (let i = 0; i < k; i++) { hit(); GameState.next(); } const reached = GameState.lvl; GameState.goToLevel1(); const atOne = GameState.lvl === 1; hit(); GameState.next(); return atOne && reached === 1 + k && GameState.lvl === 2; });
  expect(v).toEqual(true);
});
test('[F2P] Once you have been sent back to the start, hitting retry throws you into a completely different, much harder level inste', async ({ page }) => {
  await boot(page);
  const v = await page.evaluate(async () => { localStorage.removeItem('dpMax'); GameState.maxLvl = 1; GameState.start(); const k = 2 + (crypto.getRandomValues(new Uint32Array(1))[0] % 4); const hit = () => { const ex = GameState.redB.x * innerWidth, ey = GameState.redB.y * innerHeight; GameState.smoothPath = [{x: ex - 80, y: ey}, {x: ex, y: ey}]; GameState.punchDone(); }; for (let i = 0; i < k; i++) { hit(); GameState.next(); } GameState.goToLevel1(); GameState.retry(); const a = GameState.lvl; GameState.retry(); return a === 1 && GameState.lvl === 1; });
  expect(v).toEqual(true);
});
test('[F2P] As soon as play begins, the retry/pause controls sit past the right edge of the window and are cut off, so they cannot b', async ({ page }) => {
  await boot(page);
  const v = await page.evaluate(async () => { localStorage.removeItem('dpMax'); GameState.maxLvl = 1; GameState.start(); const hb = document.getElementById('hudButtons').getBoundingClientRect(); return hb.width > 0 && hb.right <= innerWidth + 1 && hb.left >= -1 && hb.top >= -1 && hb.bottom <= innerHeight + 1; });
  expect(v).toEqual(true);
});
test('[F2P] After a start-over, the celebration banner announces a level number that is nothing like the one you just played.', async ({ page }) => {
  await boot(page);
  const v = await page.evaluate(async () => { localStorage.removeItem('dpMax'); GameState.maxLvl = 1; GameState.start(); const k = 2 + (crypto.getRandomValues(new Uint32Array(1))[0] % 4); const hit = () => { const ex = GameState.redB.x * innerWidth, ey = GameState.redB.y * innerHeight; GameState.smoothPath = [{x: ex - 80, y: ey}, {x: ex, y: ey}]; GameState.punchDone(); }; for (let i = 0; i < k; i++) { hit(); GameState.next(); } GameState.goToLevel1(); hit(); await new Promise(r => setTimeout(r, 1000)); return document.getElementById('lcText').textContent === 'LEVEL ' + GameState.lvl + ' CLEAR!'; });
  expect(v).toEqual(true);
});
