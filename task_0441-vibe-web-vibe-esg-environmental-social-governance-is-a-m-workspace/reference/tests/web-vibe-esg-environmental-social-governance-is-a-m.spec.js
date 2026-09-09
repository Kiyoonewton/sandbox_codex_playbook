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
test('[F2P] The landing page promises \'Search 1000+ public companies\' while the search index only contains about 50 companies.', async ({ page }) => {
  await boot(page);
  await page.goto(APP_URL.replace(/\/$/, '') + "/", { waitUntil: 'networkidle', timeout: 30000 });
  await page.locator("#hero").first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(400);
  const v = (await page.locator("#hero .hero-inner > p").first().innerText({ timeout: 10000 })).trim();
  expect(v).toEqual("Search 51 public companies. Environmental impact. Social responsibility. Corporate governance. All in one place.");
});
