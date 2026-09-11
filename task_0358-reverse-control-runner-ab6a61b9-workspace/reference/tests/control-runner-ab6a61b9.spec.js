const { test, expect } = require('@playwright/test');
const APP_URL = process.env.APP_URL;
async function boot(page) {
  await page.goto(APP_URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(600);
}
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
test("[F2P] The heads-up display reports a total number of levels that is smaller than 10 when the game starts.", async ({ page }) => {
  await boot(page);
  await page.goto(APP_URL.replace(/\/$/, '') + "/", { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator("canvas").first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator("#hud").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("LEVEL 1 / 10");
});
test("[F2P] The level/status text spills outside the edge of the game panel and is visually clipped.", async ({ page }) => {
  await boot(page);
  await page.goto(APP_URL.replace(/\/$/, '') + "/", { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator("canvas").first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = await page.evaluate((a) => {
    const el = document.querySelector(a.sel); if (!el) return 'MISSING';
    const c = a.cont ? document.querySelector(a.cont) : document.documentElement;
    if (!c) return 'NOCONTAINER';
    const r = el.getBoundingClientRect(), cr = c.getBoundingClientRect();
    return (r.left>=cr.left-1 && r.right<=cr.right+1 && r.top>=cr.top-1 && r.bottom<=cr.bottom+1 && r.width>0 && r.height>0) ? 'OK' : 'CLIPPED';
  }, { sel: "#hud", cont: "body" });
  expect(v).toEqual('OK');
});
test("[F2P] The game still reports/spawns a glitch obstacle state after starting a level even though glitches were suppose", async ({ page }) => {
  await boot(page);
  await page.goto(APP_URL.replace(/\/$/, '') + "/", { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator("canvas").first().waitFor({ timeout: 15000 });
  await page.locator("canvas").first().click({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator("#glitch").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("false");
});
test('[P2P] the page is not blank', async ({ page }) => {
  await boot(page);
  const n = await page.evaluate(() => ((document.body && document.body.innerText) || '').trim().length + document.querySelectorAll('canvas,svg,img').length);
  expect(n).toBeGreaterThan(0);
});
test('[P2P] a control or render surface is present', async ({ page }) => {
  await boot(page);
  const n = await page.evaluate(() => document.querySelectorAll('canvas, button, [role="button"], a, input, select').length);
  expect(n).toBeGreaterThan(0);
});
test('[P2P] the main render surface has non-zero size', async ({ page }) => {
  await boot(page);
  const ok = await page.evaluate(() => { const el = document.querySelector('canvas, #app, #root, main') || document.body; if (!el) return false; const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; });
  expect(ok).toBe(true);
});
