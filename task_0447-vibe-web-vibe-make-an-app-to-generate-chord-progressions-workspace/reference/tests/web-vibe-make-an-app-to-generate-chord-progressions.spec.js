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
test('[F2P] After ticking \'Use flats (Bb instead of A#)\', the root-note buttons still read C#, D#, F#, G#, A# instead of switching', async ({ page }) => {
  await boot(page);
  await page.goto(APP_URL.replace(/\/$/, '') + "/", { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator("#root-grid .root-btn").first().waitFor({ timeout: 15000 });
  await page.locator("#toggle-flats").first().click({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator("#root-grid .root-btn:nth-child(2)").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("Db");
});
test('[F2P] Clicking the second diatonic chord tile (ii) in C Major leaves the big chord name showing something other than \'Dm\'.', async ({ page }) => {
  await boot(page);
  await page.goto(APP_URL.replace(/\/$/, '') + "/", { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator("#diatonic-chords .diatonic-item").first().waitFor({ timeout: 15000 });
  await page.locator("#diatonic-chords .diatonic-item:nth-child(2)").first().click({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator("#chord-display .chord-name").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("Dm");
});
