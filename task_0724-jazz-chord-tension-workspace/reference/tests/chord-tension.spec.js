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
test('[F2P] In the altered-dominant chord the flat-9 note sits right on top of the root — the two dots and their \'C\'/\'C#\' labels', async ({ page }) => {
  await boot(page);
  await page.locator("#interval-tbody tr").first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator("#interval-tbody tr:nth-child(6) td:nth-child(2) span:nth-child(4)").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("C\u2013C# Minor 9th");
});
test('[F2P] In the Tension Spectrum ranking the second bar from the top is Cmaj7#11 — the app claims the bright, floating major-7♯11', async ({ page }) => {
  await boot(page);
  await page.locator("#tension-ranking .rank-row").first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator("#tension-ranking .rank-row:nth-child(2) .rank-label").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("C\u00b07");
});
